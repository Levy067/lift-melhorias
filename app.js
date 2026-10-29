// ============================================================
// PORTAL DE MELHORIAS - LIFT CONTABILIDADE (TEMA BRANCO)
// ============================================================

// App State
let currentYear = 2026;
let currentTab = 'funil';
let currentWeek = 44; // Default for 2026-10-27

// Columns definition
let lists = [];

// Cards per year
let cardsByYear = {
  2026: [],
  2027: []
};

// Initial Setup
function initApp() {
  // Bind Base64 logo to prevent canvas taint issues during dashboard image export
  const headerLogo = document.getElementById('headerLogoImg');
  const dashLogo = document.getElementById('dashboardLogoImg');
  if (headerLogo && typeof LIFT_LOGO_BASE64 !== 'undefined' && LIFT_LOGO_BASE64) {
    headerLogo.src = LIFT_LOGO_BASE64;
  }
  if (dashLogo && typeof LIFT_LOGO_BASE64 !== 'undefined' && LIFT_LOGO_BASE64) {
    dashLogo.src = LIFT_LOGO_BASE64;
  }

  // Load columns
  const savedLists = localStorage.getItem('lift_melhorias_lists');
  if (savedLists) {
    try {
      lists = JSON.parse(savedLists);
    } catch (e) {
      lists = [...TRELLO_LISTS];
    }
  } else {
    lists = [...TRELLO_LISTS];
  }

  // Ensure "Implementados" column has isDone: true
  lists.forEach(l => {
    if (l.name.toLowerCase().includes('implementad') || l.name.toLowerCase().includes('conclu')) {
      l.isDone = true;
    }
  });

  // Load 2026 cards
  const savedCards2026 = localStorage.getItem('lift_melhorias_cards_2026');
  if (savedCards2026) {
    try {
      cardsByYear[2026] = JSON.parse(savedCards2026);
    } catch (e) {
      cardsByYear[2026] = [...TRELLO_CARDS_2026];
    }
  } else {
    cardsByYear[2026] = [...TRELLO_CARDS_2026];
  }

  // Load 2027 cards (starts empty / zerado)
  const savedCards2027 = localStorage.getItem('lift_melhorias_cards_2027');
  if (savedCards2027) {
    try {
      cardsByYear[2027] = JSON.parse(savedCards2027);
    } catch (e) {
      cardsByYear[2027] = [];
    }
  } else {
    cardsByYear[2027] = [];
  }

  // Calculate current week
  calculateCurrentWeek();

  // Sync year select dropdown button
  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect) {
    yearSelect.value = String(currentYear);
  }

  // Populate column select in card modal
  populateColumnSelect();

  // Setup Board Wheel Scroll
  setupBoardWheelScroll();

  // Initialize Firebase Cloud Sync (Real-time team synchronization)
  initFirebase();

  // Check URL hash for initial tab
  if (window.location.hash === '#dashboard') {
    switchTab('dashboard');
  } else {
    renderAll();
  }
}

// Calculate week of the year
function calculateCurrentWeek() {
  if (currentYear === 2026) {
    currentWeek = 44;
  } else {
    currentWeek = 1;
  }
}

// Save state to localStorage
function persistData() {
  localStorage.setItem('lift_melhorias_lists', JSON.stringify(lists));
  localStorage.setItem('lift_melhorias_cards_2026', JSON.stringify(cardsByYear[2026]));
  localStorage.setItem('lift_melhorias_cards_2027', JSON.stringify(cardsByYear[2027]));
}

// Switch Year (2026 or 2027)
function setYear(year) {
  currentYear = Number(year);
  calculateCurrentWeek();

  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect && Number(yearSelect.value) !== currentYear) {
    yearSelect.value = String(currentYear);
  }

  const kanbanBadge = document.getElementById('kanbanYearBadge');
  const dashTag = document.getElementById('dashYearTag');
  const dashDate = document.getElementById('dashCurrentDate');

  if (kanbanBadge) kanbanBadge.textContent = `Ano ${currentYear}`;
  if (dashTag) dashTag.textContent = `${currentYear}`;
  
  if (dashDate) {
    if (currentYear === 2026) {
      dashDate.textContent = `Semana atual: Semana ${currentWeek} · 2026 (Meta: 52 melhorias)`;
    } else {
      dashDate.textContent = `Ano ${currentYear} · Meta: 52 melhorias`;
    }
  }

  renderAll();
}

