import { beforeEach, describe, expect, it } from "vitest";
import {
  allowCommentAttempt,
  resetCommentRateLimit,
} from "@/modules/interactions/comments/rate-limit";

beforeEach(resetCommentRateLimit);
describe("comment rate limit", () => {
  it("allows three attempts in five minutes and resets after the window", () => {
    expect(allowCommentAttempt("visitor", 1000)).toBe(true);
    expect(allowCommentAttempt("visitor", 1001)).toBe(true);
    expect(allowCommentAttempt("visitor", 1002)).toBe(true);
    expect(allowCommentAttempt("visitor", 1003)).toBe(false);
    expect(allowCommentAttempt("other", 1003)).toBe(true);
    expect(allowCommentAttempt("visitor", 301001)).toBe(true);
  });
});
