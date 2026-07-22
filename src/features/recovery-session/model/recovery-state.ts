export type RecoveryMode = "known-address" | "wallet-profile" | "custom-path";

export type RecoveryState =
  | { status: "idle" }
  | { status: "ready"; mode: RecoveryMode }
  | { status: "running"; checked: number; currentPath: string }
  | { status: "paused"; checked: number; currentPath: string }
  | { status: "completed"; matches: number }
  | { status: "cancelled"; checked: number }
  | { status: "failed"; message: string };
