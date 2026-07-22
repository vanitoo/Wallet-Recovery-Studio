export type FoundationProfile = {
  id: string;
  label: string;
  standard: string;
  path: string;
  addressType: string;
};

export const foundationProfiles: FoundationProfile[] = [
  { id: "bip44", label: "Legacy", standard: "BIP44", path: "m/44'/0'/0'/0/i", addressType: "P2PKH" },
  { id: "bip49", label: "Nested SegWit", standard: "BIP49", path: "m/49'/0'/0'/0/i", addressType: "P2SH-P2WPKH" },
  { id: "bip84", label: "Native SegWit", standard: "BIP84", path: "m/84'/0'/0'/0/i", addressType: "P2WPKH" },
  { id: "bip86", label: "Taproot", standard: "BIP86", path: "m/86'/0'/0'/0/i", addressType: "P2TR" },
];
