import { bitcoinStandardWalletProfile } from "./bitcoin-standard";
import {
  WALLET_PROFILE_SCHEMA_VERSION,
  type WalletProfileDatabase,
} from "./schema";
import { assertValidWalletProfileDatabase } from "./validation";

export const walletProfileDatabase: WalletProfileDatabase = {
  schemaVersion: WALLET_PROFILE_SCHEMA_VERSION,
  databaseVersion: "0.1.0",
  updatedAt: "2026-07-23",
  profiles: [bitcoinStandardWalletProfile],
};

assertValidWalletProfileDatabase(walletProfileDatabase);

export { bitcoinStandardWalletProfile } from "./bitcoin-standard";
export * from "./schema";
export * from "./validation";
