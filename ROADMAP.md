# Wallet Recovery Studio Roadmap

## Product direction

Wallet Recovery Studio is a local diagnostic environment for finding the derivation rules used by an existing cryptocurrency wallet. It is not a wallet, seed brute-forcer, custody product or transaction signer.

## Milestones

### v0.1 — Foundation

Application shell, recovery workspace, security boundaries, CI and static deployment.

### v0.1.1 — Wallet Profile Database Foundation

Versioned schema, standard Bitcoin BIP44/BIP49/BIP84/BIP86 profiles, bounded ranges and database validation.

### v0.2 — Seed Inspector

Local BIP39 validation, language and checksum diagnostics, optional passphrase handling and official test vectors.

### v0.3 — Known Address Discovery

Local Bitcoin address derivation and matching in a Web Worker with progress and cancellation.

### v0.4 — Real Wallet Profiles

Verified profiles for commonly used Bitcoin wallets, including historical behavior where reliable sources exist.

### v0.5 — Recovery Search Modes

Fast, smart and bounded full-search modes with ranking and scan-cost limits.

### v0.6 — Derivation Explorer and Reports

Expert path exploration and sanitized JSON/TXT reports.

### v0.7 — Optional Activity Scan

Explicit opt-in connectors for self-hosted Bitcoin Core, Electrum or Esplora. Public endpoints remain the least-private option.

### v0.8 — Descriptor and Multisig Diagnostics

Public descriptor, policy and cosigner diagnostics without claiming recovery of missing private material.

### v0.9 — Additional Networks

Evaluate additional networks as separate domain modules only after the Bitcoin implementation is stable.

### v1.0 — Audited Release

Stable database, reproducible offline build, full tests, security review and complete documentation.

## Non-goals

- Brute-forcing unknown seed words or passphrases
- Sending seed material to any API
- Holding funds or signing transactions
- Automatically exposing generated addresses to public services
- Claiming guaranteed recovery
