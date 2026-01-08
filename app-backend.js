// =====================================================
// NewsFlow - Новостной агрегатор с поддержкой Scientific Backend
// =====================================================

// Попытка загрузить конфигурацию
let CONFIG;
try {
    if (typeof require !== 'undefined') {
        CONFIG = require('./config.js');
    } else {
        CONFIG = window.CONFIG || {
            API_KEY: 'demo',
            BASE_URL: 'https://newsdata.io/api/1/news',
            BACKEND_URL: 'https://newsflow-backend-fs2i.onrender.com/api/news',
            API_TYPE: 'newsdata', // 'newsdata' или 'custom'
            APP_NAME: 'NewsFlow',
            LANGUAGE: 'en',
            PAGE_SIZE: 20,
            DEBUG: true
        };
    }
} catch (e) {
    console.warn('config.js не найден, используются настройки по умолчанию');
    CONFIG = {
        API_KEY: 'demo',
        BASE_URL: 'https://newsdata.io/api/1/news',
        BACKEND_URL: 'https://newsflow-backend-fs2i.onrender.com/api/news',
        API_TYPE: 'newsdata',
        APP_NAME: 'NewsFlow',
        LANGUAGE: 'en',
        PAGE_SIZE: 20,
        DEBUG: true
    };
}

// Проверка на Demo ключ и тип API
const isDemoMode = CONFIG.API_KEY === 'demo' || CONFIG.API_KEY === 'YOUR_API_KEY_HERE';
const isCustomBackend = CONFIG.API_TYPE === 'custom';
const BACKEND_API = CONFIG.BACKEND_URL || 'https://newsflow-backend-fs2i.onrender.com/api/news';

// =====================================================
// Статические данные (Fallback)
// =====================================================
const newsData = [
    {
        id: 1,
        sourceName: "TechCrunch",
        sourceIcon: "https://ui-avatars.com/api/?name=TC&background=00D1B2&color=fff&size=32",
        category: "technology",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        title: "Искусственный интеллект продолжает революционизировать технологическую индустрию",
        snippet: "Ведущие технологические компании инвестируют миллиарды в разработку систем машинного обучения, обещая новую эру инноваций.",
        timestamp: "2 часа назад",
        featured: true
    },
    {
        id: 2,
        sourceName: "Bloomberg",
        sourceIcon: "https://ui-avatars.com/api/?name=BB&background=FF6B35&color=fff&size=32",
        category: "business",
        imageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80",
        title: "Глобальные рынки демонстрируют устойчивый рост в первом квартале",
        snippet: "Инвесторы оптимистично настроены относительно перспектив мировой экономики в 2024 году.",
        timestamp: "3 часа назад",
        featured: false
    },
    {
        id: 3,
        sourceName: "Nature",
        sourceIcon: "https://ui-avatars.com/api/?name=NA&background=228B22&color=fff&size=32",
        category: "science",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        title: "Учёные совершили прорыв в области термоядерного синтеза",
        snippet: "Международная команда исследователей достигла исторического результата в экспериментах по управляемому термоядерному синтезу.",
        timestamp: "4 часа назад",
        featured: false
    },
    {
        id: 4,
        sourceName: "Health News",
        sourceIcon: "https://ui-avatars.com/api/?name=HN&background=DC143C&color=fff&size=32",
        category: "health",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        title: "Новое исследование выявило связь между сном и продуктивностью",
        snippet: "Эксперты рекомендуют соблюдать режим сна для улучшения когнитивных функций и общего состояния здоровья.",
        timestamp: "5 часов назад",
        featured: false
    },
    {
        id: 5,
        sourceName: "ESPN",
        sourceIcon: "https://ui-avatars.com/api/?name=ES&background=FF0000&color=fff&size=32",
        category: "sports",
        imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
        title: "Сборная России по футболу готовится к важным международным матчам",
        snippet: "Команда проводит интенсивные тренировки перед квалификационными играми чемпионата мира.",
        timestamp: "6 часов назад",
        featured: false
    },
    {
        id: 6,
        sourceName: "Variety",
        sourceIcon: "https://ui-avatars.com/api/?name=VA&background=9400D3&color=fff&size=32",
        category: "entertainment",
        imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
        title: "Премьера нового сезона популярного сериала побила рекорды просмотров",
        snippet: "Стриминговый сервис объявил о продлении шоу на следующий сезон после невероятного успеха.",
        timestamp: "7 часов назад",
        featured: false
    },
    // Научные категории
    {
        id: 101,
        sourceName: "Nature Microbiology",
        sourceIcon: "https://ui-avatars.com/api/?name=NM&background=2E8B57&color=fff&size=32",
        category: "microbiology",
        imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&q=80",
        title: "Новый вид бактерий обнаружен в экстремальных условиях глубоководных источников",
        snippet: "Исследователи нашли микроорганизмы, способные выживать при температуре выше 100°C.",
        timestamp: "2 часа назад",
        featured: true
    },
    {
        id: 201,
        sourceName: "Cell Press",
        sourceIcon: "https://ui-avatars.com/api/?name=CP&background=8B4513&color=fff&size=32",
        category: "aging",
        imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80",
        title: "Учёные выявили ключевой механизм клеточного старения",
        snippet: "Новое исследование открывает путь к разработке препаратов замедляющих возрастные изменения.",
        timestamp: "3 часа назад",
        featured: true
    },
    {
        id: 301,
        sourceName: "Nature Biotechnology",
        sourceIcon: "https://ui-avatars.com/api/?name=NB&background=DC143C&color=fff&size=32",
        category: "crispr",
        imageUrl: "https://images.unsplash.com/photo-1530224264768-7ff8c1789d79?w=800&q=80",
        title: "CRISPR-терапия успешно вылечила редкое генетическое заболевание",
        snippet: "Первое в мире применение генного редактирования для лечения врождённой слепоты.",
        timestamp: "4 часа назад",
        featured: true
    },
    {
        id: 401,
        sourceName: "Biotechnology Journal",
        sourceIcon: "https://ui-avatars.com/api/?name=BJ&background=4B0082&color=fff&size=32",
        category: "biotechnology",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
        title: "Биоинженеры создали искусственные органы с кровеносными сосудами",
        snippet: "Прорыв в тканевой инженерии позволяет выращивать функциональные органы.",
        timestamp: "2 часа назад",
        featured: true
    }
];

