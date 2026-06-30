import { getGithubApp } from "@/features/github/utils/github-app";
import { asRequestError } from "@/lib/errors";

export const CHECK_RUN_NAME = "CodeAudit AI Review";

/**
 * Creates an in-progress check run on the PR's head commit so the reviewer
 * shows up (and spins) in the PR "Checks" section, like CodeRabbit.
 * Returns the check run id so it can be completed later.
 *
 * Requires the GitHub App to have "Checks: write" permission.
 */
export async function startCheckRun(
    installationId: number,
    repoFullName: string,
    headSha: string
): Promise<number | null> {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

    try {
        const { data } = await octokit.request(
            "POST /repos/{owner}/{repo}/check-runs",
            {
                owner,
                repo,
                name: CHECK_RUN_NAME,
                head_sha: headSha,
                status: "in_progress",
                started_at: new Date().toISOString(),
                output: {
                    title: "Review in progress",
                    summary:
                        "⏳ The AI reviewer is analyzing this pull request. Please wait before merging.",
                },
            }
        );

        return data.id;
    } catch (error: unknown) {
        // Most commonly a missing "Checks: write" permission (403). Don't fail
        // the whole review for this — the PR comment still carries the result.
        const requestError = asRequestError(error);
        console.warn(
            "[review] could not create check run (is 'Checks: write' granted?):",
            requestError.status,
            requestError.message
        );
        return null;
    }
}

type CheckConclusion =
    | "success"
    | "neutral"
    | "failure"
    | "action_required";

/**
 * Marks the check run complete with a conclusion and a markdown summary.
 * `success`/`neutral` show a green check; `failure`/`action_required` show red.
 */
export async function completeCheckRun(
    installationId: number,
    repoFullName: string,
    checkRunId: number | null,
    options: { conclusion: CheckConclusion; title: string; summary: string }
) {
    // No check run was created (e.g. missing permission) — nothing to complete.
    if (checkRunId === null) {
        return;
    }

    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

    try {
        await octokit.request(
            "PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}",
            {
                owner,
                repo,
                check_run_id: checkRunId,
                status: "completed",
                conclusion: options.conclusion,
                completed_at: new Date().toISOString(),
                output: {
                    title: options.title,
                    // Checks API caps summary at 65535 chars
                    summary: options.summary.slice(0, 65000),
                },
            }
        );
    } catch (error: unknown) {
        const requestError = asRequestError(error);
        console.warn(
            "[review] could not complete check run:",
            requestError.status,
            requestError.message
        );
    }
}

/**
 * Finds an in-progress check run on a commit (by our check name) and marks it
 * as failed. Used by failure recovery, where the check run id isn't in scope.
 * Best-effort — never throws.
 */
export async function failInProgressCheckRun(
    installationId: number,
    repoFullName: string,
    headSha: string,
    summary: string
) {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

    try {
        const { data } = await octokit.request(
            "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
            { owner, repo, ref: headSha, check_name: CHECK_RUN_NAME }
        );

        const run = data.check_runs.find((item) => item.status !== "completed");

        if (!run) {
            return;
        }

        await completeCheckRun(installationId, repoFullName, run.id, {
            conclusion: "failure",
            title: "Review failed",
            summary,
        });
    } catch (error: unknown) {
        const requestError = asRequestError(error);
        console.warn(
            "[review] could not fail in-progress check run:",
            requestError.status,
            requestError.message
        );
    }
}
