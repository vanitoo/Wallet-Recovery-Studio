import type {
  DerivationProfile,
  WalletProfile,
  WalletProfileDatabase,
} from "./schema";

export type ProfileValidationIssue = {
  path: string;
  message: string;
};

const REQUIRED_PATH_TOKENS = ["{account}", "{change}", "{index}"] as const;

function validateRange(
  path: string,
  range: DerivationProfile["accountRange"],
): ProfileValidationIssue[] {
  const issues: ProfileValidationIssue[] = [];

  if (!Number.isInteger(range.defaultStart) || range.defaultStart < 0) {
    issues.push({ path: `${path}.defaultStart`, message: "Must be a non-negative integer." });
  }

  if (!Number.isInteger(range.defaultEnd) || range.defaultEnd < range.defaultStart) {
    issues.push({ path: `${path}.defaultEnd`, message: "Must be an integer not lower than defaultStart." });
  }

  if (!Number.isInteger(range.hardMaximum) || range.hardMaximum < range.defaultEnd) {
    issues.push({ path: `${path}.hardMaximum`, message: "Must be an integer not lower than defaultEnd." });
  }

  return issues;
}

function validateDerivationProfile(
  profile: DerivationProfile,
  path: string,
): ProfileValidationIssue[] {
  const issues = [
    ...validateRange(`${path}.accountRange`, profile.accountRange),
    ...validateRange(`${path}.indexRange`, profile.indexRange),
  ];

  for (const token of REQUIRED_PATH_TOKENS) {
    if (!profile.pathTemplate.includes(token)) {
      issues.push({ path: `${path}.pathTemplate`, message: `Missing required token ${token}.` });
    }
  }

  if (profile.changeValues.length === 0) {
    issues.push({ path: `${path}.changeValues`, message: "At least one branch is required." });
  }

  if (new Set(profile.changeValues).size !== profile.changeValues.length) {
    issues.push({ path: `${path}.changeValues`, message: "Branch values must be unique." });
  }

  return issues;
}

function validateWalletProfile(
  profile: WalletProfile,
  path: string,
): ProfileValidationIssue[] {
  const issues: ProfileValidationIssue[] = [];

  if (profile.profiles.length === 0) {
    issues.push({ path: `${path}.profiles`, message: "At least one derivation profile is required." });
  }

  const ids = new Set<string>();
  profile.profiles.forEach((derivationProfile, index) => {
    if (ids.has(derivationProfile.id)) {
      issues.push({ path: `${path}.profiles[${index}].id`, message: "Duplicate derivation profile id." });
    }
    ids.add(derivationProfile.id);
    issues.push(...validateDerivationProfile(derivationProfile, `${path}.profiles[${index}]`));
  });

  if (profile.source.status === "verified" && profile.source.verifiedAt === null) {
    issues.push({ path: `${path}.source.verifiedAt`, message: "Verified sources require a verification date." });
  }

  return issues;
}

export function validateWalletProfileDatabase(
  database: WalletProfileDatabase,
): readonly ProfileValidationIssue[] {
  const issues: ProfileValidationIssue[] = [];
  const ids = new Set<string>();

  database.profiles.forEach((profile, index) => {
    if (ids.has(profile.id)) {
      issues.push({ path: `profiles[${index}].id`, message: "Duplicate wallet profile id." });
    }
    ids.add(profile.id);
    issues.push(...validateWalletProfile(profile, `profiles[${index}]`));
  });

  return issues;
}

export function assertValidWalletProfileDatabase(database: WalletProfileDatabase): void {
  const issues = validateWalletProfileDatabase(database);
  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n");
    throw new Error(`Invalid wallet profile database:\n${details}`);
  }
}
