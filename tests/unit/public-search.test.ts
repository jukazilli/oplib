import { describe, expect, it } from "vitest";

import { parsePublicSearch } from "@/modules/discovery/domain";

describe("public search contract", () => {
  it("normalizes URL parameters into safe defaults", () => {
    expect(
      parsePublicSearch({
        busca: "  virtualização  ",
        pagina: "2",
        view: "grid",
      }),
    ).toMatchObject({
      busca: "virtualização",
      pagina: 2,
      view: "grid",
      ordem: "recentes",
    });
  });

  it("rejects unsupported filters without breaking the collection", () => {
    expect(
      parsePublicSearch({ area: "../../admin", tipo: "video", pagina: "-8" }),
    ).toMatchObject({
      area: "",
      tipo: "",
      pagina: 1,
    });
  });
});
