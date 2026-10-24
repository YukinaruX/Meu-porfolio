export const contact = {
  whatsapp: '5573999698822',
  email: 'nevepsiquica333@gmail.com',
  github: 'https://github.com/YukinaruX',
  linkedin: 'https://www.linkedin.com/in/rikelme-batista-196561272',
  resume: '/curriculo-rikelme-batista.pdf',
  resumeEn: '/resume-rikelme-batista-en.pdf',
};

export const stackTechnologies = [
  { id: 'go', name: 'Go' },
  { id: 'react', name: 'React' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'csharp', name: 'C#' },
  { id: 'postgresql', name: 'PostgreSQL' },
  { id: 'supabase', name: 'Supabase' },
  { id: 'docker', name: 'Docker' },
  { id: 'git', name: 'Git' },
  { id: 'jenkins', name: 'Jenkins' },
];

export const projects = [
  {
    id: 'anfc-cardapios', name: 'ANFC Cardápios', category: 'Atendimento para restaurantes',
    description: 'Cardápio digital e atendimento de salão com QR Code e NFC. Uma experiência que conecta a mesa, o cliente e a equipe do restaurante.',
    stack: 'Next.js · React · Go',
    note: 'Captura da página de apresentação local. Projeto em desenvolvimento.',
    images: { desktop: [1440, 7939], mobile: [390, 12829] },
  },
  {
    id: 'riclick', name: 'Riclick', category: 'Automação para afiliados',
    previewMode: 'mobile',
    description: 'Interface para acompanhar descoberta de ofertas, seleção de produtos e distribuição por WhatsApp em uma plataforma de automação para afiliados.',
    stack: 'NestJS · JavaScript · Automação',
    note: 'Prévia da interface local, sem conexão com o backend de automação ou dados de operação.',
    images: { desktop: [1440, 1383], mobile: [390, 2744] },
  },
  {
    id: 'stockalto', name: 'Stockalto', category: 'Catálogo e locação para eventos',
    description: 'Catálogo de peças para eventos com categorias, busca, consulta por período e organização de pedidos de orçamento.',
    stack: 'Next.js · TypeScript · Hono',
    note: 'Captura do modo de demonstração local, com produtos e imagens de exemplo.',
    images: { desktop: [1440, 2503], mobile: [390, 2852] },
  },
  {
    id: 'alice-vieira', name: 'Alice Vieira', category: 'Site institucional',
    description: 'Uma presença digital para apresentar o trabalho e os serviços de uma psicóloga. Interface, navegação e apresentação para compartilhamento.',
    stack: 'React · TypeScript · Vite',
    url: 'https://alice-vieira.vercel.app/', repo: 'https://github.com/abakte-anfc/ALICE-P',
    images: { desktop: [1440, 5449], mobile: [390, 7439] },
  },
  {
    id: 'everton-editor', name: 'Everton Editor', category: 'Landing page para cliente',
    description: 'Um portfólio para o editor de vídeo e motion designer Everton Sousa Gonçalves, com apresentação dos trabalhos e contato direto.',
    stack: 'HTML · CSS · JavaScript',
    url: 'https://landing-page-everton-editor-6nvp.vercel.app/', repo: 'https://github.com/YukinaruX/Landing-Page-Everton-Editor',
    images: { desktop: [1440, 6035], mobile: [390, 5938] },
  },
];

export const systems = [
  { name: 'Facilities MG', domain: 'Gestão operacional',
    description: 'Sistema interno para solicitações de materiais, inventário, veículos, encomendas e assinaturas, com fluxos de aprovação e acompanhamento de status.',
    contribution: 'Atuação full-stack na evolução de módulos e regras de setor e subsetor, incluindo frontend e backend.',
    stack: 'Go · Gin · React · TypeScript · PostgreSQL · Docker', organization: 'Mansão Green' },
  { name: 'A-NFC', domain: 'Vitrine comercial',
    description: 'Catálogo digital de produtos NFC, com páginas de produto, SEO e contato comercial.',
    contribution: 'Fundador da A-NFC. Desenvolvimento da vitrine, identidade digital e integração dos canais de contato.',
    stack: 'Next.js · React · TypeScript', organization: 'A-NFC' },
  { name: 'Sistema A-NFC', domain: 'NFC e QR Codes dinâmicos',
    description: 'Plataforma para gestão de tags e redirecionamentos dinâmicos, conectando mídias físicas a destinos digitais.',
    contribution: 'Participação no desenvolvimento do sistema, com commits associados à minha conta no repositório.',
    stack: 'Go · TypeScript', organization: 'R-M-Holding-de-negocios' },
  { name: 'Líderes MG', domain: 'Performance comercial',
    description: 'Sistema interno para planejamento, acompanhamento de metas e execução de rotinas de equipes comerciais.',
    contribution: 'Desenvolvimento e evolução de funcionalidades do sistema, com contribuição registrada no repositório.',
    stack: 'Go · React', organization: 'Mansão Green' },
  { name: 'Riclick', domain: 'Automação e integrações',
    description: 'Automação de ofertas para afiliados, com geração de conteúdo e distribuição por WhatsApp.',
    contribution: 'Desenvolvimento de um produto que conecta conteúdo, integrações e processos de distribuição.',
    stack: 'TypeScript · IA · Integrações', organization: 'Projeto privado' },
];

export const previousExperience = [
  ['Assistente de Contingência', 'Mansão Green', 'mai/2025 – mai/2026'],
  ['Auxiliar de Produção', 'Grupo LemosPassos', 'dez/2024 – jul/2025'],
  ['Assistente de Vendas', 'Natura', 'jan/2021 – mar/2025'],
];
