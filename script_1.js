// Configurações da aplicação
const CONFIG = {
    UPDATE_INTERVALS: {
        LIVE_MATCHES: 10000,    // 10 segundos para jogos ao vivo
        OTHER_DATA: 120000,     // 2 minutos para outros dados
        COMPETITIONS: 300000    // 5 minutos para competições
    },
    API: {
        BASE_URL: 'https://api.football-data.org/v4',
        // Para demonstração, usaremos dados simulados
        // Em produção, você substituiria por uma API real
        USE_MOCK_DATA: false
    }
};

// Estado global da aplicação
const AppState = {
    currentTab: 'live',
    currentDate: 'today',
    currentSection: 'matches',
    lastUpdate: new Date(),
    updateIntervals: {},
    matches: {
        live: [],
        upcoming: [],
        results: []
    },
    competitions: [],
    favorites: [],
    selectedMatch: null
};

// Dados simulados para demonstração
const MockData = {
    liveMatches: [
        {
            id: 'live_1',
            homeTeam: { name: 'Flamengo', logo: 'FLA', id: 1 },
            awayTeam: { name: 'Palmeiras', logo: 'PAL', id: 2 },
            score: { home: 2, away: 1 },
            status: 'live',
            minute: 78,
            league: 'Brasileirão Série A',
            events: [
                { type: 'goal', minute: 23, team: 'home', player: 'Gabriel Barbosa' },
                { type: 'goal', minute: 45, team: 'away', player: 'Rony' },
                { type: 'goal', minute: 67, team: 'home', player: 'Pedro' },
                { type: 'card', minute: 34, team: 'away', player: 'Gustavo Gómez' }
            ],
            statistics: {
                possession: { home: 58, away: 42 },
                shots: { home: 12, away: 8 },
                shotsOnTarget: { home: 6, away: 3 },
                corners: { home: 7, away: 4 },
                fouls: { home: 11, away: 14 }
            },
            lineups: {
                home: [
                    { number: 1, name: 'Santos', position: 'GK' },
                    { number: 2, name: 'Varela', position: 'RB' },
                    { number: 3, name: 'Léo Pereira', position: 'CB' },
                    { number: 4, name: 'David Luiz', position: 'CB' },
                    { number: 6, name: 'Filipe Luís', position: 'LB' },
                    { number: 8, name: 'Gerson', position: 'CM' },
                    { number: 5, name: 'Pulgar', position: 'CM' },
                    { number: 14, name: 'De la Cruz', position: 'AM' },
                    { number: 7, name: 'Michael', position: 'RW' },
                    { number: 9, name: 'Pedro', position: 'ST' },
                    { number: 10, name: 'Gabriel Barbosa', position: 'ST' }
                ],
                away: [
                    { number: 21, name: 'Weverton', position: 'GK' },
                    { number: 2, name: 'Marcos Rocha', position: 'RB' },
                    { number: 15, name: 'Gustavo Gómez', position: 'CB' },
                    { number: 26, name: 'Murilo', position: 'CB' },
                    { number: 6, name: 'Piquerez', position: 'LB' },
                    { number: 8, name: 'Zé Rafael', position: 'CM' },
                    { number: 5, name: 'Aníbal Moreno', position: 'CM' },
                    { number: 23, name: 'Raphael Veiga', position: 'AM' },
                    { number: 11, name: 'Dudu', position: 'RW' },
                    { number: 10, name: 'Rony', position: 'ST' },
                    { number: 7, name: 'Endrick', position: 'ST' }
                ]
            }
        },
        {
            id: 'live_2',
            homeTeam: { name: 'Manchester City', logo: 'MCI', id: 3 },
            awayTeam: { name: 'Liverpool', logo: 'LIV', id: 4 },
            score: { home: 1, away: 1 },
            status: 'live',
            minute: 67,
            league: 'Premier League',
            events: [
                { type: 'goal', minute: 23, team: 'home', player: 'Erling Haaland' },
                { type: 'goal', minute: 56, team: 'away', player: 'Mohamed Salah' },
                { type: 'card', minute: 18, team: 'home', player: 'Rodri' }
            ],
            statistics: {
                possession: { home: 65, away: 35 },
                shots: { home: 15, away: 7 },
                shotsOnTarget: { home: 5, away: 4 },
                corners: { home: 8, away: 2 },
                fouls: { home: 8, away: 12 }
            }
        }
    ],
    upcomingMatches: [
        {
            id: 'upcoming_1',
            homeTeam: { name: 'Real Madrid', logo: 'RMA', id: 5 },
            awayTeam: { name: 'Barcelona', logo: 'BAR', id: 6 },
            status: 'scheduled',
            scheduledTime: '16:00',
            league: 'La Liga',
            date: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 horas no futuro
        },
        {
            id: 'upcoming_2',
            homeTeam: { name: 'Juventus', logo: 'JUV', id: 7 },
            awayTeam: { name: 'Inter Milan', logo: 'INT', id: 8 },
            status: 'scheduled',
            scheduledTime: '20:45',
            league: 'Serie A',
            date: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 horas no futuro
        }
    ],
    finishedMatches: [
        {
            id: 'finished_1',
            homeTeam: { name: 'São Paulo', logo: 'SAO', id: 9 },
            awayTeam: { name: 'Corinthians', logo: 'COR', id: 10 },
            score: { home: 2, away: 1 },
            status: 'finished',
            league: 'Brasileirão Série A',
            events: [
                { type: 'goal', minute: 34, team: 'home', player: 'Calleri' },
                { type: 'goal', minute: 67, team: 'away', player: 'Yuri Alberto' },
                { type: 'goal', minute: 89, team: 'home', player: 'Luciano' }
            ]
        },
        {
            id: 'finished_2',
            homeTeam: { name: 'Bayern Munich', logo: 'BAY', id: 11 },
            awayTeam: { name: 'Borussia Dortmund', logo: 'BVB', id: 12 },
            score: { home: 3, away: 0 },
            status: 'finished',
            league: 'Bundesliga',
            events: [
                { type: 'goal', minute: 12, team: 'home', player: 'Harry Kane' },
                { type: 'goal', minute: 45, team: 'home', player: 'Jamal Musiala' },
                { type: 'goal', minute: 78, team: 'home', player: 'Thomas Müller' }
            ]
        }
    ],
    competitions: [
        { id: 1, name: 'Brasileirão Série A', logo: 'BRA', matches: 15, type: 'national' },
        { id: 2, name: 'Premier League', logo: 'ENG', matches: 8, type: 'national' },
        { id: 3, name: 'La Liga', logo: 'ESP', matches: 6, type: 'national' },
        { id: 4, name: 'Serie A', logo: 'ITA', matches: 4, type: 'national' },
        { id: 5, name: 'Bundesliga', logo: 'GER', matches: 3, type: 'national' },
        { id: 6, name: 'Champions League', logo: 'UCL', matches: 12, type: 'international' },
        { id: 7, name: 'Europa League', logo: 'UEL', matches: 8, type: 'international' },
        { id: 8, name: 'Copa Libertadores', logo: 'LIB', matches: 6, type: 'international' }
    ]
};

