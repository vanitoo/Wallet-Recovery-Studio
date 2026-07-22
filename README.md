# Wallet Recovery Studio

Privacy-first browser workspace for diagnosing cryptocurrency wallet recovery problems.

Wallet Recovery Studio helps users understand why valid recovery material can produce unexpected addresses in another wallet. It is designed to compare known public addresses, derivation paths and wallet profiles locally in the browser.

> [!IMPORTANT]
> This project is a diagnostic tool, not a wallet. It does not hold funds, sign transactions or recover unknown seed phrases.

## Status

**v0.1 Foundation** is implemented: static application shell, Bitcoin-first scope, initial domain model, security boundaries, documentation and CI. Cryptographic derivation is intentionally deferred until dependency review and test vectors are ready.

## Principles

- Local-first and offline-capable
- No registration, analytics, cookies or telemetry
- No automatic network requests
- Secrets are never persisted by the application
- Public results are separated from sensitive inputs
- Small, auditable dependency surface
- Strict TypeScript validation

## Workspace roadmap

- **Recovery** — guided known-address discovery
- **Seed Inspector** — local phrase and checksum diagnostics
- **Wallet Profiles** — documented derivation conventions
- **Derivation Explorer** — expert path exploration
- **Security** — threat model and safe operating guidance

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

See [TODO.md](TODO.md).

## License

MIT
