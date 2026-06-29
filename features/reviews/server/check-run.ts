import { getGithubApp } from "@/features/github/utils/github-app";

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
): Promise<number> {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

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
    checkRunId: number,
    options: { conclusion: CheckConclusion; title: string; summary: string }
) {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

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
}
