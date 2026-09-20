import { describe, expect, it } from "vitest";

import {
  databaseEnvSchema,
  interactionsEnvSchema,
  parseEnv,
  publicEnvSchema,
} from "@/lib/env/schema";

describe("configuração de ambiente", () => {
  it("falha cedo quando o banco não está configurado", () => {
    expect(() => parseEnv("database", databaseEnvSchema, {})).toThrow(
      "Configuração inválida para database",
    );
  });

  it("não inclui segredos no contrato público", () => {
    const result = publicEnvSchema.parse({
      NEXT_PUBLIC_SITE_URL: "https://preview.oplib.example",
      CLERK_SECRET_KEY: "nao-pode-sair",
    });

    expect(result).toEqual({
      NEXT_PUBLIC_SITE_URL: "https://preview.oplib.example",
    });
    expect(result).not.toHaveProperty("CLERK_SECRET_KEY");
  });

  it("rejeita pepper fraco", () => {
    expect(() =>
      parseEnv("interactions", interactionsEnvSchema, {
        VISITOR_ID_PEPPER: "curto",
      }),
    ).toThrow("pelo menos 32 caracteres");
  });
});
