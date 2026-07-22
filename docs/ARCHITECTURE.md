# Architecture

Wallet Recovery Studio is a static, local-first Next.js application. The first implementation is intentionally Bitcoin-first. Additional networks must be isolated domain modules rather than conditionals spread across the UI.

## Layers

- `app` — composition and global styling
- `components` — reusable presentation components
- `features` — user-facing workflows
- `features/*/model` — state machines and typed workflow contracts
- `features/wallet-profiles` — versioned public compatibility data
- `lib` — small technology-agnostic utilities
- `workers` — future CPU-heavy derivation execution

## Data flow

```text
sensitive input
  -> validation
  -> volatile recovery session
  -> deterministic scan plan
  -> Web Worker batches
  -> local public-address matcher
  -> sanitized result
```

No secret may enter URL state, localStorage, sessionStorage, IndexedDB, logs, analytics, error reports or exported reports.

## State model

Recovery workflows use discriminated unions instead of independent boolean flags. This prevents impossible states such as running and completed at the same time.

## Network boundary

Offline derivation and address matching are core features. Blockchain activity lookup is a separate optional adapter layer and must never be silently triggered.

## Dependency policy

Cryptographic primitives must come from maintained, reviewed libraries with official test vectors. Dependencies are pinned deliberately and added only after documenting their purpose.
