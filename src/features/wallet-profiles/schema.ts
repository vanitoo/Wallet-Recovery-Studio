export const WALLET_PROFILE_SCHEMA_VERSION = 1 as const;

export type NetworkId = "bitcoin";
export type SeedFormat = "bip39" | "electrum" | "descriptor" | "unknown";
export type PassphraseSupport = "required" | "optional" | "unsupported" | "unknown";
export type ScriptType = "p2pkh" | "p2sh-p2wpkh" | "p2wpkh" | "p2tr";
export type ProfileVerificationStatus = "verified" | "partially-verified" | "research" | "deprecated";

export type IntegerRange = {
  defaultStart: number;
  defaultEnd: number;
  hardMaximum: number;
};

export type WalletProfileSource = {
  title: string;
  url: string;
  verifiedAt: string | null;
  status: ProfileVerificationStatus;
};

export type DerivationProfile = {
  id: string;
  name: string;
  standard: "BIP44" | "BIP49" | "BIP84" | "BIP86" | "custom";
  pathTemplate: string;
  scriptType: ScriptType;
  accountRange: IntegerRange;
  changeValues: readonly number[];
  indexRange: IntegerRange;
  validFrom?: string;
  validTo?: string;
  rules: readonly string[];
  limitations: readonly string[];
};

export type WalletProfile = {
  schemaVersion: typeof WALLET_PROFILE_SCHEMA_VERSION;
  id: string;
  wallet: string;
  network: NetworkId;
  seedFormat: SeedFormat;
  passphraseSupport: PassphraseSupport;
  category: "standard" | "hardware" | "desktop" | "mobile" | "multiplatform" | "node";
  source: WalletProfileSource;
  profiles: readonly DerivationProfile[];
  notes: readonly string[];
  tags: readonly string[];
};

export type WalletProfileDatabase = {
  schemaVersion: typeof WALLET_PROFILE_SCHEMA_VERSION;
  databaseVersion: string;
  updatedAt: string;
  profiles: readonly WalletProfile[];
};