// Switch Tabs (Funil / Dashboard)
function switchTab(tabId) {
  currentTab = tabId;

  const tabFunil = document.getElementById('tab-funil');
  const tabDash = document.getElementById('tab-dashboard');
  const navBtnFunil = document.getElementById('navTabFunil');
  const navBtnDash = document.getElementById('navTabDashboard');

  if (tabId === 'funil') {
    tabFunil.classList.add('active');
    tabDash.classList.remove('active');

    navBtnFunil.className = 'nav-tab-btn flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 text-[#E17908] bg-orange-50/80 border border-orange-200 shadow-sm';
    navBtnDash.className = 'nav-tab-btn flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 text-slate-500 hover:text-[#033A65] hover:bg-slate-50';
    renderKanban();
  } else {
    tabDash.classList.add('active');
    tabFunil.classList.remove('active');

    navBtnDash.className = 'nav-tab-btn flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 text-[#E17908] bg-orange-50/80 border border-orange-200 shadow-sm';
    navBtnFunil.className = 'nav-tab-btn flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 text-slate-500 hover:text-[#033A65] hover:bg-slate-50';
    renderDashboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Render All Views
function renderAll() {
  renderKanban();
  renderDashboard();
  if (window.lucide) {
    lucide.createIcons();
  }
}

// ============================================================
// KANBAN BOARD (TAB 1) - SCROLL & COLUMNS
// ============================================================
function scrollKanban(amount) {
  const board = document.getElementById('kanbanBoard');
  if (board) {
    board.scrollBy({ left: amount, behavior: 'smooth' });
  }
}

function setupBoardWheelScroll() {
  const board = document.getElementById('kanbanBoard');
  if (!board) return;

  board.addEventListener('wheel', (evt) => {
    const cardsContainer = evt.target.closest('.cards-scroll-container');
    if (cardsContainer) {
      const atTop = cardsContainer.scrollTop <= 0 && evt.deltaY < 0;
      const atBottom = (cardsContainer.scrollTop + cardsContainer.clientHeight >= cardsContainer.scrollHeight - 2) && evt.deltaY > 0;
      if (!atTop && !atBottom) {
        return;
      }
    }

    if (evt.deltaY !== 0) {
      board.scrollLeft += evt.deltaY * 1.2;
    }
  }, { passive: true });
}

function renderKanban() {
  const container = document.getElementById('kanbanBoard');
  if (!container) return;
  container.innerHTML = '';

  const activeCards = cardsByYear[currentYear] || [];
  const query = (document.getElementById('kanbanSearch')?.value || '').toLowerCase().trim();

  lists.forEach(list => {
    let colCards = activeCards.filter(c => c.idList === list.id);
    if (query) {
      colCards = colCards.filter(c => 
        (c.name || '').toLowerCase().includes(query) ||
        (c.desc || '').toLowerCase().includes(query) ||
        (c.tag || '').toLowerCase().includes(query) ||
        (c.author || '').toLowerCase().includes(query)
      );
    }

    // Column Element (Light theme, distinct borders, smooth heights)
    const colEl = document.createElement('div');
    colEl.className = 'kanban-column flex-shrink-0 w-80 bg-[#F1F5F9] border border-slate-200/90 rounded-2xl flex flex-col shadow-sm transition-all';
    colEl.style.height = 'calc(100vh - 310px)';
    colEl.style.minHeight = '380px';
    colEl.style.maxHeight = '620px';
    colEl.dataset.listId = list.id;

    // Drag-over events for column
    colEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      colEl.classList.add('drag-over');
    });
    colEl.addEventListener('dragleave', (e) => {
      if (!colEl.contains(e.relatedTarget)) {
        colEl.classList.remove('drag-over');
      }
    });
    colEl.addEventListener('drop', (e) => {
      e.preventDefault();
      colEl.classList.remove('drag-over');
      const cardId = e.dataTransfer.getData('text/plain');
      if (cardId) moveCardToList(cardId, list.id);
    });

    // Column Header (White surface)
    const isDoneCol = list.isDone;
    const headerHtml = `
      <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-2xl shrink-0">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" style="background-color: ${list.color || '#E17908'}"></span>
          <h3 class="font-black text-sm text-[#033A65] tracking-wide">${escapeHtml(list.name)}</h3>
          ${isDoneCol ? '<span class="text-[10px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded border border-emerald-200">Meta 52</span>' : ''}
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-black px-2 py-0.5 rounded-full ${isDoneCol ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
            ${colCards.length}
          </span>
          <button onclick="openCardModal('${list.id}')" title="Adicionar melhoria nesta etapa" class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-[#E17908] hover:text-white text-[#033A65] flex items-center justify-center text-xs font-black transition-all border border-slate-200">
            +
          </button>
        </div>
      </div>
    `;

    // Cards list container with smooth vertical scrolling
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-scroll-container p-3 flex-1 overflow-y-auto space-y-2.5 pb-20';

    // Allow drops directly into cards container
    cardsContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      colEl.classList.add('drag-over');
    });
    cardsContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      colEl.classList.remove('drag-over');
      const cardId = e.dataTransfer.getData('text/plain');
      if (cardId) moveCardToList(cardId, list.id);
    });

    if (colCards.length === 0) {
      cardsContainer.innerHTML = `
        <div class="h-32 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs text-center p-3 bg-white/50">
          <span class="font-bold text-slate-500">Nenhum cartão nesta etapa</span>
          <span class="text-[10px] text-slate-400 mt-1">Clique em + para adicionar</span>
        </div>
      `;
    } else {
      colCards.forEach(card => {
        const cardEl = createCardElement(card, list);
        cardsContainer.appendChild(cardEl);
      });
      // Small bottom spacer for smooth scroll clearance
      const bSpacer = document.createElement('div');
      bSpacer.className = 'h-6 shrink-0';
      cardsContainer.appendChild(bSpacer);
    }

    colEl.innerHTML = headerHtml;
    colEl.appendChild(cardsContainer);
    container.appendChild(colEl);
  });
}

