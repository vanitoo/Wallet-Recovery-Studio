# Wallet Recovery Studio Roadmap

## v0.1 — Foundation ✅

- [x] Privacy-first Next.js foundation
- [x] Russian Recovery Workspace
- [x] Bitcoin-first scope
- [x] Security boundaries, CI and GitHub Pages

## v0.1.1 — Wallet Profile Database Foundation ✅

- [x] Versioned wallet-profile schema
- [x] Standard BIP44, BIP49, BIP84 and BIP86 profiles
- [x] Conservative account, branch and index ranges
- [x] Source metadata and integrity validation

## v0.2 — Seed Inspector and basic known-address search 🚧

- [x] Add BIP39, BIP32 and Bitcoin address dependencies
- [x] Validate 12/15/18/21/24-word English BIP39 phrases locally
- [x] Verify BIP39 checksum
- [x] Support optional BIP39 passphrase with a warning
- [x] Validate Bitcoin mainnet addresses
- [x] Generate BIP44, BIP49, BIP84 and BIP86 addresses
- [x] Match one known public address locally
- [x] Add controlled account/change/index ranges and cost estimate
- [x] Add progress, cancellation and sensitive-data clearing
- [ ] Add official automated seed-to-address test vectors
- [ ] Detect additional BIP39 languages
- [ ] Distinguish Electrum and SLIP39 formats
- [ ] Move derivation batches into a Web Worker
- [ ] Add pause and resume
- [ ] Support multiple known addresses
- [ ] Export a sanitized JSON/TXT report

## v0.3 — Real Wallet Profiles

- [ ] Ledger Live and Trezor Suite profiles from official sources
- [ ] Electrum as a separate seed-format family
- [ ] Sparrow, BlueWallet and Bitcoin Core descriptor profiles
- [ ] Historical BRD, Copay/BitPay, Trust Wallet and Exodus rules
- [ ] Source URL, verification status and test vectors per profile
- [ ] Research walletsrecovery.org licensing before importing data

## v0.4 — Recovery Search Modes

- [ ] Fast search for a selected wallet
- [ ] Ranked smart search from device, year and address clues
- [ ] Bounded full search across compatible profiles
- [ ] Stop-on-first-match and continue-search options

## v0.5 — Derivation Explorer and Reports

- [ ] Custom derivation path parser
- [ ] Address and xpub preview
- [ ] JSON and TXT sanitized reports
- [ ] Descriptor preview

## v0.6 — Optional Activity Scan

- [ ] Explicit opt-in network mode
- [ ] Bitcoin Core, Electrum Server and Esplora connectors
- [ ] Privacy disclosure, rate limits, batching and cancellation
- [ ] Never enable public API scanning by default

## v1.0 — Audited Release

- [ ] Reproducible offline release
- [ ] Complete test suite and dependency audit
- [ ] Accessibility review
- [ ] Stable wallet-profile database
