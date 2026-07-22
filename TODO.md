# Wallet Recovery Studio Roadmap

## v0.1 — Foundation ✅

- [x] Adapt privacy-first Next.js template
- [x] Create Recovery Workspace shell
- [x] Add strict recovery state model
- [x] Establish Bitcoin-first scope
- [x] Document security boundaries and threat model
- [x] Add CI and GitHub Pages deployment
- [x] Add README, CHANGELOG and architecture documentation

## v0.2 — Seed Inspector

- [ ] Review and select audited BIP39/BIP32 dependencies
- [ ] Validate 12/15/18/21/24-word BIP39 phrases locally
- [ ] Verify checksum and language
- [ ] Support optional BIP39 passphrase with clear warning
- [ ] Distinguish BIP39 from Electrum and SLIP39 formats
- [ ] Add official test vectors
- [ ] Prevent persistence, logging and accidental export of secrets

## v0.3 — Known Address Discovery

- [ ] Generate Bitcoin addresses for BIP44, BIP49, BIP84 and BIP86
- [ ] Match a user-provided public address locally
- [ ] Run derivation batches in a Web Worker
- [ ] Add progress, pause, resume and cancel
- [ ] Search controlled account/change/index ranges
- [ ] Export sanitized match report without secrets

## v0.4 — Wallet Profile Database

- [ ] Define versioned wallet-profile schema
- [ ] Add source URL, verification status and test vectors per profile
- [ ] Add Ledger, Trezor, Electrum, Sparrow, BlueWallet and historical profiles
- [ ] Research walletsrecovery.org licensing before importing any data
- [ ] Detect conflicts and duplicate path definitions

## v0.5 — Derivation Explorer

- [ ] Custom derivation path parser
- [ ] Safe range editor with scan-cost estimate
- [ ] Address and xpub preview
- [ ] Descriptor preview for supported Bitcoin script types
- [ ] CSV/JSON export of public information only

## v0.6 — Account Discovery

- [ ] Configurable gap limit
- [ ] Controlled account discovery
- [ ] Deterministic scan plans
- [ ] Resume metadata without storing seed material
- [ ] Performance benchmarks

## v0.7 — Optional Activity Scan

- [ ] Explicit opt-in network mode
- [ ] Self-hosted Bitcoin Core integration design
- [ ] Electrum/Esplora connector design
- [ ] Privacy disclosure before every external request
- [ ] Rate limits, batching and cancellation
- [ ] Never enable public API scanning by default

## v0.8 — Descriptor and Multisig Diagnostics

- [ ] Parse and validate descriptors
- [ ] Descriptor checksum
- [ ] Identify available cosigner public keys
- [ ] Validate multisig policy and key order
- [ ] Do not claim recovery of unknown private cosigners

## v0.9 — Additional Networks

- [ ] Evaluate Ethereum/EVM as a separate domain module
- [ ] Add networks only with maintained libraries and test vectors
- [ ] Avoid a generic multi-coin abstraction until two implementations prove it useful

## v1.0 — Audited Release

- [ ] Reproducible release build
- [ ] Offline downloadable package
- [ ] Complete user and developer documentation
- [ ] Accessibility review
- [ ] Dependency and security review
- [ ] Stable wallet-profile database
- [ ] End-to-end recovery test suite
