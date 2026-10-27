# Portal das 52 Melhorias | Lift Contabilidade

Portal interno para acompanhamento e gestão da meta anual de **52 melhorias contínuas** da **Lift Contabilidade** (1 melhoria por semana).

## 🚀 Funcionalidades

- **Funil (Kanban):**
  - Todas as etapas do Trello: *Brainstorm*, *Aprovados*, *Em confecção*, *Em implementação*, *Implementados* e *Descartados*.
  - Seletor de anos: **Ano 2026** (com histórico importado do Trello) e **Ano 2027** (início de ciclo).
  - Drag-and-drop e botão rápido `✓ Concluir` em cada cartão.
  - Barra de rolagem laranja dedicada e controle deslizante de navegação lateral.
  - Sincronização automática e reativa em tempo real com o Dashboard.

- **Dashboard Executivo (Aba Dashboard):**
  - Indicadores de meta: Melhorias Feitas, Restantes, Ritmo/Status Atual (*No Prazo* / *Adiantado*) e Meta esperada.
  - Barra de Progresso Anual (%) com indicador da meta semanal atual.
  - Cartão de Melhorias Concluídas na Semana.
  - Tabela das **Últimas Melhorias Implementadas** (apenas melhorias concluídas que pontuam na meta).
  - **Exportação de Imagem para Apresentações:** Download de PNG em alta resolução (2x), em formato compacto 16:9 ideal para colar diretamente em slides (PowerPoint / Google Slides).

## 🛠️ Tecnologias

- HTML5, CSS3 (Tailwind CSS via CDN)
- JavaScript Vanilla (SPA reativa com persistência local em `localStorage`)
- Biblioteca `html2canvas.min.js` para captura de imagens
- Ícones `Lucide Icons`

## 📦 Deploy na Vercel

O projeto é 100% estático (HTML/JS/CSS). Para hospedar na Vercel:
1. Conecte o repositório do GitHub na Vercel.
2. Mantenha as configurações padrão (Framework Preset: *Other*).
3. Clique em **Deploy**.
