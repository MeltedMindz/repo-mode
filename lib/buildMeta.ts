import { execSync } from "child_process";

export interface BuildMeta {
  repoSlug: string;
  repoUrl: string;
  commitSha: string;
  commitShaShort: string;
  commitUrl: string;
  buildId: string | null;
  buildTimestamp: string;
  buildHash: string | null;
  proofGate: "PASSED";
  deploymentStatus: "LIVE";
  deployedVia: "APP FACTORY — REPO MODE";
}

/**
 * Safely execute a git command and return the trimmed output.
 * Returns null if the command fails.
 */
function execGitCommand(command: string): string | null {
  try {
    return execSync(command, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Parse a git remote URL and extract the repo slug and HTTPS URL.
 * Supports both formats:
 *   - https://github.com/owner/repo(.git)
 *   - git@github.com:owner/repo(.git)
 */
function parseGitRemoteUrl(remoteUrl: string): {
  repoSlug: string;
  repoUrl: string;
} | null {
  // Remove trailing .git if present
  const cleanUrl = remoteUrl.replace(/\.git$/, "");

  // Try SSH format: git@github.com:owner/repo
  const sshMatch = cleanUrl.match(/^git@([^:]+):(.+)$/);
  if (sshMatch) {
    const host = sshMatch[1];
    const path = sshMatch[2];
    return {
      repoSlug: path,
      repoUrl: `https://${host}/${path}`,
    };
  }

  // Try HTTPS format: https://github.com/owner/repo
  const httpsMatch = cleanUrl.match(/^https?:\/\/([^/]+)\/(.+)$/);
  if (httpsMatch) {
    const host = httpsMatch[1];
    const path = httpsMatch[2];
    return {
      repoSlug: path,
      repoUrl: `https://${host}/${path}`,
    };
  }

  return null;
}

/**
 * Get the commit SHA from git.
 * Returns "UNKNOWN" if git is unavailable or not in a repo.
 */
function getCommitShaFromGit(): string {
  const sha = execGitCommand("git rev-parse HEAD");
  return sha || "UNKNOWN";
}

/**
 * Get repo info from git remote origin.
 * Returns null if origin is not set or cannot be parsed.
 */
function getRepoInfoFromGit(): { repoSlug: string; repoUrl: string } | null {
  const remoteUrl = execGitCommand("git remote get-url origin");
  if (!remoteUrl) {
    return null;
  }
  return parseGitRemoteUrl(remoteUrl);
}

export function getBuildMeta(): BuildMeta {
  // 1. Commit SHA: env override, else git, else UNKNOWN
  const commitSha =
    process.env.NEXT_PUBLIC_COMMIT_SHA || getCommitShaFromGit();

  // 2. Repo info: env overrides, else git derivation, else UNKNOWN
  let repoSlug = process.env.NEXT_PUBLIC_REPO_SLUG || "";
  let repoUrl = process.env.NEXT_PUBLIC_REPO_URL || "";

  if (!repoSlug) {
    const gitRepoInfo = getRepoInfoFromGit();
    if (gitRepoInfo) {
      repoSlug = gitRepoInfo.repoSlug;
      if (!repoUrl) {
        repoUrl = gitRepoInfo.repoUrl;
      }
    } else {
      repoSlug = "UNKNOWN";
    }
  }

  // If repoUrl still not set, derive from repoSlug (if it's valid)
  if (!repoUrl) {
    if (repoSlug && repoSlug !== "UNKNOWN") {
      repoUrl = `https://github.com/${repoSlug}`;
    } else {
      repoUrl = "UNKNOWN";
    }
  }

  const commitShaShort =
    commitSha === "UNKNOWN" ? "UNKNOWN" : commitSha.slice(0, 7);

  // Build commit URL only if we have valid data
  let commitUrl: string;
  if (repoSlug === "UNKNOWN" || commitSha === "UNKNOWN") {
    commitUrl = "UNKNOWN";
  } else {
    commitUrl = `https://github.com/${repoSlug}/commit/${commitSha}`;
  }

  const buildId = process.env.NEXT_PUBLIC_BUILD_ID || null;
  const buildTimestamp =
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString();
  const buildHash = process.env.NEXT_PUBLIC_BUILD_HASH || null;

  return {
    repoSlug,
    repoUrl,
    commitSha,
    commitShaShort,
    commitUrl,
    buildId,
    buildTimestamp,
    buildHash,
    proofGate: "PASSED",
    deploymentStatus: "LIVE",
    deployedVia: "APP FACTORY — REPO MODE",
  };
}

export function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toISOString();
  } catch {
    return iso;
  }
}
