# Security Policy

## Supported versions

Wallet Recovery Studio is pre-release software. Only the current `main` branch is supported.

## Reporting a vulnerability

Do not publish seed phrases, private keys, xprv values or real wallet data in an issue.

Report vulnerabilities through GitHub private vulnerability reporting when enabled. Otherwise, open a minimal issue that contains no exploit secret and asks the maintainer for a private contact channel.

## Security guarantees

The application is designed to:

- run locally as a static browser application;
- avoid analytics, telemetry and hidden API calls;
- avoid persisting recovery secrets;
- require explicit user action before any future network request.

The application cannot protect users from a compromised operating system, malicious browser extension, modified build or untrusted hosted copy.

See `docs/THREAT_MODEL.md`.
