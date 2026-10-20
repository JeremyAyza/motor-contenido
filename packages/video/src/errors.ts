/** An error the person can act on: the CLI prints its message, without a stack. */
export class VideoError extends Error {}

/** Runs `fn` and turns any error into a VideoError with the same message. */
export function asVideoError<T>(fn: () => T): T {
  try {
    return fn();
  } catch (error) {
    throw new VideoError((error as Error).message);
  }
}