// Elementos DOM
const elements = {
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    lastUpdateTime: document.getElementById('last-update-time'),
    refreshIcon: document.getElementById('refresh-icon'),
    refreshBtn: document.getElementById('refresh-btn'),
    
    // Tabs
    navTabs: document.querySelectorAll('.nav-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Date filter
    dateBtns: document.querySelectorAll('.date-btn'),
    
    // Bottom navigation
    bottomNavBtns: document.querySelectorAll('.bottom-nav-btn'),
    sectionContents: document.querySelectorAll('.section-content'),
    
    // Match containers
    liveMatches: document.getElementById('live-matches'),
    upcomingMatches: document.getElementById('upcoming-matches'),
    resultsMatches: document.getElementById('results-matches'),
    
    // Competitions
    competitionsList: document.getElementById('competitions-list'),
    competitionsFilter: document.querySelectorAll('.filter-btn'),
    
    // Modal
    modal: document.getElementById('match-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    modalClose: document.getElementById('modal-close')
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadInitialData();
    startAutoUpdate();
    updateLastUpdateTime();
}

function setupEventListeners() {
    // Navigation tabs
    elements.navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Date filter
    elements.dateBtns.forEach(btn => {
        btn.addEventListener('click', () => switchDate(btn.dataset.date));
    });
    
    // Bottom navigation
    elements.bottomNavBtns.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });
    
    // Competitions filter
    elements.competitionsFilter.forEach(btn => {
        btn.addEventListener('click', () => filterCompetitions(btn.dataset.filter));
    });
    
    // Refresh button
    elements.refreshBtn.addEventListener('click', () => {
        elements.refreshIcon.classList.add('spinning');
        loadData().finally(() => {
            setTimeout(() => {
                elements.refreshIcon.classList.remove('spinning');
            }, 1000);
        });
    });
    
    // Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });
}

