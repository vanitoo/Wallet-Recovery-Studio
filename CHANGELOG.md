# Changelog

All notable changes to this project will be documented here.

## [Unreleased]

### Planned

- BIP39 dependency review and Seed Inspector implementation.
- Official seed-to-address test vectors before address derivation is enabled.

## [0.1.1] - 2026-07-23

### Added

- Versioned wallet-profile schema.
- Standard Bitcoin BIP44, BIP49, BIP84 and BIP86 derivation profiles.
- Conservative account, branch and address-index limits.
- Source provenance and verification metadata.
- Wallet profile database integrity validation.
- ROADMAP.md and VERSION.md.

### Changed

- Existing foundation cards now derive their data from the wallet-profile database.
- Wallet Profile Database foundation was moved before Seed Inspector in the implementation order.
- The application interface, metadata, accessibility labels and standard profile display names are now Russian-first.
- The main workspace now clearly shows the completed v0.1.1 status and profile database boundaries.

### Security

- No cryptographic dependency or seed input was introduced.
- Hard maximum ranges are represented in the profile contract to prevent unbounded future scans.

## [0.1.0] - 2026-07-23

### Added

- Initial Wallet Recovery Studio application shell.
- Bitcoin-first Recovery Workspace.
- Explicit recovery-session state model.
- Foundation wallet profiles for BIP44, BIP49, BIP84 and BIP86.
- Threat model, architecture and security policy.
- CI and GitHub Pages workflows.

### Changed

- Replaced the generic browser file-tool concept with a wallet recovery diagnostic workspace.
- Refined the roadmap to separate local derivation from optional network activity scans.

### Security

- Cryptographic input is intentionally disabled in the foundation release.
- Defined non-persistence and no-telemetry requirements before seed handling is introduced.
