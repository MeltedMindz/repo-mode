import { getBuildMeta } from "@/lib/buildMeta";
import { CopyButton } from "./copy-button";

export default function Home() {
  const meta = getBuildMeta();

  return (
    <main>
      {/* SECTION 1 — HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="font-sans text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            THIS APP EXISTS
            <br />
            BECAUSE A REPO BUILT IT.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-mono text-sm leading-relaxed text-muted sm:text-base">
            No prompts. No templates. No edits.
            <br />
            This deployment is the direct output of a real repository build.
          </p>
        </div>
        <div className="absolute bottom-8 right-8 font-mono text-xs text-muted">
          Built with{" "}
          <a
            href="https://appfactory.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-2 transition-colors hover:text-muted"
          >
            App Factory
          </a>
        </div>
      </section>

      {/* SECTION 2 — RECEIPT */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl">
          <div className="border border-neutral-800 bg-neutral-950/50 p-8">
            <div className="mb-8 border-b border-neutral-800 pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Build Receipt
              </span>
            </div>

            <div className="space-y-4 font-mono text-sm">
              <ReceiptRow label="REPO_URL" value={meta.repoUrl} isLink={meta.repoUrl !== "UNKNOWN"} />
              <ReceiptRow label="REPO_SLUG" value={meta.repoSlug} />
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-muted">COMMIT_SHA</span>
                <span className="flex items-center gap-2 text-foreground">
                  <span className="font-mono">{meta.commitShaShort}</span>
                  <CopyButton text={meta.commitSha} />
                </span>
              </div>
              {meta.buildId && (
                <ReceiptRow label="BUILD_ID" value={meta.buildId} />
              )}
              <ReceiptRow label="BUILD_TIMESTAMP" value={meta.buildTimestamp} />
              {meta.buildHash && (
                <ReceiptRow label="BUILD_HASH" value={meta.buildHash} />
              )}
              <div className="my-6 border-t border-neutral-800" />
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <span className="text-muted">PROOF_GATE</span>
                <span className="font-mono font-bold text-accent">PASSED</span>
              </div>
              <ReceiptRow label="DEPLOYMENT_STATUS" value="LIVE" />
              <ReceiptRow label="DEPLOYED_VIA" value={meta.deployedVia} />
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {meta.commitUrl !== "UNKNOWN" ? (
                <a
                  href={meta.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center border border-neutral-700 bg-transparent px-4 py-3 font-mono text-xs uppercase tracking-wide text-foreground transition-colors hover:border-neutral-500 hover:bg-neutral-900"
                >
                  View Source Commit
                </a>
              ) : (
                <span className="flex items-center justify-center border border-neutral-800 bg-transparent px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted cursor-not-allowed">
                  View Source Commit
                </span>
              )}
              <a
                href="https://appfactory.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border border-neutral-700 bg-transparent px-4 py-3 font-mono text-xs uppercase tracking-wide text-foreground transition-colors hover:border-neutral-500 hover:bg-neutral-900"
              >
                Open App Factory
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — KILL SHOT */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="max-w-3xl text-center font-sans text-2xl font-medium leading-relaxed tracking-tight text-foreground sm:text-3xl md:text-4xl">
          &ldquo;If this build failed, this page would not exist.&rdquo;
        </p>
      </section>
    </main>
  );
}

function ReceiptRow({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <span className="text-muted">{label}</span>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-foreground underline underline-offset-2 transition-colors hover:text-muted"
        >
          {value}
        </a>
      ) : (
        <span className="break-all text-foreground">{value}</span>
      )}
    </div>
  );
}
