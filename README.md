# Wallet Recovery Studio

Privacy-first browser workspace for diagnosing cryptocurrency wallet recovery problems.

Wallet Recovery Studio helps users understand why valid recovery material can produce unexpected addresses in another wallet. It is designed to compare known public addresses, derivation paths and wallet profiles locally in the browser.

> [!IMPORTANT]
> This project is a diagnostic tool, not a wallet. It does not hold funds, sign transactions or recover unknown seed phrases.

## Status

**v0.1.1 Wallet Profile Database Foundation** is implemented.

The project now includes a versioned Bitcoin wallet-profile schema, conservative scan ranges, source verification metadata, integrity validation and standard BIP44/BIP49/BIP84/BIP86 profiles. Seed input and cryptographic derivation remain intentionally disabled until v0.2 dependency review and official test vectors are added.

## What is implemented

- Static local-first Recovery Workspace
- Strict recovery-session state model
- Versioned wallet-profile database contract
- Standard Bitcoin derivation profiles:
  - BIP44 / P2PKH
  - BIP49 / P2SH-P2WPKH
  - BIP84 / P2WPKH
  - BIP86 / P2TR
- Conservative defaults: accounts 0–4, branches 0 and 1, indexes 0–19
- Runtime database integrity validation
- Security boundaries, threat model and CI

## Profile database design

Wallet profiles describe address derivation rules rather than application screens. A wallet record can contain multiple derivation profiles and includes:

- network and seed format;
- passphrase support;
- derivation path template;
- script type;
- account, branch and index limits;
- historical rules and limitations;
- source URL, verification status and verification date.

The database is located in `src/features/wallet-profiles/`.

Real wallet profiles such as Ledger Live, Trezor Suite and Electrum will be added only after their behavior is confirmed from reliable sources. Data from third-party compatibility databases will not be copied automatically without checking licensing and provenance.

## Principles

- Local-first and offline-capable
- No registration, analytics, cookies or telemetry
- No automatic network requests
- Secrets are never persisted by the application
- Public results are separated from sensitive inputs
- Small, auditable dependency surface
- Strict TypeScript validation

## Development

Requirements: Node.js 22 and npm 10+.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run check
```

## GitHub Pages

The project uses static export. In repository settings, select **GitHub Actions** as the Pages deployment source.

## Security warning

A browser application cannot guarantee immediate removal of secrets from memory. For wallets containing meaningful funds, use an offline computer with a trusted operating system and disable browser extensions.

Never enter a recovery phrase into a hosted copy you do not personally trust. Prefer a reviewed local release.

See [SECURITY.md](SECURITY.md) and [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md).

## Roadmap

See [ROADMAP.md](ROADMAP.md) for milestones and [TODO.md](TODO.md) for the implementation checklist.

## License

MIT
