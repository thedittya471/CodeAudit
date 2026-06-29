import { getGithubApp } from "@/features/github/utils/github-app";

// Hidden marker so we can recognize (and update) our own comment across runs.
export const REVIEW_MARKER = "<!-- codeaudit-ai-review -->";

export const REVIEW_IN_PROGRESS_BODY = `${REVIEW_MARKER}
## 🔍 AI Code Review

⏳ **Review in progress…**

The automated reviewer is analyzing this pull request. Please wait for it to finish before merging — this comment will update with the results.`;

/** Wraps a finished review body with the marker so it can be found/updated later. */
export function buildReviewBody(review: string) {
    return `${REVIEW_MARKER}\n${review}`;
}

/**
 * Creates a comment on the PR and returns its id so it can be updated later.
 */
export async function postPrComment(
    installationId: number,
    repoFullName: string,
    prNumber: number,
    body: string
): Promise<number> {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

    const { data } = await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
            owner,
            repo,
            issue_number: prNumber,
            body,
        }
    );

    return data.id;
}

/**
 * Updates an existing PR comment in place (used to replace the
 * "review in progress" placeholder with the final review).
 */
export async function updatePrComment(
    installationId: number,
    repoFullName: string,
    commentId: number,
    body: string
) {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const [owner, repo] = repoFullName.split("/");

    await octokit.request(
        "PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}",
        {
            owner,
            repo,
            comment_id: commentId,
            body,
        }
    );
}