function switchTab(tabId) {
    AppState.currentTab = tabId;
    
    // Update tab buttons
    elements.navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    
    // Update tab contents
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}-content`);
    });
    
    renderMatches();
}

function switchDate(date) {
    AppState.currentDate = date;
    
    // Update date buttons
    elements.dateBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.date === date);
    });
    
    loadData();
}

function switchSection(section) {
    AppState.currentSection = section;
    
    // Update bottom nav buttons
    elements.bottomNavBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
    
    // Show/hide sections
    const mainContent = document.querySelector('.main-content');
    elements.sectionContents.forEach(content => {
        content.style.display = 'none';
    });
    
    if (section === 'matches') {
        mainContent.style.display = 'block';
    } else {
        mainContent.style.display = 'none';
        const sectionElement = document.getElementById(`${section}-section`);
        if (sectionElement) {
            sectionElement.style.display = 'block';
        }
    }
    
    if (section === 'competitions') {
        renderCompetitions();
    }
}

function filterCompetitions(filter) {
    elements.competitionsFilter.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderCompetitions(filter);
}

async function loadInitialData() {
    showLoading(true);
    try {
        await loadData();
        showLoading(false);
    } catch (error) {
        showError();
        showLoading(false);
    }
}

async function loadData() {
    try {
        if (CONFIG.API.USE_MOCK_DATA) {
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Simular mudanças nos dados ao vivo
            simulateDataChanges();
            
            AppState.matches.live = MockData.liveMatches;
            AppState.matches.upcoming = MockData.upcomingMatches;
            AppState.matches.results = MockData.finishedMatches;
            AppState.competitions = MockData.competitions;
        } else {
            // Aqui você faria as chamadas reais para a API
            // const liveData = await fetchFromAPI('/matches/live');
            // const upcomingData = await fetchFromAPI('/matches/upcoming');
            // etc.
        }
        
        renderMatches();
        AppState.lastUpdate = new Date();
        updateLastUpdateTime();
        hideError();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError();
    }
}

function simulateDataChanges() {
    // Simular mudanças nos jogos ao vivo
    MockData.liveMatches.forEach(match => {
        if (match.status === 'live') {
            // Atualizar minuto
            if (match.minute < 90) {
                match.minute += Math.floor(Math.random() * 2) + 1;
            }
            
            // Simular eventos ocasionais
            if (Math.random() < 0.05) { // 5% de chance
                const eventTypes = ['goal', 'card'];
                const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                const team = Math.random() < 0.5 ? 'home' : 'away';
                
                if (eventType === 'goal') {
                    if (team === 'home') {
                        match.score.home++;
                    } else {
                        match.score.away++;
                    }
                }
                
                match.events.push({
                    type: eventType,
                    minute: match.minute,
                    team: team,
                    player: `Jogador ${Math.floor(Math.random() * 11) + 1}`
                });
            }
            
            // Finalizar jogo se passou dos 90 minutos
            if (match.minute >= 90 && Math.random() < 0.3) {
                match.status = 'finished';
                match.minute = 90;
                
                // Mover para resultados
                MockData.finishedMatches.unshift(match);
                MockData.liveMatches = MockData.liveMatches.filter(m => m.id !== match.id);
            }
        }
    });
}

function renderMatches() {
    const container = getMatchContainer();
    const matches = getFilteredMatches();
    
    if (matches.length === 0) {
        container.innerHTML = createNoMatchesMessage();
        return;
    }
    
    container.innerHTML = matches.map(match => createMatchCard(match)).join('');
    
    // Adicionar event listeners para os cards
    container.querySelectorAll('.match-card').forEach(card => {
        card.addEventListener('click', () => {
            const matchId = card.dataset.matchId;
            const match = findMatchById(matchId);
            if (match) {
                showMatchDetail(match);
            }
        });
    });
}

function getMatchContainer() {
    switch (AppState.currentTab) {
        case 'live': return elements.liveMatches;
        case 'upcoming': return elements.upcomingMatches;
        case 'results': return elements.resultsMatches;
        default: return elements.liveMatches;
    }
}

function getFilteredMatches() {
    let matches = AppState.matches[AppState.currentTab] || [];
    
    // Filtrar por data se necessário
    if (AppState.currentDate !== 'today') {
        // Implementar filtro de data aqui
        // matches = matches.filter(match => matchesDateFilter(match));
    }
    
    return matches;
}

function findMatchById(matchId) {
    const allMatches = [
        ...AppState.matches.live,
        ...AppState.matches.upcoming,
        ...AppState.matches.results
    ];
    return allMatches.find(match => match.id === matchId);
}

function createMatchCard(match) {
    const statusClass = match.status === 'live' ? 'live' : match.status === 'finished' ? 'finished' : '';
    const statusText = getStatusText(match);
    const scoreDisplay = getScoreDisplay(match);
    const timeDisplay = getTimeDisplay(match);
    const eventsHtml = createEventsHtml(match.events || []);
    
    return `
        <div class="match-card ${statusClass}" data-match-id="${match.id}">
            <div class="match-header">
                <div class="league-name">
                    <i class="fas fa-trophy"></i>
                    ${match.league}
                </div>
                <div class="match-status ${getStatusClass(match.status)}">
                    ${statusText}
                </div>
            </div>
            
            <div class="match-teams">
                <div class="team home">
                    <div class="team-logo">${match.homeTeam.logo}</div>
                    <div class="team-name">${match.homeTeam.name}</div>
                </div>
                
                <div class="score-container">
                    <div class="score">${scoreDisplay}</div>
                    <div class="match-time">${timeDisplay}</div>
                </div>
                
                <div class="team away">
                    <div class="team-name">${match.awayTeam.name}</div>
                    <div class="team-logo">${match.awayTeam.logo}</div>
                </div>
            </div>
            
            ${eventsHtml ? `<div class="match-events">${eventsHtml}</div>` : ''}
        </div>
    `;
}

function getStatusText(match) {
    switch (match.status) {
        case 'live': return `${match.minute}'`;
        case 'finished': return 'Finalizado';
        case 'scheduled': return match.scheduledTime || 'Agendado';
        default: return '';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'live': return 'status-live';
        case 'finished': return 'status-finished';
        case 'scheduled': return 'status-scheduled';
        default: return '';
    }
}

