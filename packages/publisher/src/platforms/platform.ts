/** What a platform accepts in one post. */
export type Limits = {
  maxMedia: number;
  /** Lowercase file extensions. */
  formats: readonly string[];
  /** Size limit for images. */
  maxBytes: number;
  /** Size limit for videos (mp4, mov); when missing, videos use maxBytes. */
  maxVideoBytes?: number;
  maxCaption: number;
  maxHashtags: number;
};

export type PostInput = { caption: string; media: readonly string[]; handle: string };

export type PostResult = { url?: string };

export type PostOptions = {
  /** Fill in everything but stop before the final share click. */
  dryRun: boolean;
  /** Runs right before the share click. A failure after it may still have posted. */
  beforeShare: () => void;
};

/** A browser session on one platform, opened with an account's profile. */
export interface Publisher {
  isLoggedIn(): Promise<boolean>;
  /** Waits for the person to log in by hand in the open window. */
  waitForLogin(timeoutMs: number): Promise<void>;
  /** The logged-in handle, lowercase and without the @, or undefined if it can't be read. */
  currentHandle(): Promise<string | undefined>;
  post(input: PostInput, options: PostOptions): Promise<PostResult>;
  /** Saves a screenshot and the page HTML at basePath.png and basePath.html; returns the files. */
  capture(basePath: string): Promise<string[]>;
  close(): Promise<void>;
}

/** A platform adapter: its limits and how to open a session. */
export interface Platform {
  readonly id: string;
  readonly limits: Limits;
  open(profileDir: string): Promise<Publisher>;
}
