/** An error meant for the person running the CLI: it is printed without a stack trace. */
export class PublisherError extends Error {
  override name = "PublisherError";
}