// Категории приложения -> Параметры API
const categoryMapping = {
    'all': '',
    'technology': 'technology',
    'business': 'business',
    'science': 'science',
    'health': 'health',
    'sports': 'sports',
    'entertainment': 'entertainment',
    'microbiology': 'microbiology',
    'aging': 'aging',
    'crispr': 'crispr',
    'biotechnology': 'biotechnology'
};

// Научные категории для специальной обработки
const scientificCategories = ['microbiology', 'aging', 'crispr', 'biotechnology'];

// =====================================================
// State Management
// =====================================================
let currentCategory = 'all';
let currentTab = 'home';
let savedArticles = new Set();
let displayedNewsCount = 0;
let isLoading = false;
let isRefreshing = false;
let isAPIAvailable = true;
let useBackend = isCustomBackend; // Использовать backend агрегатор

// DOM Elements
const newsFeed = document.getElementById('newsFeed');
const skeletonLoader = document.getElementById('skeletonLoader');
const loadingIndicator = document.getElementById('loadingIndicator');
const searchOverlay = document.getElementById('searchOverlay');
const searchBtn = document.getElementById('searchBtn');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');
const categoriesScroll = document.getElementById('categoriesScroll');
const mainContent = document.getElementById('mainContent');

// =====================================================
// Инициализация
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    
    if (isDemoMode && !isCustomBackend) {
        showToast('⚠️ Демо-режим: добавьте API ключ или настройте backend');
    }
    
    if (isCustomBackend) {
        console.log('🌐 Используется Scientific Backend:', BACKEND_API);
    }
});

function initializeApp() {
    skeletonLoader.style.display = 'flex';
    newsFeed.style.display = 'none';
    
    setTimeout(async () => {
        await loadNews();
        skeletonLoader.style.display = 'none';
        newsFeed.style.display = 'flex';
    }, 1000);
}

// =====================================================
// API Functions
// =====================================================