// Create single Kanban Card Element (Pure White with subtle borders and shadows)
function createCardElement(card, list) {
  const cardEl = document.createElement('div');
  cardEl.className = 'kanban-card bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-[#E17908] rounded-xl p-3.5 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-150 space-y-2 group';
  cardEl.draggable = true;
  cardEl.dataset.cardId = card.id;

  // Drag events
  cardEl.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', card.id);
    cardEl.classList.add('dragging');
  });
  cardEl.addEventListener('dragend', () => {
    cardEl.classList.remove('dragging');
  });

  // Click to edit
  cardEl.addEventListener('click', (e) => {
    openCardModal(null, card.id);
  });

  const tagColor = getTagBadgeClass(card.tag);
  const initials = getInitials(card.author || 'Time Lift');
  
  const doneList = lists.find(l => l.isDone) || lists.find(l => l.name.toLowerCase().includes('implementad') || l.name.toLowerCase().includes('conclu'));
  const doneListId = doneList ? doneList.id : '6a76057cb591fb5b56a06e6a';
  const isDoneCol = list.isDone;

  cardEl.innerHTML = `
    <div class="flex items-center justify-between gap-1.5">
      <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${tagColor}">
        ${escapeHtml(card.tag || 'Geral')}
      </span>
      ${card.week ? `<span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Semana ${card.week}</span>` : ''}
    </div>

    <h4 class="text-xs font-black text-[#033A65] group-hover:text-[#E17908] leading-snug line-clamp-2 transition-colors">
      ${escapeHtml(card.name)}
    </h4>

    ${card.desc ? `
      <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
        ${escapeHtml(card.desc)}
      </p>
    ` : ''}

    <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 gap-1">
      <span class="flex items-center gap-1.5 min-w-0">
        <span class="w-5 h-5 rounded-full bg-[#E17908] text-white font-black text-[9px] flex items-center justify-center shadow-sm shrink-0">
          ${initials}
        </span>
        <span class="truncate max-w-[85px] sm:max-w-[100px] text-[10px] font-bold text-slate-700">
          ${escapeHtml(card.author || 'Pedro Levi')}
        </span>
      </span>

      <div class="flex items-center gap-1.5 shrink-0">
        ${!isDoneCol ? `
          <button onclick="event.stopPropagation(); moveCardToList('${card.id}', '${doneListId}')" title="Mover para Implementados (conta para meta de 52)" class="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-[10px] font-extrabold transition-all shadow-xs flex items-center gap-1">
            <span>✓ Concluir</span>
          </button>
        ` : `
          <span class="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
            ✓ Concluído
          </span>
        `}
      </div>
    </div>
  `;

  return cardEl;
}

// Move card between lists
function moveCardToList(cardId, targetListId) {
  const cards = cardsByYear[currentYear];
  const card = cards.find(c => c.id === cardId);
  if (!card) return;

  if (card.idList !== targetListId) {
    card.idList = targetListId;
    const targetList = lists.find(l => l.id === targetListId);
    if (targetList && targetList.isDone && !card.week) {
      card.week = currentWeek;
      card.date = new Date().toISOString();
    }
    persistData();
    renderAll();

    // Sincronizar mudança de etapa no Firebase Firestore
    if (firestoreDb) {
      firestoreDb.collection('melhorias').doc(cardId).set({
        id: card.id,
        year: currentYear,
        idList: targetListId,
        name: card.name,
        desc: card.desc || '',
        tag: card.tag || 'Geral',
        author: card.author || 'Pedro Levi',
        week: card.week || currentWeek,
        date: card.date || new Date().toISOString()
      }, { merge: true }).catch(e => console.warn('Firestore move error:', e));
    }
  }
}

function filterCards() {
  renderKanban();
}

// ============================================================
// DASHBOARD (TAB 2) - PREVALÊNCIA DO BRANCO
// ============================================================
function renderDashboard() {
  const cards = cardsByYear[currentYear] || [];
  
  const doneList = lists.find(l => l.isDone) || lists.find(l => l.name.toLowerCase().includes('implementad') || l.name.toLowerCase().includes('conclu'));
  const doneListId = doneList ? doneList.id : '6a76057cb591fb5b56a06e6a';

  const completedCards = cards.filter(c => c.idList === doneListId);
  const completedCount = completedCards.length;
  
  const goalTotal = 52;
  const remainingCount = Math.max(0, goalTotal - completedCount);
  const progressPct = ((completedCount / goalTotal) * 100).toFixed(1);
  const expectedForWeek = Math.min(goalTotal, currentWeek);

  const elCount = document.getElementById('statCompletedCount');
  const elRemaining = document.getElementById('statRemainingCount');
  const elExpected = document.getElementById('statExpectedCount');
  const elProgress = document.getElementById('statProgressPct');
  const elProgressBar = document.getElementById('progressBarFill');
  const elWeekLabel = document.getElementById('progressWeekLabel');

  if (elCount) elCount.textContent = completedCount;
  if (elRemaining) elRemaining.textContent = remainingCount;
  if (elExpected) elExpected.textContent = expectedForWeek;
  if (elProgress) elProgress.textContent = `${progressPct}%`;
  if (elProgressBar) elProgressBar.style.width = `${Math.min(100, progressPct)}%`;
  if (elWeekLabel) elWeekLabel.textContent = `Semana ${currentWeek}`;

  const statusCard = document.getElementById('statStatusCard');
  const statusText = document.getElementById('statStatusText');
  const alertBox = document.getElementById('statAlertBox');
  const alertTitle = document.getElementById('statAlertTitle');
  const alertDesc = document.getElementById('statAlertDesc');

  if (completedCount >= expectedForWeek) {
    const isAhead = completedCount > expectedForWeek;
    if (statusCard) {
      statusCard.className = 'md:col-span-5 bg-[#eafbf1] rounded-2xl p-6 border border-emerald-200 flex flex-col justify-between transition-all hover:shadow-md';
    }
    if (statusText) {
      statusText.className = 'text-2xl md:text-3xl font-black text-emerald-800 tracking-tight';
      statusText.textContent = isAhead ? 'Adiantado!' : 'No Prazo';
    }
    if (alertBox) {
      alertBox.className = 'bg-[#f0fdf4] border border-emerald-300 rounded-xl p-3.5 flex items-start gap-3';
      const iconWrap = alertBox.querySelector('div:first-child');
      if (iconWrap) iconWrap.className = 'w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700';
    }
    if (alertTitle) alertTitle.textContent = isAhead ? 'Ritmo excepcional!' : 'Excelente ritmo!';
    if (alertDesc) alertDesc.textContent = isAhead 
      ? `Parabéns! Você está com ${completedCount - expectedForWeek} melhorias à frente da meta semanal.`
      : 'Parabéns! Você está cumprindo a meta semanal.';
  } else {
    const diff = expectedForWeek - completedCount;
    if (statusCard) {
      statusCard.className = 'md:col-span-5 bg-amber-50 rounded-2xl p-6 border border-amber-300 flex flex-col justify-between transition-all hover:shadow-md';
    }
    if (statusText) {
      statusText.className = 'text-2xl md:text-3xl font-black text-amber-800 tracking-tight';
      statusText.textContent = 'Atenção ao Prazo';
    }
    if (alertBox) {
      alertBox.className = 'bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3';
      const iconWrap = alertBox.querySelector('div:first-child');
      if (iconWrap) iconWrap.className = 'w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-700';
    }
    if (alertTitle) alertTitle.textContent = 'Atenção ao ritmo da meta';
    if (alertDesc) alertDesc.textContent = `Faltam ${diff} melhorias para alcançar a meta esperada para a Semana ${currentWeek}.`;
  }

  renderWeekImprovements(completedCards);
  renderLatestImprovementsTable(cards);
}

