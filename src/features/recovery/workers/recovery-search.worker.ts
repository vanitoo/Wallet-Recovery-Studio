/// <reference lib="webworker" />

import { BIP32Factory } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

import type { RecoveryMatch, SearchProgress, SupportedProfile } from "../lib/recovery-search";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

const PROFILE_CONFIG: Record<SupportedProfile, { purpose: number; standard: string; scriptType: string }> = {
  bip44: { purpose: 44, standard: "BIP44", scriptType: "P2PKH" },
  bip49: { purpose: 49, standard: "BIP49", scriptType: "P2SH-P2WPKH" },
  bip84: { purpose: 84, standard: "BIP84", scriptType: "P2WPKH" },
  bip86: { purpose: 86, standard: "BIP86", scriptType: "P2TR" },
};

type StartMessage = {
  type: "start";
  payload: {
    mnemonic: string;
    passphrase: string;
    knownAddresses: string[];
    profiles: SupportedProfile[];
    accountEnd: number;
    indexEnd: number;
  };
};

type ControlMessage = { type: "pause" | "resume" | "stop" };
type WorkerInput = StartMessage | ControlMessage;

type WorkerOutput =
  | { type: "progress"; payload: SearchProgress }
  | { type: "match"; payload: RecoveryMatch }
  | { type: "paused" }
  | { type: "resumed" }
  | { type: "stopped" }
  | { type: "complete"; payload: { matches: RecoveryMatch[]; checked: number; total: number } }
  | { type: "error"; payload: string };

let paused = false;
let stopped = false;
let resumeWaiters: Array<() => void> = [];

function post(message: WorkerOutput) {
  self.postMessage(message);
}

function addressFor(profile: SupportedProfile, publicKey: Uint8Array): string {
  if (profile === "bip44") {
    const payment = bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin });
    if (!payment.address) throw new Error("Не удалось сформировать P2PKH-адрес.");
    return payment.address;
  }
  if (profile === "bip49") {
    const redeem = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin });
    const payment = bitcoin.payments.p2sh({ redeem, network: bitcoin.networks.bitcoin });
    if (!payment.address) throw new Error("Не удалось сформировать P2SH-P2WPKH-адрес.");
    return payment.address;
  }
  if (profile === "bip84") {
    const payment = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: bitcoin.networks.bitcoin });
    if (!payment.address) throw new Error("Не удалось сформировать P2WPKH-адрес.");
    return payment.address;
  }
  const payment = bitcoin.payments.p2tr({ internalPubkey: publicKey.slice(1, 33), network: bitcoin.networks.bitcoin });
  if (!payment.address) throw new Error("Не удалось сформировать P2TR-адрес.");
  return payment.address;
}

async function waitWhilePaused() {
  if (!paused) return;
  await new Promise<void>((resolve) => resumeWaiters.push(resolve));
}

function releasePause() {
  const waiters = resumeWaiters;
  resumeWaiters = [];
  waiters.forEach((resolve) => resolve());
}

async function run(payload: StartMessage["payload"]) {
  paused = false;
  stopped = false;
  const mnemonic = payload.mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
  if (!bip39.validateMnemonic(mnemonic, bip39.wordlists.english)) {
    throw new Error("Seed-фраза не прошла проверку BIP39 checksum для английского словаря.");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic, payload.passphrase);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
  const targets = new Set(payload.knownAddresses.map((address) => address.trim()));
  const matches: RecoveryMatch[] = [];
  const total = payload.profiles.length * (payload.accountEnd + 1) * 2 * (payload.indexEnd + 1);
  let checked = 0;

  try {
    for (const profile of payload.profiles) {
      const config = PROFILE_CONFIG[profile];
      for (let account = 0; account <= payload.accountEnd; account += 1) {
        for (const change of [0, 1]) {
          for (let index = 0; index <= payload.indexEnd; index += 1) {
            await waitWhilePaused();
            if (stopped) {
              post({ type: "stopped" });
              return;
            }

            const path = `m/${config.purpose}'/0'/${account}'/${change}/${index}`;
            const address = addressFor(profile, root.derivePath(path).publicKey);
            checked += 1;

            if (targets.has(address)) {
              const match = { profile, standard: config.standard, scriptType: config.scriptType, path, account, change, index, address };
              matches.push(match);
              targets.delete(address);
              post({ type: "match", payload: match });
            }

            if (checked === 1 || checked % 20 === 0 || checked === total) {
              post({ type: "progress", payload: { checked, total, profile, account, change, index, found: matches.length, targets: payload.knownAddresses.length } });
              await new Promise<void>((resolve) => setTimeout(resolve, 0));
            }

            if (targets.size === 0) {
              post({ type: "complete", payload: { matches, checked, total } });
              return;
            }
          }
        }
      }
    }
    post({ type: "complete", payload: { matches, checked, total } });
  } finally {
    seed.fill(0);
  }
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const message = event.data;
  if (message.type === "pause") {
    if (!paused && !stopped) {
      paused = true;
      post({ type: "paused" });
    }
    return;
  }
  if (message.type === "resume") {
    if (paused && !stopped) {
      paused = false;
      releasePause();
      post({ type: "resumed" });
    }
    return;
  }
  if (message.type === "stop") {
    stopped = true;
    paused = false;
    releasePause();
    return;
  }
  void run(message.payload).catch((error) => {
    post({ type: "error", payload: error instanceof Error ? error.message : "Не удалось выполнить поиск." });
  });
};

export {};
