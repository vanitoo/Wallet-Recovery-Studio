import { BIP32Factory } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

export type SupportedProfile = "bip44" | "bip49" | "bip84" | "bip86";

export type SearchProgress = {
  checked: number;
  total: number;
  profile: SupportedProfile;
  account: number;
  change: number;
  index: number;
  found: number;
  targets: number;
};

export type RecoveryMatch = {
  profile: SupportedProfile;
  standard: string;
  scriptType: string;
  path: string;
  account: number;
  change: number;
  index: number;
  address: string;
};

const PROFILE_CONFIG: Record<SupportedProfile, { purpose: number; standard: string; scriptType: string }> = {
  bip44: { purpose: 44, standard: "BIP44", scriptType: "P2PKH" },
  bip49: { purpose: 49, standard: "BIP49", scriptType: "P2SH-P2WPKH" },
  bip84: { purpose: 84, standard: "BIP84", scriptType: "P2WPKH" },
  bip86: { purpose: 86, standard: "BIP86", scriptType: "P2TR" },
};

function normalizeMnemonic(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function inspectMnemonic(value: string) {
  const mnemonic = normalizeMnemonic(value);
  const words = mnemonic ? mnemonic.split(" ") : [];
  const allowedWordCounts = [12, 15, 18, 21, 24];
  return {
    normalized: mnemonic,
    wordCount: words.length,
    validWordCount: allowedWordCounts.includes(words.length),
    validChecksum: bip39.validateMnemonic(mnemonic, bip39.wordlists.english),
  };
}

export function parseKnownAddresses(value: string): string[] {
  return [...new Set(value.split(/[\s,;]+/).map((item) => item.trim()).filter(Boolean))];
}

export function validateBitcoinAddress(address: string): boolean {
  try {
    bitcoin.address.toOutputScript(address.trim(), bitcoin.networks.bitcoin);
    return true;
  } catch {
    return false;
  }
}

export function inferProfilesForAddress(address: string): SupportedProfile[] {
  try {
    const script = bitcoin.address.toOutputScript(address.trim(), bitcoin.networks.bitcoin);
    if (script.length === 25 && script[0] === 0x76 && script[1] === 0xa9) return ["bip44"];
    if (script.length === 23 && script[0] === 0xa9) return ["bip49"];
    if (script.length === 22 && script[0] === 0x00 && script[1] === 0x14) return ["bip84"];
    if (script.length === 34 && script[0] === 0x51 && script[1] === 0x20) return ["bip86"];
    return [];
  } catch {
    return [];
  }
}

export function inferProfilesForAddresses(addresses: string[]): SupportedProfile[] {
  const inferred = new Set<SupportedProfile>();
  for (const address of addresses) {
    for (const profile of inferProfilesForAddress(address)) inferred.add(profile);
  }
  return [...inferred];
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
  const xOnly = publicKey.slice(1, 33);
  const payment = bitcoin.payments.p2tr({ internalPubkey: xOnly, network: bitcoin.networks.bitcoin });
  if (!payment.address) throw new Error("Не удалось сформировать P2TR-адрес.");
  return payment.address;
}

export async function searchKnownAddresses(options: {
  mnemonic: string;
  passphrase: string;
  knownAddresses: string[];
  profiles: SupportedProfile[];
  accountEnd: number;
  indexEnd: number;
  signal?: AbortSignal;
  onProgress?: (progress: SearchProgress) => void;
}): Promise<RecoveryMatch[]> {
  const mnemonic = normalizeMnemonic(options.mnemonic);
  if (!bip39.validateMnemonic(mnemonic, bip39.wordlists.english)) {
    throw new Error("Seed-фраза не прошла проверку BIP39 checksum для английского словаря.");
  }

  const addresses = [...new Set(options.knownAddresses.map((item) => item.trim()).filter(Boolean))];
  if (addresses.length === 0) throw new Error("Введите хотя бы один известный Bitcoin-адрес.");
  const invalid = addresses.filter((address) => !validateBitcoinAddress(address));
  if (invalid.length > 0) {
    throw new Error(`Некорректные Bitcoin mainnet-адреса: ${invalid.join(", ")}`);
  }

  const seed = await bip39.mnemonicToSeed(mnemonic, options.passphrase);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
  const total = options.profiles.length * (options.accountEnd + 1) * 2 * (options.indexEnd + 1);
  const remaining = new Set(addresses);
  const matches: RecoveryMatch[] = [];
  let checked = 0;

  try {
    for (const profile of options.profiles) {
      const config = PROFILE_CONFIG[profile];
      for (let account = 0; account <= options.accountEnd; account += 1) {
        for (const change of [0, 1]) {
          for (let index = 0; index <= options.indexEnd; index += 1) {
            if (options.signal?.aborted) throw new DOMException("Поиск отменён", "AbortError");
            const path = `m/${config.purpose}'/0'/${account}'/${change}/${index}`;
            const node = root.derivePath(path);
            const address = addressFor(profile, node.publicKey);
            checked += 1;

            if (remaining.has(address)) {
              matches.push({ profile, standard: config.standard, scriptType: config.scriptType, path, account, change, index, address });
              remaining.delete(address);
            }

            options.onProgress?.({
              checked,
              total,
              profile,
              account,
              change,
              index,
              found: matches.length,
              targets: addresses.length,
            });

            if (remaining.size === 0) return matches;
            if (checked % 25 === 0) await new Promise<void>((resolve) => setTimeout(resolve, 0));
          }
        }
      }
    }
    return matches;
  } finally {
    seed.fill(0);
  }
}
