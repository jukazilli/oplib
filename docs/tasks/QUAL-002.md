# QUAL-002 — Desempenho e degradação segura

- [x] Contrato do backlog e dependências revisados.
- [x] Falhas isoladas de curtidas e comentários cobertas localmente.
- [x] Medição Lighthouse repetível preparada para o Preview protegido.
- [x] Resumo saneado por rota e retenção temporária dos relatórios configurados.
- [x] Observar a primeira execução remota e registrar a linha de base.
- [x] Restringir o provedor cliente de identidade às rotas que usam componentes Clerk.
- [ ] Medir conteúdo editorial representativo e consulta crítica.
- [ ] Validar falha de mídia e concluir evidência antes de marcar `done`.

## Decisões

- A medição roda no mesmo workflow manual do smoke, depois do E2E, contra Início, Publicações e Áreas.
- Cada rota recebe três execuções móveis; o relatório consolidado usa a mediana para reduzir ruído.
- Os limiares iniciais geram avisos, não bloqueio, até existir uma linha de base representativa aprovada.
- O cabeçalho de bypass do Preview é removido dos relatórios JSON antes do upload; relatórios HTML, que podem incorporar configurações de coleta, não são publicados como artefato.
- Os artefatos ficam disponíveis por 14 dias e não substituem dados de campo nem o aceite final.

## Provas esperadas

- `TEST-QUAL-002-01`: leitura permanece disponível quando interações ou mídia falham.
- `TEST-QUAL-002-02`: FCP, LCP, TBT, CLS, Speed Index e transferência medidos no Preview.
- `TEST-QUAL-002-03`: dependências e bytes do cliente revisados sem hidratação desnecessária.

## Memória de execução

- Fonte canônica: D03 §9, D06 §17, D07 §§5, 18 e 20 e backlog QUAL-002.
- Implementação: `.lighthouserc.cjs`, `.github/workflows/e2e.yml` e `scripts/summarize-lighthouse.mjs`.
- A execução remota `35767611132`, no commit `0f7b858`, aprovou os nove testes E2E e nove medições. O artefato contém exatamente nove JSON saneados e um resumo; a varredura não encontrou `extraHeaders` nem nomes dos headers de bypass.
- Linha de base móvel inicial: performance 91/86/86 para Início/Áreas/Publicações; LCP 3,09/3,80/3,79 s; CLS 0; JavaScript transferido entre 208,3 e 214,2 KiB, com aproximadamente 63 KiB apontados como não usados. O LCP e o JavaScript não usado exigem investigação com conteúdo representativo.
- A documentação oficial do Clerk permite montar `ClerkProvider` mais abaixo quando a autenticação existe apenas em rotas específicas. O provedor saiu do layout raiz e agora envolve somente `/sign-in` e `/admin`; o efeito deve ser quantificado no próximo Preview sem comprometer entrada, perfil ou logout.
