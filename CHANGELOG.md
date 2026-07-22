# Changelog

All notable changes to this project will be documented here.

## [Unreleased]

### Planned

- BIP39 dependency review and Seed Inspector implementation.

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
