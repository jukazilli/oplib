export type TaxonomyActionState = {
  status: "idle" | "success" | "error";
  message: string;
  field?: "name" | "replacement";
};

export const initialTaxonomyActionState: TaxonomyActionState = {
  status: "idle",
  message: "",
};