async function loadNews(category = null) {
    const cat = category || currentCategory;
    
    if (isLoading) return;
    
    isLoading = true;
    showLoadingIndicator();
    
    // Пытаемся загрузить из API
    if (isAPIAvailable && (!isDemoMode || useBackend)) {
        try {
            if (useBackend) {
                await fetchNewsFromBackend(cat);
            } else {
                await fetchNewsFromAPI(cat);
            }
            hideLoadingIndicator();
            isLoading = false;
            return;
        } catch (error) {
            console.warn('API недоступен, используем fallback:', error.message);
            isAPIAvailable = false;
            showToast('📡 Нет соединения с сервером новостей');
        }
    }
    
    loadStaticFallback(cat);
    hideLoadingIndicator();
    isLoading = false;
}

/**
 * Загрузка из Scientific Backend API
 */
async function fetchNewsFromBackend(category) {
    let url = `${BACKEND_API}?limit=${CONFIG.PAGE_SIZE}`;
    
    if (category && category !== 'all') {
        url += `&category=${category}`;
    }
    
    if (CONFIG.DEBUG) {
        console.log('🌐 Загрузка из Backend API:', url);
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (CONFIG.DEBUG) {
        console.log('Ответ Backend:', data);
    }
    
    if (!data.success) {
        throw new Error(data.error || 'Ошибка API');
    }
    
    if (!data.data || data.data.length === 0) {
        console.warn('Backend вернул пустой результат');
        throw new Error('Пустой результат от API');
    }
    
    // Преобразуем данные в формат приложения
    const news = data.data.map((item, index) => transformBackendData(item, index, category));
    
    newsFeed.innerHTML = '';
    displayedNewsCount = 0;
    
    news.forEach((article, index) => {
        setTimeout(() => {
            renderNewsCard(article, displayedNewsCount++);
        }, index * 100);
    });
    
    displayedNewsCount = news.length;
}

/**
 * Преобразование данных Backend API в формат приложения
 */
function transformBackendData(apiItem, index, category) {
    const sourceName = apiItem.source || 'Scientific News';
    const sourceInitial = sourceName.charAt(0).toUpperCase();
    const colors = ['00D1B2', 'FF6B35', '228B22', 'DC143C', 'FF0000', '9400D3', '00C853', '4169E1'];
    const bgColor = colors[index % colors.length];
    
    // Форматируем дату
    let timestamp = '';
    if (apiItem.pubDate) {
        const date = new Date(apiItem.pubDate);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffHours < 1) {
            timestamp = 'Только что';
        } else if (diffHours < 24) {
            timestamp = `${diffHours} ${getHourString(diffHours)} назад`;
        } else if (diffDays < 7) {
            timestamp = `${diffDays} ${getDayString(diffDays)} назад`;
        } else {
            timestamp = date.toLocaleDateString('ru-RU');
        }
    } else {
        timestamp = 'Недавно';
    }
    
    // Изображение (пытаемся извлечь из контента или используем плейсхолдер)
    let imageUrl = null;
    const content = apiItem.fullContent || apiItem.content || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
        imageUrl = imgMatch[1];
    }
    
    const placeholderImages = [
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
        'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
        'https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?w=800&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    ];
    
    return {
        id: apiItem.id || `backend_${index}_${Date.now()}`,
        sourceName: sourceName,
        sourceIcon: `https://ui-avatars.com/api/?name=${sourceInitial}&background=${bgColor}&color=fff&size=32`,
        category: category || apiItem.categories?.[0] || 'science',
        imageUrl: imageUrl || placeholderImages[index % placeholderImages.length],
        title: apiItem.title || 'Без названия',
        snippet: apiItem.content || 'Читайте полную версию статьи по ссылке...',
        timestamp: timestamp,
        link: apiItem.link,
        featured: index === 0
    };
}

/**
 * Загрузка из NewsData.io API
 */
