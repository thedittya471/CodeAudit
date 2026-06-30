/**
 * Narrow shape of the errors thrown by Octokit / fetch-based requests.
 * Octokit attaches `status` and (for failed HTTP calls) a `response` object.
 */
export type RequestError = {
  status?: number;
  message?: string;
  response?: {
    headers?: Record<string, string | undefined>;
  };
};

/** Safely coerces an unknown caught value into a {@link RequestError}. */
export function asRequestError(error: unknown): RequestError {
  if (typeof error === "object" && error !== null) {
    return error as RequestError;
  }
  return {};
}