// Render "Melhorias na Semana" list
function renderWeekImprovements(completedCards) {
  const container = document.getElementById('weekImprovementsList');
  const countBadge = document.getElementById('weekItemsCount');
  if (!container) return;

  let weekCards = completedCards.filter(c => c.week === currentWeek);
  if (weekCards.length === 0 && completedCards.length > 0) {
    weekCards = [...completedCards].slice(0, 3);
  }

  if (countBadge) {
    countBadge.textContent = `${weekCards.length} ${weekCards.length === 1 ? 'item' : 'itens'}`;
  }

  if (weekCards.length === 0) {
    container.innerHTML = `
      <div class="p-4 border border-slate-200 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
        Nenhuma melhoria concluída nesta semana ainda.
      </div>
    `;
    return;
  }

  container.innerHTML = weekCards.map(c => `
    <div class="border border-slate-200 hover:border-[#E17908] rounded-xl p-3.5 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm" onclick="openCardModal(null, '${c.id}')">
      <div class="flex items-start justify-between gap-2">
        <h5 class="text-sm font-bold text-[#033A65] leading-tight">
          ${escapeHtml(c.name)}
        </h5>
        <span class="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full shrink-0">
          Semana ${c.week || currentWeek}
        </span>
      </div>
      <p class="text-xs text-slate-500 mt-1 line-clamp-2">
        ${escapeHtml(c.desc || 'Melhoria implementada e em operação.')}
      </p>
    </div>
  `).join('');
}

