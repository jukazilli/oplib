import { ptBR } from "@clerk/localizations/pt-BR";

export const authenticationErrorMessage =
  "Não foi possível entrar. Verifique os dados e tente novamente.";

export const authenticationLocalization = {
  ...ptBR,
  unstable__errors: {
    ...ptBR.unstable__errors,
    form_identifier_not_found: authenticationErrorMessage,
    form_password_incorrect: authenticationErrorMessage,
    not_allowed_access: authenticationErrorMessage,
  },
} as const;