function getScoreDisplay(match) {
    if (match.score && match.score.home !== undefined && match.score.away !== undefined) {
        return `${match.score.home} - ${match.score.away}`;
    }
    return 'vs';
}

function getTimeDisplay(match) {
    if (match.status === 'live') {
        return 'AO VIVO';
    } else if (match.status === 'scheduled') {
        return match.scheduledTime || '';
    }
    return '';
}

function createEventsHtml(events) {
    if (!events || events.length === 0) return '';
    
    return events.slice(-4).map(event => {
        const icon = getEventIcon(event.type);
        const eventClass = event.type === 'red-card' ? 'red-card' : event.type;
        
        return `
            <div class="event ${eventClass}">
                <i class="${icon}"></i>
                <span>${event.minute}' ${event.player}</span>
            </div>
        `;
    }).join('');
}

function getEventIcon(eventType) {
    switch (eventType) {
        case 'goal': return 'fas fa-futbol';
        case 'card': return 'fas fa-square';
        case 'red-card': return 'fas fa-square';
        default: return 'fas fa-circle';
    }
}

function createNoMatchesMessage() {
    const tabDescriptions = {
        live: 'ao vivo',
        upcoming: 'agendados',
        results: 'finalizados'
    };
    
    return `
        <div class="no-matches">
            <i class="fas fa-futbol"></i>
            <h3>Nenhuma partida encontrada</h3>
            <p>Não há jogos ${tabDescriptions[AppState.currentTab]} no momento.</p>
        </div>
    `;
}