// Render "Últimas Melhorias Implementadas" Table (Apenas as concluídas - Formato Slide Compacto)
function renderLatestImprovementsTable(allCards) {
  const tbody = document.getElementById('latestImprovementsTableBody');
  const badge = document.getElementById('totalListedBadge');
  if (!tbody) return;

  // Filter STRICTLY cards from "Implementados" (Meta de 52)
  const doneList = lists.find(l => l.isDone) || lists.find(l => l.name.toLowerCase().includes('implementad') || l.name.toLowerCase().includes('conclu'));
  const doneListId = doneList ? doneList.id : '6a76057cb591fb5b56a06e6a';

  const implementedCards = allCards.filter(c => c.idList === doneListId);
  
  // Sort strictly from newest/most recent to oldest (by week and date descending)
  const sorted = [...implementedCards].sort((a, b) => {
    const weekA = parseInt(a.week) || 0;
    const weekB = parseInt(b.week) || 0;
    if (weekB !== weekA) return weekB - weekA;
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });

  // Show only the 5 most recent implemented improvements for a compact slide format
  const latestCount = 5;
  const latestImplemented = sorted.slice(0, latestCount);

  if (badge) {
    badge.textContent = `${implementedCards.length} ${implementedCards.length === 1 ? 'melhoria implementada' : 'melhorias implementadas'}`;
  }

  if (latestImplemented.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-4 text-center text-slate-400 text-xs">
          Nenhuma melhoria concluída em ${currentYear} ainda. Mova um cartão para "Implementados" no Funil para registrar.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = latestImplemented.map((c, idx) => {
    return `
      <tr class="hover:bg-slate-50/80 transition-colors cursor-pointer border-b border-slate-100 last:border-0" onclick="openCardModal(null, '${c.id}')">
        <td class="py-2 px-3 font-mono font-bold text-slate-400 text-[11px] w-8">${idx + 1}</td>
        <td class="py-2 px-3">
          <div class="font-extrabold text-[#033A65] text-xs leading-snug">${escapeHtml(c.name)}</div>
          ${c.desc ? `<div class="text-[10px] text-slate-500 truncate max-w-md sm:max-w-lg leading-tight mt-0.5">${escapeHtml(c.desc)}</div>` : ''}
        </td>
        <td class="py-2 px-3 whitespace-nowrap">
          <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${getTagBadgeClass(c.tag)}">
            ${escapeHtml(c.tag || 'Geral')}
          </span>
        </td>
        <td class="py-2 px-3 whitespace-nowrap font-bold text-slate-600 text-[11px]">
          ${c.week ? `<span class="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">Semana ${c.week}</span>` : formatShortDate(c.date)}
        </td>
        <td class="py-2 px-3 text-right whitespace-nowrap">
          <span class="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Implementado
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// Adjust completed count with stepper buttons
function adjustCompleted(delta) {
  const doneList = lists.find(l => l.isDone) || lists[4];
  if (!doneList) return;

  const cards = cardsByYear[currentYear];

  if (delta > 0) {
    const newCard = {
      id: 'card_' + Date.now(),
      idShort: cards.length + 1,
      idList: doneList.id,
      name: `Melhoria #${cards.length + 1} de ${currentYear}`,
      desc: 'Melhoria registrada via painel de acompanhamento.',
      tag: 'Operação',
      author: 'Pedro Levi',
      date: new Date().toISOString(),
      week: currentWeek
    };
    cards.push(newCard);
  } else if (delta < 0) {
    const lastDoneIdx = cards.map(c => c.idList).lastIndexOf(doneList.id);
    if (lastDoneIdx >= 0) {
      cards.splice(lastDoneIdx, 1);
    }
  }

  persistData();
  renderAll();
}

// ============================================================
// DOWNLOAD DASHBOARD IMAGE (FOR PRESENTATIONS - WHITE BACKGROUND)
// ============================================================
async function downloadDashboardImage() {
  const captureArea = document.getElementById('dashboardCaptureCard');
  const btn = document.getElementById('btnDownloadDashboard');
  
  if (!captureArea) return;

  if (currentTab !== 'dashboard') {
    switchTab('dashboard');
    await new Promise(r => setTimeout(r, 200));
  }

  // Ensure Base64 logo is attached to avoid tainted canvas on file:// scheme
  const dashLogo = document.getElementById('dashboardLogoImg');
  if (dashLogo && typeof LIFT_LOGO_BASE64 !== 'undefined' && LIFT_LOGO_BASE64) {
    dashLogo.src = LIFT_LOGO_BASE64;
  }

  const originalBtnHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = `<span class="inline-block animate-spin mr-1">⏳</span> Gerando imagem...`;
    btn.disabled = true;
  }

  try {
    if (typeof html2canvas === 'undefined') {
      throw new Error('A biblioteca html2canvas não foi carregada.');
    }

    // High resolution capture on crisp WHITE background!
    const canvas = await html2canvas(captureArea, {
      scale: 2,
      backgroundColor: '#FFFFFF',
      useCORS: true,
      allowTaint: false,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (el) => el.id === 'btnDownloadDashboard' || el.getAttribute('data-html2canvas-ignore') === 'true'
    });

    const fileName = `Dashboard_52_Melhorias_Lift_${currentYear}_Semana_${currentWeek}.png`;

    const downloadCanvasImage = () => {
      try {
        const imageURI = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = fileName;
        downloadLink.href = imageURI;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        return true;
      } catch (e) {
        console.warn('toDataURL failed, attempting toBlob fallback...', e);
        return false;
      }
    };

    let downloaded = false;
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.download = fileName;
          downloadLink.href = url;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }, 1500);
        } else {
          downloadCanvasImage();
        }
      }, 'image/png');
    } else {
      downloadCanvasImage();
    }

    if (btn) {
      btn.innerHTML = `✓ Imagem Baixada com Sucesso!`;
      setTimeout(() => {
        btn.innerHTML = originalBtnHtml;
        btn.disabled = false;
        if (window.lucide) lucide.createIcons();
      }, 2500);
    }
  } catch (err) {
    console.error('Erro ao gerar imagem:', err);
    alert('Erro ao gerar imagem do dashboard: ' + err.message);
    if (btn) {
      btn.innerHTML = originalBtnHtml;
      btn.disabled = false;
      if (window.lucide) lucide.createIcons();
    }
  }
}

