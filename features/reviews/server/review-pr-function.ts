import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db";
import { getPullRequestFiles } from "./pr-files";
import { generateReview } from "./generate-review";
import { postPrComment, updatePrComment, buildReviewBody, REVIEW_IN_PROGRESS_BODY, REVIEW_MARKER } from "./post-pr-comment";
import { startCheckRun, completeCheckRun } from "./check-run";
import { chunkPrFiles } from "../utils/chunk-code";
import { buildPrNamespace, saveChunksToPinecone, searchPrContext } from "./vector";
import { buildRepoNamespace } from "@/features/repo-sync/server/repo-sync";


export const reviewPullRequest = inngest.createFunction(
    { id: "review-pull-request", triggers: { event: "github/pr.received" } },
    async ({ event, step }) => {
      const pullRequestId = event.data.pullRequestId;
  
      const pullRequest = await step.run("mark-processing", async () => {
        return prisma.pullRequest.update({
          where: { id: pullRequestId },
          data: { status: "processing" },
        });
      });

      // Post a visible placeholder immediately so the author knows a review is
      // underway and shouldn't merge yet. We update this same comment later.
      const reviewCommentId = await step.run("post-in-progress-comment", async () => {
        return postPrComment(
          pullRequest.installationId,
          pullRequest.repoFullName,
          pullRequest.prNumber,
          REVIEW_IN_PROGRESS_BODY
        );
      });

      // Start an in-progress check run so the reviewer appears (and spins) in
      // the PR "Checks" section until the review completes.
      const checkRunId = await step.run("start-check-run", async () => {
        return startCheckRun(
          pullRequest.installationId,
          pullRequest.repoFullName,
          pullRequest.headSha
        );
      });

      const chunks = await step.run("breakdown-code", async () => {
        const files = await getPullRequestFiles(
          pullRequest.installationId,
          pullRequest.repoFullName,
          pullRequest.prNumber
        );
  
        // Turn unified diffs into fixed-size chunks for embedding
        return chunkPrFiles(pullRequest.prNumber, files);
      });
  
      if (chunks.length === 0) {
        await step.run("mark-reviewed-no-code", async () => {
          await prisma.pullRequest.update({
            where: { id: pullRequestId },
            data: { status: "reviewed" },
          });
        });

        await step.run("update-comment-no-code", async () => {
          await updatePrComment(
            pullRequest.installationId,
            pullRequest.repoFullName,
            reviewCommentId,
            `${REVIEW_MARKER}\n## 🔍 AI Code Review\n\n✅ No reviewable code changes were found in this pull request.`
          );
        });

        await step.run("complete-check-run-no-code", async () => {
          await completeCheckRun(
            pullRequest.installationId,
            pullRequest.repoFullName,
            checkRunId,
            {
              conclusion: "neutral",
              title: "No code to review",
              summary: "No reviewable code changes were found in this pull request.",
            }
          );
        });

        return { pullRequestId, status: "reviewed", reason: "no code to review" };
      }
  
      // PR namespace isolates this diff from other PRs and from repo-wide sync data
      const namespace = buildPrNamespace(
        pullRequest.repoFullName,
        pullRequest.prNumber
      );
  
      await step.run("save-vectors-to-pinecone", async () => {
        await saveChunksToPinecone(namespace, chunks);
      });
  
      // Pinecone needs a short delay before new vectors appear in search results
      await step.sleep("wait-for-vectors-to-index", "10s");
  
      // Extra context from the on-demand codebase sync, when the repo was synced
      const repoContextSnippets = await step.run("search-repo-context", async () => {
        const repoSync = await prisma.repoSync.findUnique({
          where: { repoFullName: pullRequest.repoFullName },
        });
  
        if (!repoSync || repoSync.status !== "synced") {
          return [];
        }
  
        const repoNamespace = buildRepoNamespace(pullRequest.repoFullName);
        return searchPrContext(repoNamespace, pullRequest.title);
      });
  
      const review = await step.run("generate-ai-review", async () => {
        // Search within this PR's namespace for chunks related to the PR title
        const contextSnippets = await searchPrContext(
          namespace,
          pullRequest.title
        );
  
        return generateReview({
          repoFullName: pullRequest.repoFullName,
          title: pullRequest.title,
          contextSnippets,
          repoContextSnippets,
        });
      });
  
      await step.run("post-pr-comment", async () => {
        await updatePrComment(
          pullRequest.installationId,
          pullRequest.repoFullName,
          reviewCommentId,
          buildReviewBody(review)
        );
      });

      await step.run("complete-check-run", async () => {
        await completeCheckRun(
          pullRequest.installationId,
          pullRequest.repoFullName,
          checkRunId,
          {
            conclusion: "success",
            title: "Review complete",
            summary: review,
          }
        );
      });
  
      await step.run("mark-reviewed", async () => {
        await prisma.pullRequest.update({
          where: { id: pullRequestId },
          data: {
            status: "reviewed",
            reviewComment: review,
            reviewedAt: new Date(),
          },
        });
      });
  
      return { pullRequestId, status: "reviewed" };
    }
  );
  