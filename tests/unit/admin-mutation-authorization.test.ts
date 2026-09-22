import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  createTaxonomy: vi.fn(),
  renameTaxonomy: vi.fn(),
  deleteTaxonomy: vi.fn(),
  changeComment: vi.fn(),
  createDraft: vi.fn(),
  getDraft: vi.fn(),
  getPublication: vi.fn(),
  updateDraft: vi.fn(),
  publish: vi.fn(),
  transitionStatus: vi.fn(),
  setFeatured: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/modules/identity/admin", () => ({
  requireAdminCommand: mocks.authorize,
}));
vi.mock("@/modules/taxonomy/repository", () => ({
  createTaxonomyItem: mocks.createTaxonomy,
  renameTaxonomyItem: mocks.renameTaxonomy,
  deleteTaxonomyItem: mocks.deleteTaxonomy,
}));
vi.mock("@/modules/interactions/moderation/repository", () => ({
  changeCommentVisibility: mocks.changeComment,
}));
vi.mock("@/modules/publishing/draft-repository", () => ({
  createDraft: mocks.createDraft,
  getDraftById: mocks.getDraft,
  getAdminPublicationById: mocks.getPublication,
  updateDraft: mocks.updateDraft,
  publishPublication: mocks.publish,
  transitionPublicationStatus: mocks.transitionStatus,
  setPublicationFeatured: mocks.setFeatured,
}));

import { changeCommentVisibilityAction } from "@/app/admin/comentarios/actions";
import {
  changePublicationFeatureAction,
  changePublicationStatusAction,
  publishPublicationAction,
  saveDraftAction,
} from "@/app/admin/publicacoes/actions";
import {
  createTaxonomyAction,
  deleteTaxonomyAction,
  renameTaxonomyAction,
} from "@/app/admin/taxonomia/actions";

const emptyState = { status: "idle" as const, message: "" };

beforeEach(() => vi.clearAllMocks());

describe("administrative mutation authorization", () => {
  it("rejects every mutation before validation or repository access", async () => {
    const denied = new Error("administrative access denied");
    mocks.authorize.mockRejectedValue(denied);

    const commands = [
      () => createTaxonomyAction(emptyState, new FormData()),
      () => renameTaxonomyAction(emptyState, new FormData()),
      () => deleteTaxonomyAction(emptyState, new FormData()),
      () => changeCommentVisibilityAction({}),
      () => publishPublicationAction(new FormData(), "draft"),
      () => changePublicationStatusAction({}),
      () => changePublicationFeatureAction({}),
      () => saveDraftAction(new FormData()),
    ];

    for (const command of commands) {
      await expect(command()).rejects.toBe(denied);
    }

    expect(mocks.authorize).toHaveBeenCalledTimes(commands.length);
    for (const repository of Object.values(mocks).slice(1)) {
      expect(repository).not.toHaveBeenCalled();
    }
  });
});