// ============================================================
// MODAL: CARD EDIT / CREATE
// ============================================================
function openCardModal(listId = null, cardId = null) {
  const modal = document.getElementById('cardModal');
  const modalTitle = document.getElementById('cardModalTitle');
  const btnDelete = document.getElementById('btnDeleteCard');

  populateColumnSelect();

  if (cardId) {
    const cards = cardsByYear[currentYear];
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    modalTitle.textContent = 'Editar Melhoria';
    document.getElementById('cardId').value = card.id;
    document.getElementById('cardTitleInput').value = card.name || '';
    document.getElementById('cardDescInput').value = card.desc || '';
    document.getElementById('cardColumnSelect').value = card.idList || lists[0].id;
    document.getElementById('cardTagSelect').value = card.tag || 'Operação';
    document.getElementById('cardWeekInput').value = card.week || currentWeek;
    document.getElementById('cardAuthorInput').value = card.author || 'Pedro Levi';

    btnDelete.classList.remove('hidden');
  } else {
    modalTitle.textContent = `Nova Melhoria (${currentYear})`;
    document.getElementById('cardId').value = '';
    document.getElementById('cardTitleInput').value = '';
    document.getElementById('cardDescInput').value = '';
    document.getElementById('cardColumnSelect').value = listId || lists[0].id;
    document.getElementById('cardTagSelect').value = 'Operação';
    document.getElementById('cardWeekInput').value = currentWeek;
    document.getElementById('cardAuthorInput').value = 'Pedro Levi';

    btnDelete.classList.add('hidden');
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCardModal() {
  const modal = document.getElementById('cardModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function saveCard(event) {
  event.preventDefault();
  const id = document.getElementById('cardId').value;
  const name = document.getElementById('cardTitleInput').value.trim();
  const desc = document.getElementById('cardDescInput').value.trim();
  const idList = document.getElementById('cardColumnSelect').value;
  const tag = document.getElementById('cardTagSelect').value;
  const week = parseInt(document.getElementById('cardWeekInput').value) || currentWeek;
  const author = document.getElementById('cardAuthorInput').value.trim() || 'Pedro Levi';

  const cards = cardsByYear[currentYear];

  if (id) {
    const card = cards.find(c => c.id === id);
    if (card) {
      card.name = name;
      card.desc = desc;
      card.idList = idList;
      card.tag = tag;
      card.week = week;
      card.author = author;
    }
  } else {
    const newCard = {
      id: 'card_' + Date.now(),
      idShort: cards.length + 1,
      idList: idList,
      name: name,
      desc: desc,
      tag: tag,
      author: author,
      date: new Date().toISOString(),
      week: week
    };
    cards.push(newCard);
  }

  persistData();
  closeCardModal();
  renderAll();

  // Sincronizar criação / edição no Firebase Firestore
  if (firestoreDb) {
    const cardToSync = id ? cards.find(c => c.id === id) : cards[cards.length - 1];
    if (cardToSync) {
      firestoreDb.collection('melhorias').doc(cardToSync.id).set({
        id: cardToSync.id,
        year: currentYear,
        idList: cardToSync.idList,
        name: cardToSync.name,
        desc: cardToSync.desc || '',
        tag: cardToSync.tag || 'Geral',
        author: cardToSync.author || 'Pedro Levi',
        week: cardToSync.week || currentWeek,
        date: cardToSync.date || new Date().toISOString()
      }, { merge: true }).catch(e => console.warn('Firestore save error:', e));
    }
  }
}

function deleteCurrentCard() {
  const id = document.getElementById('cardId').value;
  if (!id) return;

  if (confirm('Deseja realmente excluir esta melhoria?')) {
    cardsByYear[currentYear] = cardsByYear[currentYear].filter(c => c.id !== id);
    persistData();
    closeCardModal();
    renderAll();

    // Sincronizar exclusão no Firebase Firestore
    if (firestoreDb) {
      firestoreDb.collection('melhorias').doc(id).delete().catch(e => console.warn('Firestore delete error:', e));
    }
  }
}

function populateColumnSelect() {
  const select = document.getElementById('cardColumnSelect');
  if (!select) return;
  select.innerHTML = lists.map(l => `
    <option value="${l.id}">${escapeHtml(l.name)}</option>
  `).join('');
}

// ============================================================
// MODAL: ADD COLUMN
// ============================================================
function openColumnModal() {
  const modal = document.getElementById('columnModal');
  document.getElementById('columnTitleInput').value = '';
  document.getElementById('columnIsDoneCheckbox').checked = false;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeColumnModal() {
  const modal = document.getElementById('columnModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function saveColumn(event) {
  event.preventDefault();
  const title = document.getElementById('columnTitleInput').value.trim();
  const isDone = document.getElementById('columnIsDoneCheckbox').checked;

  if (!title) return;

  const newCol = {
    id: 'list_' + Date.now(),
    name: title,
    color: isDone ? '#10B981' : '#E17908',
    isDone: isDone
  };

  lists.push(newCol);
  persistData();
  closeColumnModal();
  populateColumnSelect();
  renderAll();
}

// ============================================================
// MODAL: DELETE COLUMN (EXCLUIR ETAPA VAZIA)
// ============================================================
function openDeleteColumnModal() {
  const modal = document.getElementById('deleteColumnModal');
  const select = document.getElementById('deleteColumnSelect');
  const confirmBtn = document.getElementById('btnConfirmDeleteColumn');
  const warningBox = document.getElementById('deleteColumnWarning');
  const warningText = document.getElementById('deleteColumnWarningText');

  if (!modal || !select) return;

  select.innerHTML = '';
  let hasEmptyCol = false;

  lists.forEach(list => {
    const cards2026 = (cardsByYear[2026] || []).filter(c => c.idList === list.id).length;
    const cards2027 = (cardsByYear[2027] || []).filter(c => c.idList === list.id).length;
    const totalCards = cards2026 + cards2027;

    const opt = document.createElement('option');
    opt.value = list.id;
    opt.dataset.totalCards = totalCards;

    if (totalCards > 0) {
      opt.textContent = `${list.name} (${totalCards} ${totalCards === 1 ? 'cartão' : 'cartões'} - bloqueada)`;
      opt.disabled = true;
    } else {
      opt.textContent = `${list.name} (Vazia - pronta para exclusão)`;
      hasEmptyCol = true;
    }
    select.appendChild(opt);
  });

  function updateDeleteState() {
    const selectedOpt = select.options[select.selectedIndex];
    if (!selectedOpt) {
      if (confirmBtn) confirmBtn.disabled = true;
      if (warningBox) warningBox.classList.add('hidden');
      return;
    }
    const totalCards = parseInt(selectedOpt.dataset.totalCards || '0', 10);
    if (totalCards > 0) {
      if (confirmBtn) confirmBtn.disabled = true;
      if (warningBox && warningText) {
        warningBox.classList.remove('hidden');
        warningText.textContent = `A etapa "${selectedOpt.text}" possui cartões ativos e não pode ser excluída. Mova ou remova os cartões antes de prosseguir.`;
      }
    } else {
      if (confirmBtn) confirmBtn.disabled = false;
      if (warningBox) warningBox.classList.add('hidden');
    }
  }

  select.onchange = updateDeleteState;

  const firstEnabled = Array.from(select.options).find(o => !o.disabled);
  if (firstEnabled) {
    select.value = firstEnabled.value;
  }

  updateDeleteState();

  if (!hasEmptyCol && warningBox && warningText) {
    warningBox.classList.remove('hidden');
    warningText.textContent = 'Nenhuma etapa vazia encontrada. Todas as etapas atuais possuem cartões. Para excluir uma etapa, remova ou transfira os cartões dela primeiro.';
    if (confirmBtn) confirmBtn.disabled = true;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}

function closeDeleteColumnModal() {
  const modal = document.getElementById('deleteColumnModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmDeleteColumn() {
  const select = document.getElementById('deleteColumnSelect');
  if (!select) return;
  const listId = select.value;
  const listToDelete = lists.find(l => l.id === listId);
  if (!listToDelete) return;

  const totalCards = (cardsByYear[2026] || []).filter(c => c.idList === listId).length + 
                     (cardsByYear[2027] || []).filter(c => c.idList === listId).length;

  if (totalCards > 0) {
    alert(`Atenção: A etapa "${listToDelete.name}" possui ${totalCards} cartão(ões). Só é permitido excluir etapas sem nenhum cartão.`);
    return;
  }

  if (lists.length <= 1) {
    alert('O Funil precisa manter pelo menos uma etapa.');
    return;
  }

  if (confirm(`Tem certeza de que deseja excluir a etapa "${listToDelete.name}"?`)) {
    lists = lists.filter(l => l.id !== listId);
    persistData();
    closeDeleteColumnModal();
    populateColumnSelect();
    renderAll();
  }
}

// ============================================================
// MODAL: IMPORT TRELLO JSON
// ============================================================
function openImportModal() {
  const modal = document.getElementById('importModal');
  document.getElementById('trelloJsonPaste').value = '';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeImportModal() {
  const modal = document.getElementById('importModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const json = JSON.parse(e.target.result);
      processParsedTrelloJSON(json);
    } catch (err) {
      alert('Erro ao processar arquivo JSON do Trello: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function processTrelloPaste() {
  const text = document.getElementById('trelloJsonPaste').value.trim();
  if (!text) {
    alert('Por favor, cole o texto JSON do Trello ou selecione um arquivo.');
    return;
  }
  try {
    const json = JSON.parse(text);
    processParsedTrelloJSON(json);
  } catch (err) {
    alert('Formato JSON inválido: ' + err.message);
  }
}

function processParsedTrelloJSON(data) {
  const targetYearRadio = document.querySelector('input[name="importTargetYear"]:checked');
  const targetYear = targetYearRadio ? parseInt(targetYearRadio.value) : currentYear;

  if (!data.cards || !data.lists) {
    alert('O arquivo JSON fornecido não contém as propriedades "cards" e "lists" do Trello.');
    return;
  }

  const trelloOpenLists = data.lists.filter(l => !l.closed);
  if (trelloOpenLists.length > 0) {
    lists = trelloOpenLists.map(l => {
      const isDone = l.name.toLowerCase().includes('implementad') || l.name.toLowerCase().includes('conclu');
      return {
        id: l.id,
        name: l.name,
        color: isDone ? '#10B981' : (l.name.toLowerCase().includes('brain') ? '#F59E0B' : '#3B82F6'),
        isDone: isDone
      };
    });
  }

  const openCards = data.cards.filter(c => !c.closed);
  const importedCards = openCards.map(c => {
    let tag = 'Geral';
    const text = ((c.name || '') + ' ' + (c.desc || '')).toLowerCase();
    if (text.includes('fiscal') || text.includes('pgdas') || text.includes('itcd') || text.includes('tribut')) tag = 'Fiscal';
    else if (text.includes('contabil') || text.includes('dre') || text.includes('concilia') || text.includes('credito')) tag = 'Contábil';
    else if (text.includes('dp') || text.includes('folha') || text.includes('seletivo') || text.includes('det')) tag = 'DP / RH';
    else if (text.includes('comercial') || text.includes('vendas') || text.includes('sdr') || text.includes('proposta')) tag = 'Comercial';
    else if (text.includes('atendimento') || text.includes('digisac') || text.includes('chamado')) tag = 'Atendimento';
    else if (text.includes('automação') || text.includes('robô') || text.includes('robo') || text.includes('rd') || text.includes('extractor')) tag = 'TI / Automação';
    else if (text.includes('contrato') || text.includes('alvará') || text.includes('síndico')) tag = 'Legalização';
    else if (text.includes('gestão') || text.includes('talks') || text.includes('meta')) tag = 'Gestão';
    else if (text.includes('site') || text.includes('reels') || text.includes('marketing') || text.includes('figma')) tag = 'Marketing';

    let author = 'Pedro Levi';
    if (data.members && c.idMembers && c.idMembers.length > 0) {
      const m = data.members.find(mem => mem.id === c.idMembers[0]);
      if (m && m.fullName) author = m.fullName;
    }

    return {
      id: c.id,
      idShort: c.idShort || 1,
      idList: c.idList,
      name: c.name,
      desc: c.desc || '',
      tag: tag,
      author: author,
      date: c.dateLastActivity || new Date().toISOString(),
      week: 44
    };
  });

  cardsByYear[targetYear] = importedCards;
  persistData();
  closeImportModal();
  setYear(targetYear);
  renderAll();

  alert(`Sucesso! Foram importadas ${trelloOpenLists.length} etapas e ${importedCards.length} melhorias para o Ano ${targetYear}.`);
}

// Export data backup JSON
function exportDataJSON() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    lists: lists,
    data2026: cardsByYear[2026],
    data2027: cardsByYear[2027]
  };

  const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", str);
  dlAnchorElem.setAttribute("download", `lift_melhorias_backup_${currentYear}.json`);
  dlAnchorElem.click();
}

// Reset current year (Zerar ano)
function resetCurrentYear() {
  if (confirm(`Atenção: Tem certeza de que deseja zerar todas as melhorias do Ano ${currentYear}?`)) {
    cardsByYear[currentYear] = [];
    persistData();
    renderAll();
  }
}

// Helpers
function getTagBadgeClass(tag) {
  switch (tag) {
    case 'Fiscal': return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'Contábil': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'DP / RH': return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'TI / Automação': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Comercial': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Atendimento': return 'bg-cyan-50 text-cyan-700 border border-cyan-200';
    case 'Legalização': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'Marketing': return 'bg-pink-50 text-pink-700 border border-pink-200';
    case 'Gestão': return 'bg-orange-50 text-orange-700 border border-orange-200';
    default: return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

function getInitials(name) {
  if (!name) return 'PL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// FIREBASE FIRESTORE (GOOGLE CLOUD) - SINCRONIZAÇÃO EM TEMPO REAL
// ============================================================
let firestoreDb = null;

function initFirebase() {
  const dot = document.getElementById('cloudStatusDot');
  const txt = document.getElementById('cloudStatusText');

  if (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey && window.firebase) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      firestoreDb = firebase.firestore();

      if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0';
      if (txt) txt.textContent = 'Nuvem Conectada';

      syncFromFirestore();
      subscribeFirestoreRealtime();
    } catch (err) {
      console.warn('Erro ao inicializar Firebase:', err);
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-rose-500 shrink-0';
      if (txt) txt.textContent = 'Nuvem: Erro';
    }
  } else {
    if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-400 shrink-0';
    if (txt) txt.textContent = 'Nuvem Desconectada';
  }
}

async function syncFromFirestore() {
  if (!firestoreDb) return;

  try {
    const snapshot = await firestoreDb.collection('melhorias').get();

    if (snapshot.empty) {
      // Auto-seed: grava as melhorias atuais de 2026 no Firestore
      const cards2026 = cardsByYear[2026] || [];
      if (cards2026.length > 0) {
        const batch = firestoreDb.batch();
        cards2026.forEach(c => {
          const docRef = firestoreDb.collection('melhorias').doc(c.id);
          batch.set(docRef, {
            id: c.id,
            year: 2026,
            idList: c.idList,
            name: c.name,
            desc: c.desc || '',
            tag: c.tag || 'Geral',
            author: c.author || 'Pedro Levi',
            week: c.week || 44,
            date: c.date || new Date().toISOString()
          });
        });
        await batch.commit();
        console.log(`Auto-seed concluído com ${cards2026.length} melhorias no Firestore.`);
      }
    } else {
      const remoteCards2026 = [];
      const remoteCards2027 = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const card = {
          id: doc.id,
          idShort: 1,
          idList: data.idList,
          name: data.name,
          desc: data.desc || '',
          tag: data.tag || 'Geral',
          author: data.author || 'Pedro Levi',
          week: data.week || 44,
          date: data.date || new Date().toISOString()
        };

        if (data.year === 2027) {
          remoteCards2027.push(card);
        } else {
          remoteCards2026.push(card);
        }
      });

      cardsByYear[2026] = remoteCards2026;
      cardsByYear[2027] = remoteCards2027;
      persistData();
      renderAll();
    }
  } catch (err) {
    console.warn('Erro ao sincronizar dados do Firestore:', err);
  }
}

function subscribeFirestoreRealtime() {
  if (!firestoreDb) return;

  try {
    firestoreDb.collection('melhorias').onSnapshot((snapshot) => {
      let hasChanges = false;

      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const yr = data.year || 2026;
        const cardId = change.doc.id;

        if (change.type === 'added') {
          if (!cardsByYear[yr].some(c => c.id === cardId)) {
            cardsByYear[yr].push({
              id: cardId,
              idShort: 1,
              idList: data.idList,
              name: data.name,
              desc: data.desc || '',
              tag: data.tag || 'Geral',
              author: data.author || 'Pedro Levi',
              week: data.week || 44,
              date: data.date || new Date().toISOString()
            });
            hasChanges = true;
          }
        } else if (change.type === 'modified') {
          const card = cardsByYear[yr].find(c => c.id === cardId);
          if (card) {
            card.idList = data.idList;
            card.name = data.name;
            card.desc = data.desc || '';
            card.tag = data.tag || 'Geral';
            card.author = data.author || 'Pedro Levi';
            card.week = data.week;
            card.date = data.date;
            hasChanges = true;
          }
        } else if (change.type === 'removed') {
          cardsByYear[2026] = cardsByYear[2026].filter(c => c.id !== cardId);
          cardsByYear[2027] = cardsByYear[2027].filter(c => c.id !== cardId);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        persistData();
        renderAll();
      }
    });
  } catch (err) {
    console.warn('Erro no listener em tempo real do Firestore:', err);
  }
}

// Start
document.addEventListener('DOMContentLoaded', initApp);
