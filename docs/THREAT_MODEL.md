# Threat Model

## Assets

- recovery phrases and optional passphrases;
- extended private keys;
- wallet structure and address history;
- derived public addresses and descriptors.

## Trusted boundary

The application code running on the user's device is inside the project boundary. The operating system, browser, extensions, clipboard, hosted deployment and external APIs may be compromised and are not assumed trustworthy.

## Primary threats

1. Secret persistence in browser storage, logs or reports.
2. Secret disclosure through network requests or telemetry.
3. Malicious browser extensions reading page content.
4. Supply-chain compromise in cryptographic dependencies.
5. Incorrect derivation results causing false recovery conclusions.
6. Privacy leakage from bulk address lookups.
7. Users trusting an altered hosted copy.

## Required controls

- No secret persistence.
- No analytics or telemetry.
- No implicit external requests.
- Web Worker isolation for long-running derivation.
- Official test vectors for every supported standard.
- Sanitized errors and exports.
- Explicit warnings before showing or copying sensitive material.

## Non-goals

The browser cannot guarantee immediate memory zeroization. The project cannot protect against a compromised OS, malicious firmware, screen capture or a modified application build.
