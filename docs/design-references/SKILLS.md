# Skills aplicadas

| Skill pedida | Fonte oficial lida | Aplicação |
|---|---|---|
| Taste Skill v1 | [SKILL.md fixado na versão v1](https://github.com/Leonxlnx/taste-skill/blob/b9ca2fd8047f4c72d7da90ebc1c1203e57c72cd2/skills/taste-skill-v1/SKILL.md) | Composição assimétrica, Tailwind, tipografia, espaçamento, ícones Phosphor, movimento isolado |
| Awesome Design Professional | [SKILL.md](https://github.com/bergside/awesome-design-skills/blob/main/skills/professional/SKILL.md) | Tokens semânticos, estados explícitos, consistência e acessibilidade. A amostra de loja não substituiu a identidade aprovada |
| Web Design Guidelines | [Skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) e [regras](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | Revisão de `src/App.jsx`, `src/styles.css`, semântica, foco, imagem com dimensões, pausa e movimento reduzido |
| Image to Code | [SKILL.md no repositório atual](https://github.com/Leonxlnx/imagegen-skills/blob/main/skills/image-to-code/SKILL.md) | Cinco referências de seção, análise antes da implementação, tradução fiel para código |
| imagegen | Skill integrada do Codex em `C:/Users/User/.codex/skills/.system/imagegen/SKILL.md` | Cinco chamadas integradas; imagens e prompts nesta pasta. Não foi usada CLI de geração |
| Playwright CLI | [SKILL.md Microsoft](https://github.com/microsoft/playwright-cli/blob/main/skills/playwright-cli/SKILL.md) | Sessão Chrome própria, fluxos, screenshots responsivos, verificação de produção e Axe |

Arquivos das skills externas foram baixados para leitura em `docs/private/skills/`, sem instalação global. A aplicação efetiva e os testes estão registrados em `DESIGN.md`. Revisão Web Design Guidelines: `src/App.jsx` e `src/styles.css` sem problemas pendentes encontrados nos itens revisados; `npm.cmd run test:ui` inclui verificações automáticas, mas não certifica conformidade integral.
