import {
  WALLET_PROFILE_SCHEMA_VERSION,
  type DerivationProfile,
  type WalletProfile,
} from "./schema";

const DEFAULT_ACCOUNT_RANGE = {
  defaultStart: 0,
  defaultEnd: 4,
  hardMaximum: 100,
} as const;

const DEFAULT_INDEX_RANGE = {
  defaultStart: 0,
  defaultEnd: 19,
  hardMaximum: 10_000,
} as const;

function createStandardDerivationProfile(
  profile: Pick<
    DerivationProfile,
    "id" | "name" | "standard" | "pathTemplate" | "scriptType"
  >,
): DerivationProfile {
  return {
    ...profile,
    accountRange: DEFAULT_ACCOUNT_RANGE,
    changeValues: [0, 1],
    indexRange: DEFAULT_INDEX_RANGE,
    rules: [
      "Account is hardened.",
      "Change 0 is the external/receive branch; change 1 is the internal/change branch.",
    ],
    limitations: [
      "Default ranges are intentionally conservative and must be expanded manually.",
      "A derivation match does not prove wallet ownership.",
    ],
  };
}

const standardProfiles: readonly DerivationProfile[] = [
  createStandardDerivationProfile({
    id: "bitcoin-bip44-p2pkh",
    name: "Bitcoin Legacy",
    standard: "BIP44",
    pathTemplate: "m/44'/0'/{account}'/{change}/{index}",
    scriptType: "p2pkh",
  }),
  createStandardDerivationProfile({
    id: "bitcoin-bip49-p2sh-p2wpkh",
    name: "Bitcoin Nested SegWit",
    standard: "BIP49",
    pathTemplate: "m/49'/0'/{account}'/{change}/{index}",
    scriptType: "p2sh-p2wpkh",
  }),
  createStandardDerivationProfile({
    id: "bitcoin-bip84-p2wpkh",
    name: "Bitcoin Native SegWit",
    standard: "BIP84",
    pathTemplate: "m/84'/0'/{account}'/{change}/{index}",
    scriptType: "p2wpkh",
  }),
  createStandardDerivationProfile({
    id: "bitcoin-bip86-p2tr",
    name: "Bitcoin Taproot",
    standard: "BIP86",
    pathTemplate: "m/86'/0'/{account}'/{change}/{index}",
    scriptType: "p2tr",
  }),
];

export const bitcoinStandardWalletProfile: WalletProfile = {
  schemaVersion: WALLET_PROFILE_SCHEMA_VERSION,
  id: "bitcoin-standard-paths",
  wallet: "Bitcoin standards",
  network: "bitcoin",
  seedFormat: "bip39",
  passphraseSupport: "optional",
  category: "standard",
  source: {
    title: "Bitcoin Improvement Proposals 44, 49, 84 and 86",
    url: "https://github.com/bitcoin/bips",
    verifiedAt: "2026-07-23",
    status: "verified",
  },
  profiles: standardProfiles,
  notes: [
    "These profiles describe standards, not the complete historical behavior of a specific wallet application.",
    "Real-wallet profiles may narrow ranges or add historical rules while reusing these conventions.",
  ],
  tags: ["bitcoin", "bip39", "standard", "discovery"],
};
