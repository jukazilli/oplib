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

  it("bounds visitor state and fails closed while every tracked window is active", () => {
    for (let index = 0; index < 10_000; index += 1) {
      expect(allowCommentAttempt(`visitor-${index}`, 1_000)).toBe(true);
    }

    expect(allowCommentAttempt("visitor-over-capacity", 1_001)).toBe(false);
    expect(allowCommentAttempt("visitor-0", 1_002)).toBe(true);
  });

  it("reclaims expired visitor state before rejecting a new visitor", () => {
    for (let index = 0; index < 10_000; index += 1) {
      expect(allowCommentAttempt(`expired-${index}`, 1_000)).toBe(true);
    }

    expect(allowCommentAttempt("new-visitor", 301_000)).toBe(true);
  });
});