async function fetchNewsFromAPI(category) {
    const apiCategory = categoryMapping[category] || '';
    const isSearchCategory = scientificCategories.includes(category);
    
    const params = new URLSearchParams({
        apikey: CONFIG.API_KEY,
        language: CONFIG.LANGUAGE
    });
    
    if (isSearchCategory) {
        // Поисковые категории через параметр q
        const searchQueries = {
            'microbiology': 'microbiology OR bacteria OR virus OR microbiome',
            'aging': 'aging OR longevity OR "anti-aging" OR gerontology',
            'crispr': 'CRISPR OR "gene editing" OR Cas9 OR genome',
            'biotechnology': 'biotechnology OR biotech OR "bio tech"'
        };
        params.append('q', searchQueries[category]);
    } else if (apiCategory) {
        params.append('category', apiCategory);
    }
    
    const url = `${CONFIG.BASE_URL}?${params.toString()}`;
    
    if (CONFIG.DEBUG) {
        console.log('Загрузка новостей из API:', url);
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (CONFIG.DEBUG) {
        console.log('Ответ API:', data);
    }
    
    if (data.status === 'error') {
        throw new Error(data.results?.message || 'Ошибка API');
    }
    
    if (!data.results || data.results.length === 0) {
        console.warn('API вернул пустой результат');
        throw new Error('Пустой результат от API');
    }
    
    const news = data.results.map((item, index) => transformAPIData(item, index, category));
    
    newsFeed.innerHTML = '';
    displayedNewsCount = 0;
    
    news.forEach((article, index) => {
        setTimeout(() => {
            renderNewsCard(article, displayedNewsCount++);
        }, index * 100);
    });
    
    displayedNewsCount = news.length;
}

/**
 * Преобразование данных NewsData.io API
 */
function transformAPIData(apiItem, index, category) {
    const sourceName = apiItem.source_name || apiItem.source_id || 'News';
    const sourceInitial = sourceName.charAt(0).toUpperCase();
    const colors = ['00D1B2', 'FF6B35', '228B22', 'DC143C', 'FF0000', '9400D3', '00C853', '4169E1'];
    const bgColor = colors[index % colors.length];
    
    let timestamp = '';
    if (apiItem.pubDate) {
        const date = new Date(apiItem.pubDate);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffHours < 1) {
            timestamp = 'Только что';
        } else if (diffHours < 24) {
            timestamp = `${diffHours} ${getHourString(diffHours)} назад`;
        } else if (diffDays < 7) {
            timestamp = `${diffDays} ${getDayString(diffDays)} назад`;
        } else {
            timestamp = date.toLocaleDateString('ru-RU');
        }
    } else {
        timestamp = 'Недавно';
    }
    
    const placeholderImages = [
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
        'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
        'https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?w=800&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    ];
    
    return {
        id: `api_${index}_${Date.now()}`,
        sourceName: sourceName,
        sourceIcon: `https://ui-avatars.com/api/?name=${sourceInitial}&background=${bgColor}&color=fff&size=32`,
        category: category || '',
        imageUrl: apiItem.image_url || placeholderImages[index % placeholderImages.length],
        title: apiItem.title || 'Без названия',
        snippet: apiItem.description || apiItem.content || 'Читайте полную версию статьи по ссылке...',
        timestamp: timestamp,
        link: apiItem.link,
        featured: index === 0
    };
}

/**
 * Загрузка статических данных (fallback)
 */
function loadStaticFallback(category) {
    if (CONFIG.DEBUG) {
        console.log('Загрузка статических данных, категория:', category);
    }
    
    showToast('📰 Показаны сохранённые новости');
    
    const filteredNews = category === 'all' 
        ? newsData 
        : newsData.filter(item => item.category === category);
    
    newsFeed.innerHTML = '';
    displayedNewsCount = 0;
    
    filteredNews.forEach((article, index) => {
        setTimeout(() => {
            renderNewsCard(article, displayedNewsCount++);
        }, index * 100);
    });
    
    displayedNewsCount = filteredNews.length;
}

// =====================================================
// Event Listeners
// =====================================================
function setupEventListeners() {
    const chips = categoriesScroll.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => handleCategoryChange(chip));
    });

    searchBtn.addEventListener('click', () => openSearch());
    closeSearch.addEventListener('click', () => closeSearchOverlay());

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => handleTabChange(item));
    });

    mainContent.addEventListener('scroll', handleScroll);

    let startY = 0;
    mainContent.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
    });

    mainContent.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].pageY;
        if (endY - startY > 100 && mainContent.scrollTop === 0) {
            handleRefresh();
        }
    });

    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent;
            performSearch();
        });
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// =====================================================
// Handlers
// =====================================================

function handleCategoryChange(clickedChip) {
    const chips = categoriesScroll.querySelectorAll('.chip');
    chips.forEach(chip => chip.classList.remove('active'));
    clickedChip.classList.add('active');

    currentCategory = clickedChip.dataset.category;
    
    newsFeed.innerHTML = '';
    showSkeletonLoader();
    
    setTimeout(async () => {
        hideSkeletonLoader();
        await loadNews();
    }, 500);
}