function renderCompetitions(filter = 'all') {
    let competitions = AppState.competitions;
    
    if (filter !== 'all') {
        competitions = competitions.filter(comp => comp.type === filter);
    }
    
    // Ordenar por número de partidas
    competitions.sort((a, b) => b.matches - a.matches);
    
    elements.competitionsList.innerHTML = competitions.map(comp => `
        <div class="competition-item" data-competition-id="${comp.id}">
            <div class="competition-info">
                <div class="competition-logo">${comp.logo}</div>
                <div class="competition-name">${comp.name}</div>
            </div>
            <div class="competition-matches">${comp.matches} jogos</div>
        </div>
    `).join('');
}

function showMatchDetail(match) {
    AppState.selectedMatch = match;
    elements.modalTitle.textContent = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
    elements.modalBody.innerHTML = createMatchDetailContent(match);
    elements.modal.style.display = 'block';
    
    // Setup detail tabs
    setupDetailTabs();
}

function createMatchDetailContent(match) {
    return `
        <div class="match-detail-header">
            <div class="match-detail-teams">
                <div class="match-detail-team">
                    <div class="match-detail-logo">${match.homeTeam.logo}</div>
                    <h4>${match.homeTeam.name}</h4>
                </div>
                <div class="match-detail-score">${getScoreDisplay(match)}</div>
                <div class="match-detail-team">
                    <div class="match-detail-logo">${match.awayTeam.logo}</div>
                    <h4>${match.awayTeam.name}</h4>
                </div>
            </div>
            <div class="match-status ${getStatusClass(match.status)}">
                ${getStatusText(match)}
            </div>
        </div>
        
        <div class="detail-tabs">
            <button class="detail-tab active" data-detail-tab="events">Eventos</button>
            ${match.statistics ? '<button class="detail-tab" data-detail-tab="stats">Estatísticas</button>' : ''}
            ${match.lineups ? '<button class="detail-tab" data-detail-tab="lineups">Escalações</button>' : ''}
        </div>
        
        <div class="detail-content active" id="events-detail">
            ${createEventsDetail(match.events || [])}
        </div>
        
        ${match.statistics ? `
        <div class="detail-content" id="stats-detail">
            ${createStatsDetail(match.statistics)}
        </div>
        ` : ''}
        
        ${match.lineups ? `
        <div class="detail-content" id="lineups-detail">
            ${createLineupsDetail(match.lineups)}
        </div>
        ` : ''}
    `;
}

function createEventsDetail(events) {
    if (!events || events.length === 0) {
        return '<p>Nenhum evento registrado.</p>';
    }
    
    return events.map(event => `
        <div class="event-detail">
            <div class="event-time">${event.minute}'</div>
            <div class="event-info">
                <i class="${getEventIcon(event.type)}"></i>
                <span>${event.player}</span>
                <small>(${event.team === 'home' ? AppState.selectedMatch.homeTeam.name : AppState.selectedMatch.awayTeam.name})</small>
            </div>
        </div>
    `).join('');
}

