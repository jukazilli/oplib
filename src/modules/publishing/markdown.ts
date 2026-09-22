export function markdownWarnings(markdown: string) {
  const warnings: string[] = [];

  if (/<\/?[a-z][^>]*>/i.test(markdown))
    warnings.push("HTML não é exibido na prévia.");

  if (/\]\(\s*(?:javascript|vbscript|data):/i.test(markdown))
    warnings.push("Um link com endereço não permitido foi removido.");

  if (/!\[[^\]]*\](?:\s*\(|\s*\[)/.test(markdown))
    warnings.push("Imagens no texto não são exibidas. Use a capa.");

  return warnings;
}