function handleTabChange(clickedItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    clickedItem.classList.add('active');

    currentTab = clickedItem.dataset.tab;

    if (currentTab === 'saved') {
        renderSavedArticles();
    } else if (currentTab === 'home') {
        loadNews();
    }
}

async function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = mainContent;

    if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading && isAPIAvailable && (!isDemoMode || useBackend)) {
        await loadMoreNews();
    }
}

async function handleRefresh() {
    if (isRefreshing) return;

    isRefreshing = true;
    showRefreshIndicator();

    isAPIAvailable = true;
    displayedNewsCount = 0;
    newsFeed.innerHTML = '';
    
    await loadNews();

    hideRefreshIndicator();
    isRefreshing = false;
}

// =====================================================
// Infinite Scroll
// =====================================================

async function loadMoreNews() {
    if (isDemoMode && !useBackend) {
        loadStaticFallback(currentCategory);
        return;
    }
    
    if (!isAPIAvailable) {
        return;
    }
    
    isLoading = true;
    showLoadingIndicator();

    try {
        if (useBackend) {
            const url = `${BACKEND_API}?limit=${CONFIG.PAGE_SIZE}&offset=${displayedNewsCount}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                const newNews = data.data.map((item, index) => 
                    transformBackendData(item, displayedNewsCount + index, currentCategory)
                );
                
                newNews.forEach((article, index) => {
                    setTimeout(() => {
                        renderNewsCard(article, displayedNewsCount++);
                    }, index * 100);
                });
            }
        } else {
            // Оригинальная логика для NewsData.io
            // ...
        }
    } catch (error) {
        console.warn('Ошибка при загрузке дополнительных новостей:', error);
    }

    hideLoadingIndicator();
    isLoading = false;
}

// =====================================================
// Render Functions
// =====================================================

function renderNewsFeed() {
    loadStaticFallback(currentCategory);
}

function renderNewsCard(article, index) {
    const card = document.createElement('div');
    card.className = `news-card ${article.featured ? 'featured' : ''}`;
    card.style.animationDelay = `${index * 0.05}s`;

    const isSaved = savedArticles.has(article.id);

    card.innerHTML = `
        ${article.featured ? '<div class="featured-badge">Главное</div>' : ''}
        <div class="card-header">
            <div class="source-info">
                <img src="${article.sourceIcon}" alt="${article.sourceName}" class="source-icon" onerror="this.src='https://ui-avatars.com/api/?name=N&background=1A73E8&color=fff&size=32'">
                <span class="source-name">${article.sourceName}</span>
            </div>
            <span class="card-time">${article.timestamp}</span>
        </div>
        <img src="${article.imageUrl}" alt="${article.title}" class="card-image" onerror="handleImageError(this)">
        <div class="card-content">
            <h3 class="card-title">${article.title}</h3>
            <p class="card-snippet">${article.snippet}</p>
            <div class="card-actions">
                <button class="action-btn share-btn" title="Поделиться">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                </button>
                <button class="action-btn bookmark-btn ${isSaved ? 'bookmarked' : ''}" data-id="${article.id}" title="Сохранить">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="${isSaved 
                            ? 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z'
                            : 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z'}"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(article.id, bookmarkBtn);
    });

    const shareBtn = card.querySelector('.share-btn');
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareArticle(article);
    });

    card.addEventListener('click', () => {
        openArticle(article);
    });

    newsFeed.appendChild(card);
}

