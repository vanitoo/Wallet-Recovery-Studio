import { bitcoinStandardWalletProfile } from "../bitcoin-standard";

export type FoundationProfile = {
  id: string;
  label: string;
  standard: string;
  path: string;
  addressType: string;
};

export const foundationProfiles: FoundationProfile[] =
  bitcoinStandardWalletProfile.profiles.map((profile) => ({
    id: profile.id,
    label: profile.name,
    standard: profile.standard,
    path: profile.pathTemplate
      .replace("{account}", "0")
      .replace("{change}", "0")
      .replace("{index}", "i"),
    addressType: profile.scriptType.toUpperCase(),
  }));