function createStatsDetail(stats) {
    return `
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${stats.possession.home}%</div>
                <div class="stat-label">Posse de Bola</div>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${stats.possession.home}%"></div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.possession.away}%</div>
                <div class="stat-label">Posse de Bola</div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${stats.shots.home}</div>
                <div class="stat-label">Chutes</div>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(stats.shots.home / (stats.shots.home + stats.shots.away)) * 100}%"></div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.shots.away}</div>
                <div class="stat-label">Chutes</div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${stats.shotsOnTarget.home}</div>
                <div class="stat-label">Chutes no Gol</div>
            </div>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(stats.shotsOnTarget.home / (stats.shotsOnTarget.home + stats.shotsOnTarget.away)) * 100}%"></div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.shotsOnTarget.away}</div>
                <div class="stat-label">Chutes no Gol</div>
            </div>
        </div>
    `;
}

function createLineupsDetail(lineups) {
    return `
        <div class="lineup-formation">
            <div class="formation-title">${AppState.selectedMatch.homeTeam.name}</div>
            <div class="players-list">
                ${lineups.home.map(player => `
                    <div class="player-item">
                        <div class="player-number">${player.number}</div>
                        <div class="player-name">${player.name}</div>
                        <div class="player-position">${player.position}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="lineup-formation">
            <div class="formation-title">${AppState.selectedMatch.awayTeam.name}</div>
            <div class="players-list">
                ${lineups.away.map(player => `
                    <div class="player-item">
                        <div class="player-number">${player.number}</div>
                        <div class="player-name">${player.name}</div>
                        <div class="player-position">${player.position}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function setupDetailTabs() {
    const detailTabs = elements.modal.querySelectorAll('.detail-tab');
    const detailContents = elements.modal.querySelectorAll('.detail-content');
    
    detailTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.detailTab;
            
            detailTabs.forEach(t => t.classList.remove('active'));
            detailContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const content = elements.modal.querySelector(`#${tabId}-detail`);
            if (content) content.classList.add('active');
        });
    });
}

function closeModal() {
    elements.modal.style.display = 'none';
    AppState.selectedMatch = null;
}

function startAutoUpdate() {
    // Atualização para jogos ao vivo (10 segundos)
    AppState.updateIntervals.live = setInterval(() => {
        if (AppState.currentTab === 'live' && AppState.matches.live.length > 0) {
            loadData();
        }
    }, CONFIG.UPDATE_INTERVALS.LIVE_MATCHES);
    
    // Atualização para outros dados (2 minutos)
    AppState.updateIntervals.other = setInterval(() => {
        if (AppState.currentTab !== 'live') {
            loadData();
        }
    }, CONFIG.UPDATE_INTERVALS.OTHER_DATA);
    
    // Atualização para competições (5 minutos)
    AppState.updateIntervals.competitions = setInterval(() => {
        if (AppState.currentSection === 'competitions') {
            // Atualizar dados de competições
            loadData();
        }
    }, CONFIG.UPDATE_INTERVALS.COMPETITIONS);
}

function stopAutoUpdate() {
    Object.values(AppState.updateIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
    });
    AppState.updateIntervals = {};
}

function showLoading(show) {
    elements.loading.style.display = show ? 'block' : 'none';
}

function showError() {
    elements.errorMessage.style.display = 'block';
    setTimeout(() => {
        elements.errorMessage.style.display = 'none';
        loadData(); // Tentar novamente
    }, 3000);
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

function updateLastUpdateTime() {
    const timeString = AppState.lastUpdate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    elements.lastUpdateTime.textContent = `Atualizado às ${timeString}`;
}

// Cleanup quando a página é fechada
window.addEventListener('beforeunload', () => {
    stopAutoUpdate();
});

// Pausar atualizações quando a aba não está visível
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoUpdate();
    } else {
        startAutoUpdate();
        loadData(); // Atualizar imediatamente quando voltar
    }
});