function renderSavedArticles() {
    newsFeed.innerHTML = '';
    
    if (savedArticles.size === 0) {
        newsFeed.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm-7 15l-5-2.18L7 18V5h10v13z"/>
                </svg>
                <h3>Нет сохранённых статей</h3>
                <p>Нажмите на закладку, чтобы сохранить статью</p>
            </div>
        `;
        return;
    }

    const savedNews = newsData.filter(article => savedArticles.has(article.id));
    savedNews.forEach((article, index) => {
        setTimeout(() => {
            renderNewsCard(article, index);
        }, index * 100);
    });
}

// =====================================================
// Utility Functions
// =====================================================

function toggleBookmark(articleId, button) {
    if (savedArticles.has(articleId)) {
        savedArticles.delete(articleId);
        button.classList.remove('bookmarked');
        button.querySelector('svg path').setAttribute('d', 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z');
    } else {
        savedArticles.add(articleId);
        button.classList.add('bookmarked');
        button.querySelector('svg path').setAttribute('d', 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z');

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
}

function shareArticle(article) {
    const shareData = {
        title: article.title,
        text: article.snippet,
        url: article.link || window.location.href
    };

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        navigator.share(shareData).catch(console.error);
    } else {
        const textToCopy = `${article.title}\n\n${article.snippet}\n\n${shareData.url}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Ссылка скопирована!');
        }).catch(() => {
            showToast('Не удалось скопировать');
        });
    }
}

function openArticle(article) {
    if (article.link) {
        window.open(article.link, '_blank');
    } else {
        showToast('Ссылка недоступна');
    }
}

// =====================================================
// UI Helpers
// =====================================================

function showSkeletonLoader() {
    skeletonLoader.style.display = 'flex';
    newsFeed.style.display = 'none';
}

function hideSkeletonLoader() {
    skeletonLoader.style.display = 'none';
    newsFeed.style.display = 'flex';
}

function showLoadingIndicator() {
    loadingIndicator.classList.add('visible');
}

function hideLoadingIndicator() {
    loadingIndicator.classList.remove('visible');
}

function showRefreshIndicator() {
    let indicator = document.querySelector('.refresh-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'refresh-indicator';
        indicator.innerHTML = '<div class="spinner"></div><span>Обновление...</span>';
        document.body.appendChild(indicator);
    }
    indicator.classList.add('visible');
}

function hideRefreshIndicator() {
    const indicator = document.querySelector('.refresh-indicator');
    if (indicator) {
        indicator.classList.remove('visible');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        animation: fadeInUp 0.3s ease;
        max-width: 80%;
        text-align: center;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =====================================================
// Search Functions
// =====================================================

function openSearch() {
    searchOverlay.classList.add('visible');
    searchInput.focus();
}

function closeSearchOverlay() {
    searchOverlay.classList.remove('visible');
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    closeSearchOverlay();
    showToast(`Поиск: ${query}`);

    const filteredNews = newsData.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.snippet.toLowerCase().includes(query)
    );

    newsFeed.innerHTML = '';

    if (filteredNews.length === 0) {
        newsFeed.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить поисковый запрос</p>
            </div>
        `;
        return;
    }

    filteredNews.forEach((article, index) => {
        setTimeout(() => {
            renderNewsCard(article, index);
        }, index * 100);
    });
}

// =====================================================
// Image Error Handler
// =====================================================

function handleImageError(img) {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
        width: 100%;
        aspect-ratio: 16/9;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        text-align: center;
        padding: 20px;
    `;
    placeholder.textContent = 'Изображение недоступно';
    img.parentElement.insertBefore(placeholder, img);
}

// =====================================================
// Utility
// =====================================================

function getHourString(hours) {
    if (hours % 10 === 1 && hours % 100 !== 11) return 'час';
    if (hours % 10 >= 2 && hours % 10 <= 4 && (hours % 100 < 10 || hours % 100 >= 20)) return 'часа';
    return 'часов';
}

function getDayString(days) {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return 'дня';
    return 'дней';
}

// =====================================================
// Animation Styles
// =====================================================

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);

// =====================================================
// Ripple Effect
// =====================================================

document.addEventListener('click', (e) => {
    const button = e.target.closest('.action-btn, .chip, .nav-item');
    if (button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
});

// =====================================================
// Console Output
// =====================================================

console.log('%c NewsFlow ', 'background: #1A73E8; color: white; padding: 10px; font-size: 20px; font-weight: bold;');
console.log('%c Версия с поддержкой Scientific Backend ', 'color: #1A73E8; font-size: 14px;');
console.log('Настройки:', CONFIG);

if (isDemoMode && !isCustomBackend) {
    console.warn('⚠️ ВНИМАНИЕ: Используется демо-режим!');
    console.warn('Для получения реальных новостей:');
    console.warn('1. Используйте Scientific Backend (рекомендуется)');
    console.warn('2. Или добавьте API ключ NewsData.io в config.js');
}

console.log('✅ NewsFlow инициализирован!');
