import axios from 'axios';

// ============= CONFIGURATION =============
const NEWS_API_KEY = 'dd2d0304768e433cb56b0f057408a8bc'; 
const NEWSDATA_API_KEY = 'pub_56d37a31446d43ed87b434c31f3d824d';
const GUARDIAN_API_KEY = 'test';

// Tech source avatars
const TECH_AVATARS = {
  'TechCrunch': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop',
  'The Verge': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop',
  'Wired': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop',
  'Ars Technica': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop',
  'Hacker News': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop',
  'The Guardian': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop',
  'default_tech': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop'
};

// Cache for news feeds with timestamps
const newsCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes cache
};

// ============= FETCH ALL NEWS FEED =============
export const fetchAllNewsFeed = async (forceRefresh = false) => {
  try {
    // Check cache if not forcing refresh
    const now = Date.now();
    if (!forceRefresh && newsCache.data && newsCache.timestamp && 
        (now - newsCache.timestamp) < newsCache.CACHE_DURATION) {
      console.log('📦 Using cached news feed');
      return newsCache.data;
    }

    console.log('🔄 Fetching fresh news feed from all sources...');
    
    const [
      generalNews,
      techNews,
      sportsNews,
      businessNews,
      entertainmentNews,
      healthNews,
      scienceNews,
      worldNews,
      cryptoNews
    ] = await Promise.all([
      fetchEnhancedGeneralNews(),
      fetchEnhancedTechNews(),
      fetchEnhancedSportsNews(),
      fetchEnhancedBusinessNews(),
      fetchEnhancedEntertainmentNews(),
      fetchEnhancedHealthNews(),
      fetchEnhancedScienceNews(),
      fetchEnhancedWorldNews(),
      fetchEnhancedCryptoNews()
    ]);

    // Combine all news and sort by timestamp (newest first)
    const allPosts = [
      ...generalNews,
      ...techNews,
      ...sportsNews,
      ...businessNews,
      ...entertainmentNews,
      ...healthNews,
      ...scienceNews,
      ...worldNews,
      ...cryptoNews
    ]
      .filter(post => post && post.timestamp) // Filter out invalid posts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by newest first
      .slice(0, 150); // Get more posts for better variety

    // Add unique IDs with timestamp to ensure freshness
    const postsWithFreshIds = allPosts.map((post, index) => ({
      ...post,
      id: `${post.id}_${Date.now()}_${index}`,
      fetchedAt: new Date() // Track when we fetched this
    }));

    // Update cache
    newsCache.data = postsWithFreshIds;
    newsCache.timestamp = now;

    console.log(`✅ Total posts loaded: ${postsWithFreshIds.length} (Fresh: ${forceRefresh ? 'Yes' : 'Cached'})`);
    return postsWithFreshIds;
  } catch (error) {
    console.error('Error fetching all news feed:', error);
    // Return cached data if available, even if expired
    if (newsCache.data) {
      console.log('⚠️ Using expired cache due to error');
      return newsCache.data;
    }
    throw new Error('Unable to fetch news feeds. Please try again later.');
  }
};

// ============= GENERAL NEWS =============
export const fetchEnhancedGeneralNews = async () => {
  const sources = [
    fetchNewsAPIGeneral(),
    fetchNewsDataIOGeneral(),
    fetchGuardianGeneral(),
    fetchBBCNewsRSS(),
    fetchCNNNewsRSS(),
    fetchReutersRSS(),
    fetchNYTimesRSS()
  ];

  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ General news: ${allNews.length} articles`);
    return allNews.slice(0, 20);
  } catch (error) {
    console.error('General news error:', error);
    return [];
  }
};

const fetchNewsAPIGeneral = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=15&apiKey=${NEWS_API_KEY}`
    );
    return response.data.articles.map((article, index) => ({
      id: `general_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'news_source', 
        avatar: getCategoryAvatar('general') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('general', index),
      likes: Math.floor(Math.random() * 1200) + 200,
      comments: Math.floor(Math.random() * 90) + 15,
      timestamp: new Date(article.publishedAt),
      category: 'general',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI General unavailable');
    return [];
  }
};

const fetchNewsDataIOGeneral = async () => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&language=en&category=top`
    );
    return response.data.results.slice(0, 12).map((article, index) => ({
      id: `general_newsdata_${Date.now()}_${index}`,
      user: { 
        name: article.source_id, 
        username: article.source_id, 
        avatar: getCategoryAvatar('general') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.image_url || getRandomImage('general', index),
      likes: Math.floor(Math.random() * 1000) + 180,
      comments: Math.floor(Math.random() * 80) + 12,
      timestamp: new Date(article.pubDate),
      category: 'general',
      source: article.source_id,
      url: article.link,
      liked: false
    }));
  } catch (error) {
    console.log('NewsData.io General unavailable');
    return [];
  }
};

const fetchGuardianGeneral = async () => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/search?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=12`
    );
    return response.data.response.results.map((article, index) => ({
      id: `general_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian', 
        avatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('general', index),
      likes: Math.floor(Math.random() * 1100) + 190,
      comments: Math.floor(Math.random() * 85) + 14,
      timestamp: new Date(article.webPublicationDate),
      category: 'general',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian General unavailable');
    return [];
  }
};

const fetchBBCNewsRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/rss.xml'
    );
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `general_bbc_${Date.now()}_${index}`,
      user: { 
        name: 'BBC News', 
        username: 'bbcnews', 
        avatar: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || getRandomImage('general', index),
      likes: Math.floor(Math.random() * 1300) + 220,
      comments: Math.floor(Math.random() * 95) + 18,
      timestamp: new Date(item.pubDate),
      category: 'general',
      source: 'BBC News',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('BBC News RSS unavailable');
    return [];
  }
};

const fetchCNNNewsRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=http://rss.cnn.com/rss/edition.rss'
    );
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `general_cnn_${Date.now()}_${index}`,
      user: { 
        name: 'CNN', 
        username: 'cnn', 
        avatar: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || getRandomImage('general', index),
      likes: Math.floor(Math.random() * 1400) + 240,
      comments: Math.floor(Math.random() * 100) + 20,
      timestamp: new Date(item.pubDate),
      category: 'general',
      source: 'CNN',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('CNN RSS unavailable');
    return [];
  }
};

const fetchReutersRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.reutersagency.com/feed/'
    );
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `general_reuters_${Date.now()}_${index}`,
      user: { 
        name: 'Reuters', 
        username: 'reuters', 
        avatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('general', index),
      likes: Math.floor(Math.random() * 1100) + 200,
      comments: Math.floor(Math.random() * 85) + 16,
      timestamp: new Date(item.pubDate),
      category: 'general',
      source: 'Reuters',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Reuters RSS unavailable');
    return [];
  }
};

const fetchNYTimesRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'
    );
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `general_nyt_${Date.now()}_${index}`,
      user: { 
        name: 'NY Times', 
        username: 'nytimes', 
        avatar: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('general', index),
      likes: Math.floor(Math.random() * 1200) + 210,
      comments: Math.floor(Math.random() * 90) + 17,
      timestamp: new Date(item.pubDate),
      category: 'general',
      source: 'NY Times',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('NY Times RSS unavailable');
    return [];
  }
};

// ============= BUSINESS NEWS =============
export const fetchEnhancedBusinessNews = async () => {
  const sources = [
    fetchNewsAPIBusiness(), 
    fetchNewsDataIOBusiness(), 
    fetchGuardianBusiness(),
    fetchForbesRSS(),
    fetchBloombergRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ Business news: ${allNews.length} articles`);
    return allNews.slice(0, 18);
  } catch (error) {
    console.error('Business news error:', error);
    return [];
  }
};

const fetchNewsAPIBusiness = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=business&country=us&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    return response.data.articles.map((article, index) => ({
      id: `business_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'business_news', 
        avatar: getCategoryAvatar('business') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('business', index),
      likes: Math.floor(Math.random() * 900) + 150,
      comments: Math.floor(Math.random() * 70) + 12,
      timestamp: new Date(article.publishedAt),
      category: 'business',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI Business unavailable');
    return [];
  }
};

const fetchNewsDataIOBusiness = async () => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&category=business`
    );
    return response.data.results.slice(0, 8).map((article, index) => ({
      id: `business_newsdata_${Date.now()}_${index}`,
      user: { 
        name: article.source_id, 
        username: article.source_id, 
        avatar: getCategoryAvatar('business') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.image_url || getRandomImage('business', index),
      likes: Math.floor(Math.random() * 850) + 140,
      comments: Math.floor(Math.random() * 65) + 10,
      timestamp: new Date(article.pubDate),
      category: 'business',
      source: article.source_id,
      url: article.link,
      liked: false
    }));
  } catch (error) {
    console.log('NewsData.io Business unavailable');
    return [];
  }
};

const fetchGuardianBusiness = async () => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/business?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=8`
    );
    return response.data.response.results.map((article, index) => ({
      id: `business_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian_business', 
        avatar: 'https://images.unsplash.com/photo-1664575198263-269a022d6f14?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('business', index),
      likes: Math.floor(Math.random() * 800) + 120,
      comments: Math.floor(Math.random() * 60) + 10,
      timestamp: new Date(article.webPublicationDate),
      category: 'business',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian Business unavailable');
    return [];
  }
};

const fetchForbesRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.forbes.com/business/feed/'
    );
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `business_forbes_${Date.now()}_${index}`,
      user: { 
        name: 'Forbes', 
        username: 'forbes', 
        avatar: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('business', index),
      likes: Math.floor(Math.random() * 950) + 160,
      comments: Math.floor(Math.random() * 75) + 13,
      timestamp: new Date(item.pubDate),
      category: 'business',
      source: 'Forbes',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Forbes RSS unavailable');
    return [];
  }
};

const fetchBloombergRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.bloomberg.com/feed/podcast/etf-report.xml'
    );
    return response.data.items.slice(0, 6).map((item, index) => ({
      id: `business_bloomberg_${Date.now()}_${index}`,
      user: { 
        name: 'Bloomberg', 
        username: 'bloomberg', 
        avatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('business', index),
      likes: Math.floor(Math.random() * 900) + 155,
      comments: Math.floor(Math.random() * 72) + 12,
      timestamp: new Date(item.pubDate),
      category: 'business',
      source: 'Bloomberg',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Bloomberg RSS unavailable');
    return [];
  }
};

// ============= ENTERTAINMENT NEWS =============
export const fetchEnhancedEntertainmentNews = async () => {
  const sources = [
    fetchNewsAPIEntertainment(), 
    fetchNewsDataIOEntertainment(), 
    fetchGuardianEntertainment(),
    fetchVarietyRSS(),
    fetchHollywoodReporterRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ Entertainment news: ${allNews.length} articles`);
    return allNews.slice(0, 15);
  } catch (error) {
    console.error('Entertainment news error:', error);
    return [];
  }
};

const fetchNewsAPIEntertainment = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=entertainment&country=us&pageSize=8&apiKey=${NEWS_API_KEY}`
    );
    return response.data.articles.map((article, index) => ({
      id: `entertainment_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'entertainment', 
        avatar: getCategoryAvatar('entertainment') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('entertainment', index),
      likes: Math.floor(Math.random() * 2000) + 300,
      comments: Math.floor(Math.random() * 150) + 25,
      timestamp: new Date(article.publishedAt),
      category: 'entertainment',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI Entertainment unavailable');
    return [];
  }
};

const fetchNewsDataIOEntertainment = async () => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&category=entertainment`
    );
    return response.data.results.slice(0, 6).map((article, index) => ({
      id: `entertainment_newsdata_${Date.now()}_${index}`,
      user: { 
        name: article.source_id, 
        username: article.source_id, 
        avatar: getCategoryAvatar('entertainment') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.image_url || getRandomImage('entertainment', index),
      likes: Math.floor(Math.random() * 1800) + 250,
      comments: Math.floor(Math.random() * 130) + 22,
      timestamp: new Date(article.pubDate),
      category: 'entertainment',
      source: article.source_id,
      url: article.link,
      liked: false
    }));
  } catch (error) {
    console.log('NewsData.io Entertainment unavailable');
    return [];
  }
};

const fetchGuardianEntertainment = async () => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/culture?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=6`
    );
    return response.data.response.results.map((article, index) => ({
      id: `entertainment_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian_entertainment', 
        avatar: 'https://images.unsplash.com/photo-1489599809505-7c7f6b4bf809?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('entertainment', index),
      likes: Math.floor(Math.random() * 1600) + 220,
      comments: Math.floor(Math.random() * 120) + 20,
      timestamp: new Date(article.webPublicationDate),
      category: 'entertainment',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian Entertainment unavailable');
    return [];
  }
};

const fetchVarietyRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://variety.com/feed/'
    );
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `entertainment_variety_${Date.now()}_${index}`,
      user: { 
        name: 'Variety', 
        username: 'variety', 
        avatar: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('entertainment', index),
      likes: Math.floor(Math.random() * 1700) + 260,
      comments: Math.floor(Math.random() * 135) + 23,
      timestamp: new Date(item.pubDate),
      category: 'entertainment',
      source: 'Variety',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Variety RSS unavailable');
    return [];
  }
};

const fetchHollywoodReporterRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.hollywoodreporter.com/feed/'
    );
    return response.data.items.slice(0, 6).map((item, index) => ({
      id: `entertainment_thr_${Date.now()}_${index}`,
      user: { 
        name: 'Hollywood Reporter', 
        username: 'thr', 
        avatar: 'https://images.unsplash.com/photo-1574267432644-f610f5e09b6b?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('entertainment', index),
      likes: Math.floor(Math.random() * 1650) + 240,
      comments: Math.floor(Math.random() * 128) + 21,
      timestamp: new Date(item.pubDate),
      category: 'entertainment',
      source: 'Hollywood Reporter',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Hollywood Reporter RSS unavailable');
    return [];
  }
};

// ============= HEALTH NEWS =============
export const fetchEnhancedHealthNews = async () => {
  const sources = [
    fetchNewsAPIHealth(), 
    fetchNewsDataIOHealth(), 
    fetchGuardianHealth(),
    fetchWebMDRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ Health news: ${allNews.length} articles`);
    return allNews.slice(0, 12);
  } catch (error) {
    console.error('Health news error:', error);
    return [];
  }
};

const fetchNewsAPIHealth = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=health&country=us&pageSize=6&apiKey=${NEWS_API_KEY}`
    );
    return response.data.articles.map((article, index) => ({
      id: `health_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'health_news', 
        avatar: getCategoryAvatar('health') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('health', index),
      likes: Math.floor(Math.random() * 800) + 120,
      comments: Math.floor(Math.random() * 60) + 10,
      timestamp: new Date(article.publishedAt),
      category: 'health',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI Health unavailable');
    return [];
  }
};

const fetchNewsDataIOHealth = async () => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&category=health`
    );
    return response.data.results.slice(0, 6).map((article, index) => ({
      id: `health_newsdata_${Date.now()}_${index}`,
      user: { 
        name: article.source_id, 
        username: article.source_id, 
        avatar: getCategoryAvatar('health') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.image_url || getRandomImage('health', index),
      likes: Math.floor(Math.random() * 700) + 100,
      comments: Math.floor(Math.random() * 50) + 8,
      timestamp: new Date(article.pubDate),
      category: 'health',
      source: article.source_id,
      url: article.link,
      liked: false
    }));
  } catch (error) {
    console.log('NewsData.io Health unavailable');
    return [];
  }
};

const fetchGuardianHealth = async () => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/society/health?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=6`
    );
    return response.data.response.results.map((article, index) => ({
      id: `health_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian_health', 
        avatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('health', index),
      likes: Math.floor(Math.random() * 650) + 90,
      comments: Math.floor(Math.random() * 45) + 7,
      timestamp: new Date(article.webPublicationDate),
      category: 'health',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian Health unavailable');
    return [];
  }
};

const fetchWebMDRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC'
    );
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `health_webmd_${Date.now()}_${index}`,
      user: { 
        name: 'WebMD', 
        username: 'webmd', 
        avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('health', index),
      likes: Math.floor(Math.random() * 750) + 110,
      comments: Math.floor(Math.random() * 55) + 9,
      timestamp: new Date(item.pubDate),
      category: 'health',
      source: 'WebMD',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('WebMD RSS unavailable');
    return [];
  }
};

// ============= SCIENCE NEWS =============
export const fetchEnhancedScienceNews = async () => {
  const sources = [
    fetchNewsAPIScience(), 
    fetchGuardianScience(),
    fetchScienceDailyRSS(),
    fetchNatureRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ Science news: ${allNews.length} articles`);
    return allNews.slice(0, 12);
  } catch (error) {
    console.error('Science news error:', error);
    return [];
  }
};

const fetchNewsAPIScience = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=science&country=us&pageSize=6&apiKey=${NEWS_API_KEY}`
    );
    return response.data.articles.map((article, index) => ({
      id: `science_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'science_news', 
        avatar: getCategoryAvatar('science') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('science', index),
      likes: Math.floor(Math.random() * 700) + 100,
      comments: Math.floor(Math.random() * 50) + 8,
      timestamp: new Date(article.publishedAt),
      category: 'science',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI Science unavailable');
    return [];
  }
};

const fetchGuardianScience = async () => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/science?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=6`
    );
    return response.data.response.results.map((article, index) => ({
      id: `science_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian_science', 
        avatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('science', index),
      likes: Math.floor(Math.random() * 600) + 80,
      comments: Math.floor(Math.random() * 40) + 6,
      timestamp: new Date(article.webPublicationDate),
      category: 'science',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian Science unavailable');
    return [];
  }
};

const fetchScienceDailyRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/all.xml'
    );
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `science_daily_${Date.now()}_${index}`,
      user: { 
        name: 'Science Daily', 
        username: 'sciencedaily', 
        avatar: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('science', index),
      likes: Math.floor(Math.random() * 680) + 95,
      comments: Math.floor(Math.random() * 48) + 7,
      timestamp: new Date(item.pubDate),
      category: 'science',
      source: 'Science Daily',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Science Daily RSS unavailable');
    return [];
  }
};

const fetchNatureRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.nature.com/nature.rss'
    );
    return response.data.items.slice(0, 6).map((item, index) => ({
      id: `science_nature_${Date.now()}_${index}`,
      user: { 
        name: 'Nature', 
        username: 'nature', 
        avatar: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('science', index),
      likes: Math.floor(Math.random() * 720) + 105,
      comments: Math.floor(Math.random() * 52) + 8,
      timestamp: new Date(item.pubDate),
      category: 'science',
      source: 'Nature',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Nature RSS unavailable');
    return [];
  }
};

// ============= WORLD NEWS =============
export const fetchEnhancedWorldNews = async () => {
  const sources = [
    fetchNewsAPIWorld(), 
    fetchNewsDataIOWorld(), 
    fetchGuardianWorld(),
    fetchAlJazeeraRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ World news: ${allNews.length} articles`);
    return allNews.slice(0, 15);
  } catch (error) {
    console.error('World news error:', error);
    return [];
  }
};

const fetchNewsAPIWorld = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=8&apiKey=${NEWS_API_KEY}`
    );
    return response.data.articles.map((article, index) => ({
      id: `world_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'world_news', 
        avatar: getCategoryAvatar('world') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('world', index),
      likes: Math.floor(Math.random() * 900) + 150,
      comments: Math.floor(Math.random() * 70) + 12,
      timestamp: new Date(article.publishedAt),
      category: 'world',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI World unavailable');
    return [];
  }
};

const fetchNewsDataIOWorld = async () => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&language=en&category=world`
    );
    return response.data.results.slice(0, 8).map((article, index) => ({
      id: `world_newsdata_${Date.now()}_${index}`,
      user: { 
        name: article.source_id, 
        username: article.source_id, 
        avatar: getCategoryAvatar('world') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.image_url || getRandomImage('world', index),
      likes: Math.floor(Math.random() * 850) + 130,
      comments: Math.floor(Math.random() * 65) + 11,
      timestamp: new Date(article.pubDate),
      category: 'world',
      source: article.source_id,
      url: article.link,
      liked: false
    }));
  } catch (error) {
    console.log('NewsData.io World unavailable');
    return [];
  }
};

const fetchGuardianWorld = async () => {
  try {
    const response = await axios.get(
      `https://content.guardianapis.com/world?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=8`
    );
    return response.data.response.results.map((article, index) => ({
      id: `world_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian_world', 
        avatar: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('world', index),
      likes: Math.floor(Math.random() * 800) + 120,
      comments: Math.floor(Math.random() * 60) + 10,
      timestamp: new Date(article.webPublicationDate),
      category: 'world',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian World unavailable');
    return [];
  }
};

const fetchAlJazeeraRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml'
    );
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `world_aljazeera_${Date.now()}_${index}`,
      user: { 
        name: 'Al Jazeera', 
        username: 'aljazeera', 
        avatar: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('world', index),
      likes: Math.floor(Math.random() * 870) + 135,
      comments: Math.floor(Math.random() * 67) + 11,
      timestamp: new Date(item.pubDate),
      category: 'world',
      source: 'Al Jazeera',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Al Jazeera RSS unavailable');
    return [];
  }
};

// ============= TECH NEWS =============
export const fetchEnhancedTechNews = async () => {
  const sources = [
    fetchNewsAPITech(), 
    fetchHackerNews(), 
    fetchTechCrunchRSS(), 
    fetchGuardianTech(),
    fetchTheVergeRSS(),
    fetchWiredRSS(),
    fetchArsTechnicaRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ Tech news: ${allNews.length} articles`);
    return allNews.slice(0, 30);
  } catch (error) {
    console.error('Tech news error:', error);
    return [];
  }
};

const fetchNewsAPITech = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    return response.data.articles.map((article, index) => ({
      id: `tech_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'tech_news', 
        avatar: TECH_AVATARS[article.source.name] || TECH_AVATARS.default_tech
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('tech', index),
      likes: Math.floor(Math.random() * 800) + 200,
      comments: Math.floor(Math.random() * 100) + 20,
      timestamp: new Date(article.publishedAt),
      category: 'tech',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI Tech unavailable');
    return [];
  }
};

const fetchHackerNews = async () => {
  try {
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = topStoriesRes.data.slice(0, 12);
    const stories = await Promise.all(storyIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
    return stories.map(res => ({
      id: `tech_hn_${res.data.id}`,
      user: { 
        name: 'Hacker News', 
        username: res.data.by, 
        avatar: TECH_AVATARS['Hacker News']
      },
      text: res.data.title,
      content: res.data.title,
      image: getRandomImage('tech', res.data.id),
      likes: res.data.score || 0,
      comments: res.data.descendants || 0,
      timestamp: new Date(res.data.time * 1000),
      category: 'tech',
      source: 'Hacker News',
      url: res.data.url || `https://news.ycombinator.com/item?id=${res.data.id}`,
      liked: false
    }));
  } catch (error) {
    console.log('Hacker News unavailable');
    return [];
  }
};

const fetchTechCrunchRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/');
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `tech_tc_${Date.now()}_${index}`,
      user: { 
        name: 'TechCrunch', 
        username: 'techcrunch', 
        avatar: TECH_AVATARS['TechCrunch'] || TECH_AVATARS.default_tech
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('tech', index),
      likes: Math.floor(Math.random() * 600) + 150,
      comments: Math.floor(Math.random() * 80) + 15,
      timestamp: new Date(item.pubDate),
      category: 'tech',
      source: 'TechCrunch',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('TechCrunch RSS unavailable');
    return [];
  }
};

const fetchGuardianTech = async () => {
  try {
    const response = await axios.get(`https://content.guardianapis.com/technology?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=10`);
    return response.data.response.results.map((article, index) => ({
      id: `tech_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian_tech', 
        avatar: TECH_AVATARS['The Guardian']
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('tech', index),
      likes: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date(article.webPublicationDate),
      category: 'tech',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian Tech unavailable');
    return [];
  }
};

const fetchTheVergeRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.theverge.com/rss/index.xml');
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `tech_verge_${Date.now()}_${index}`,
      user: { 
        name: 'The Verge', 
        username: 'verge', 
        avatar: TECH_AVATARS['The Verge']
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('tech', index),
      likes: Math.floor(Math.random() * 750) + 180,
      comments: Math.floor(Math.random() * 90) + 17,
      timestamp: new Date(item.pubDate),
      category: 'tech',
      source: 'The Verge',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('The Verge RSS unavailable');
    return [];
  }
};

const fetchWiredRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.wired.com/feed/rss');
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `tech_wired_${Date.now()}_${index}`,
      user: { 
        name: 'Wired', 
        username: 'wired', 
        avatar: TECH_AVATARS['Wired']
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('tech', index),
      likes: Math.floor(Math.random() * 700) + 170,
      comments: Math.floor(Math.random() * 85) + 16,
      timestamp: new Date(item.pubDate),
      category: 'tech',
      source: 'Wired',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Wired RSS unavailable');
    return [];
  }
};

const fetchArsTechnicaRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.arstechnica.com/arstechnica/index');
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `tech_ars_${Date.now()}_${index}`,
      user: { 
        name: 'Ars Technica', 
        username: 'arstechnica', 
        avatar: TECH_AVATARS['Ars Technica']
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('tech', index),
      likes: Math.floor(Math.random() * 650) + 160,
      comments: Math.floor(Math.random() * 75) + 14,
      timestamp: new Date(item.pubDate),
      category: 'tech',
      source: 'Ars Technica',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Ars Technica RSS unavailable');
    return [];
  }
};

// ============= SPORTS NEWS =============
export const fetchEnhancedSportsNews = async () => {
  const sources = [
    fetchNewsAPISports(), 
    fetchESPNNews(), 
    fetchBBCSports(), 
    fetchGuardianSports(), 
    fetchSkySportsRSS(),
    fetchBleacherReportRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ Sports news: ${allNews.length} articles`);
    return allNews.slice(0, 30);
  } catch (error) {
    console.error('Sports news error:', error);
    return [];
  }
};

const fetchNewsAPISports = async () => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=12&apiKey=${NEWS_API_KEY}`);
    return response.data.articles.map((article, index) => ({
      id: `sports_newsapi_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'sports_news', 
        avatar: getCategoryAvatar('sports') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('sports', index),
      likes: Math.floor(Math.random() * 2000) + 300,
      comments: Math.floor(Math.random() * 150) + 30,
      timestamp: new Date(article.publishedAt),
      category: 'sports',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('NewsAPI Sports unavailable');
    return [];
  }
};

const fetchSkySportsRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.skysports.com/rss/12040');
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `sports_sky_${Date.now()}_${index}`,
      user: { 
        name: 'Sky Sports', 
        username: 'skysports', 
        avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('sports', index),
      likes: Math.floor(Math.random() * 1500) + 250,
      comments: Math.floor(Math.random() * 120) + 25,
      timestamp: new Date(item.pubDate),
      category: 'sports',
      source: 'Sky Sports',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Sky Sports RSS unavailable');
    return [];
  }
};

const fetchESPNNews = async () => {
  try {
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news');
    return response.data.articles.slice(0, 10).map((article, index) => ({
      id: `sports_espn_${article.id || Date.now() + index}`,
      user: { 
        name: 'ESPN', 
        username: 'espn', 
        avatar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&h=100&fit=crop'
      },
      text: article.headline,
      content: article.description || article.headline,
      image: article.images?.[0]?.url || getRandomImage('sports', index),
      likes: Math.floor(Math.random() * 1800) + 300,
      comments: Math.floor(Math.random() * 140) + 30,
      timestamp: new Date(article.published),
      category: 'sports',
      source: 'ESPN',
      url: article.links?.web?.href || '#',
      liked: false
    }));
  } catch (error) {
    console.log('ESPN News unavailable');
    return [];
  }
};

const fetchBBCSports = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/sport/rss.xml');
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `sports_bbc_${Date.now()}_${index}`,
      user: { 
        name: 'BBC Sport', 
        username: 'bbcsport', 
        avatar: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || getRandomImage('sports', index),
      likes: Math.floor(Math.random() * 1600) + 280,
      comments: Math.floor(Math.random() * 130) + 28,
      timestamp: new Date(item.pubDate),
      category: 'sports',
      source: 'BBC Sport',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('BBC Sports unavailable');
    return [];
  }
};

const fetchGuardianSports = async () => {
  try {
    const response = await axios.get(`https://content.guardianapis.com/sport/football?show-fields=thumbnail,trailText&api-key=${GUARDIAN_API_KEY}&page-size=12`);
    return response.data.response.results.map((article, index) => ({
      id: `sports_guard_${article.id}`,
      user: { 
        name: 'The Guardian', 
        username: 'guardian_sports', 
        avatar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || getRandomImage('sports', index),
      likes: Math.floor(Math.random() * 1400) + 250,
      comments: Math.floor(Math.random() * 110) + 25,
      timestamp: new Date(article.webPublicationDate),
      category: 'sports',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.log('Guardian Sports unavailable');
    return [];
  }
};

const fetchBleacherReportRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://bleacherreport.com/articles/feed');
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `sports_br_${Date.now()}_${index}`,
      user: { 
        name: 'Bleacher Report', 
        username: 'bleacherreport', 
        avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('sports', index),
      likes: Math.floor(Math.random() * 1700) + 270,
      comments: Math.floor(Math.random() * 135) + 27,
      timestamp: new Date(item.pubDate),
      category: 'sports',
      source: 'Bleacher Report',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Bleacher Report RSS unavailable');
    return [];
  }
};

// ============= CRYPTO NEWS =============
export const fetchEnhancedCryptoNews = async () => {
  const sources = [
    fetchCoinTelegraph(), 
    fetchCoinDeskRSS(), 
    fetchCryptoPanicNews(), 
    fetchCryptoNewsAPI(), 
    fetchRedditCrypto(),
    fetchDecryptRSS()
  ];
  try {
    const results = await Promise.allSettled(sources);
    const allNews = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    console.log(`✅ Crypto news: ${allNews.length} articles`);
    return allNews.slice(0, 25);
  } catch (error) {
    console.error('Crypto news error:', error);
    return [];
  }
};

const fetchCoinTelegraph = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss');
    const prices = await fetchCryptoPrices();
    return response.data.items.slice(0, 10).map((item, index) => {
      const coin = prices[index % prices.length];
      return {
        id: `crypto_ct_${Date.now()}_${index}`,
        user: { 
          name: 'Cointelegraph', 
          username: 'cointelegraph', 
          avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop'
        },
        text: `${item.title}\n\n${coin.emoji} ${coin.name}: ${coin.price.toLocaleString()} (${coin.change > 0 ? '+' : ''}${coin.change.toFixed(2)}%)`,
        content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
        image: item.thumbnail || coin.image,
        likes: Math.floor(Math.random() * 900) + 150,
        comments: Math.floor(Math.random() * 120) + 20,
        timestamp: new Date(item.pubDate),
        category: 'crypto',
        source: 'Cointelegraph',
        url: item.link,
        liked: false
      };
    });
  } catch (error) {
    console.log('CoinTelegraph unavailable');
    return [];
  }
};

const fetchCoinDeskRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.coindesk.com/arc/outboundfeeds/rss/');
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `crypto_cd_${Date.now()}_${index}`,
      user: { 
        name: 'CoinDesk', 
        username: 'coindesk', 
        avatar: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('crypto', index),
      likes: Math.floor(Math.random() * 850) + 140,
      comments: Math.floor(Math.random() * 110) + 18,
      timestamp: new Date(item.pubDate),
      category: 'crypto',
      source: 'CoinDesk',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('CoinDesk RSS unavailable');
    return [];
  }
};

const fetchCryptoPanicNews = async () => {
  try {
    const response = await axios.get(
      'https://cryptopanic.com/api/v1/posts/?auth_token=free&public=true'
    );
    
    return response.data.results.slice(0, 10).map((item, index) => ({
      id: `crypto_cp_${item.id}`,
      user: {
        name: item.source.title,
        username: item.source.domain,
        avatar: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.title,
      image: getRandomImage('crypto', index),
      likes: item.votes.positive || Math.floor(Math.random() * 700) + 120,
      comments: Math.floor(Math.random() * 90) + 15,
      timestamp: new Date(item.published_at),
      category: 'crypto',
      source: item.source.title,
      url: item.url,
      liked: false
    }));
  } catch (error) {
    console.log('CryptoPanic unavailable');
    return [];
  }
};

const fetchCryptoNewsAPI = async () => {
  try {
    const response = await axios.get('https://cryptonews-api.com/api/v1?tickers=BTC,ETH,BNB,XRP&items=10&token=demo');
    return response.data.data.slice(0, 8).map((item, index) => ({
      id: `crypto_cna_${Date.now()}_${index}`,
      user: { 
        name: item.news_url.split('/')[2], 
        username: 'crypto_news', 
        avatar: 'https://images.unsplash.com/photo-1640826514546-7d2f1b7e5ecd?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.text || item.title,
      image: item.image_url || getRandomImage('crypto', index),
      likes: Math.floor(Math.random() * 800) + 130,
      comments: Math.floor(Math.random() * 100) + 17,
      timestamp: new Date(item.date),
      category: 'crypto',
      source: 'Crypto News',
      url: item.news_url,
      liked: false
    }));
  } catch (error) {
    console.log('Crypto News API unavailable');
    return [];
  }
};

const fetchRedditCrypto = async () => {
  try {
    const redditResponse = await axios.get('https://www.reddit.com/r/CryptoCurrency/hot.json?limit=12');
    const prices = await fetchCryptoPrices();
    return redditResponse.data.data.children.slice(0, 10).map((item, index) => {
      const coin = prices[index % prices.length];
      return {
        id: `crypto_reddit_${item.data.id}`,
        user: { 
          name: item.data.author, 
          username: `u/${item.data.author}`, 
          avatar: `https://i.pravatar.cc/150?u=${item.data.author}` 
        },
        text: `${item.data.title}\n\n${coin.emoji} ${coin.name}: ${coin.price.toLocaleString()} (${coin.change > 0 ? '+' : ''}${coin.change.toFixed(2)}%)`,
        content: item.data.selftext || item.data.title,
        image: (item.data.thumbnail && item.data.thumbnail !== 'self' && item.data.thumbnail !== 'default') ? item.data.thumbnail : coin.image,
        likes: item.data.ups,
        comments: item.data.num_comments,
        timestamp: new Date(item.data.created_utc * 1000),
        category: 'crypto',
        source: 'r/CryptoCurrency',
        url: `https://reddit.com${item.data.permalink}`,
        liked: false
      };
    });
  } catch (error) {
    console.log('Reddit Crypto unavailable');
    return [];
  }
};

const fetchDecryptRSS = async () => {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://decrypt.co/feed');
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `crypto_decrypt_${Date.now()}_${index}`,
      user: { 
        name: 'Decrypt', 
        username: 'decrypt', 
        avatar: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || getRandomImage('crypto', index),
      likes: Math.floor(Math.random() * 780) + 125,
      comments: Math.floor(Math.random() * 95) + 16,
      timestamp: new Date(item.pubDate),
      category: 'crypto',
      source: 'Decrypt',
      url: item.link,
      liked: false
    }));
  } catch (error) {
    console.log('Decrypt RSS unavailable');
    return [];
  }
};

const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false');
    return response.data.map(coin => ({
      name: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change: coin.price_change_percentage_24h || 0,
      emoji: (coin.price_change_percentage_24h || 0) > 0 ? '🟢' : '🔴',
      image: coin.image
    }));
  } catch (error) {
    console.log('Crypto prices unavailable');
    return [
      { name: 'BTC', price: 45000, change: 2.5, emoji: '🟢', image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100' },
      { name: 'ETH', price: 2800, change: 3.2, emoji: '🟢', image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=100' }
    ];
  }
};

// ============= HELPER FUNCTIONS =============
const getCategoryAvatar = (category) => {
  const avatars = {
    general: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop',
    tech: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop',
    business: 'https://images.unsplash.com/photo-1664575198263-269a022d6f14?w=100&h=100&fit=crop',
    entertainment: 'https://images.unsplash.com/photo-1489599809505-7c7f6b4bf809?w=100&h=100&fit=crop',
    health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop',
    world: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=100&h=100&fit=crop',
    crypto: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop'
  };
  return avatars[category] || avatars.general;
};

const getRandomImage = (category, index) => {
  const baseUrl = 'https://picsum.photos/seed';
  return `${baseUrl}/${category}${index}/600/400`;
};

// ============= COMMENTS & ADDITIONAL FUNCTIONS =============
export const fetchRealComments = async (postId) => {
  try {
    if (postId.includes('crypto_reddit_') || postId.includes('reddit')) {
      const redditId = postId.replace('crypto_reddit_', '').replace('reddit_', '');
      try {
        const response = await axios.get(`https://www.reddit.com/comments/${redditId}.json?limit=25`);
        if (response.data?.[1]?.data?.children) {
          const comments = response.data[1].data.children
            .filter(c => c.kind === 't1' && c.data.body)
            .slice(0, 20)
            .map(comment => ({
              id: `comment_${comment.data.id}`,
              user: { 
                name: comment.data.author, 
                username: `u/${comment.data.author}`, 
                avatar: `https://i.pravatar.cc/150?u=${comment.data.author}` 
              },
              text: comment.data.body,
              likes: comment.data.ups,
              timestamp: new Date(comment.data.created_utc * 1000),
              isLiked: false
            }));
          if (comments.length > 0) return comments;
        }
      } catch (e) {
        console.log('Reddit comments unavailable');
      }
    }
    return generateRealisticComments(postId);
  } catch (error) {
    return generateRealisticComments(postId);
  }
};

const generateRealisticComments = (postId = '') => {
  const commentTemplates = {
    tech: ["This is incredible! The architecture looks really well thought out.", "Been waiting for this release for months. Exceeds expectations! 🚀"],
    sports: ["What an absolute masterclass! Best match this season! 🔥", "That finish was pure class. World-class talent!"],
    crypto: ["Market sentiment shifting bullish. Good signs! 📈", "This tech could revolutionize finance completely."],
    general: ["Thanks for sharing this important update!", "This is exactly what we needed to hear."],
    business: ["The market response to this news has been incredible!", "This could really disrupt the entire industry."],
    entertainment: ["Absolutely loved this! Can't wait for more! 🎬", "The casting was absolutely perfect for this role!"],
    health: ["This research could save countless lives!", "Important breakthrough in medical science!"],
    science: ["Fascinating discovery! The implications are huge.", "The methodology here is really innovative."],
    world: ["This development has global significance.", "Important diplomatic breakthrough here."]
  };
  
  let category = 'general';
  if (postId.includes('tech')) category = 'tech';
  else if (postId.includes('sports')) category = 'sports';
  else if (postId.includes('crypto')) category = 'crypto';
  else if (postId.includes('business')) category = 'business';
  else if (postId.includes('entertainment')) category = 'entertainment';
  else if (postId.includes('health')) category = 'health';
  else if (postId.includes('science')) category = 'science';
  else if (postId.includes('world')) category = 'world';
  
  const templates = commentTemplates[category] || commentTemplates.general;
  const numComments = 8 + Math.floor(Math.random() * 9);
  const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'Chris', 'Lisa', 'David', 'Nina', 'James', 'Sofia'];
  
  return Array.from({ length: numComments }, (_, index) => ({
    id: `comment_${Date.now()}_${index}`,
    user: { 
      name: `${names[index % names.length]}${Math.floor(Math.random() * 100)}`, 
      username: `user_${Math.floor(Math.random() * 10000)}`, 
      avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}` 
    },
    text: templates[Math.floor(Math.random() * templates.length)],
    likes: Math.floor(Math.random() * 200) + 1,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    isLiked: false
  }));
};

export const fetchNewsByCategory = async (category) => {
  try {
    switch (category) {
      case 'tech': return await fetchEnhancedTechNews();
      case 'sports': return await fetchEnhancedSportsNews();
      case 'crypto': return await fetchEnhancedCryptoNews();
      case 'business': return await fetchEnhancedBusinessNews();
      case 'entertainment': return await fetchEnhancedEntertainmentNews();
      case 'health': return await fetchEnhancedHealthNews();
      case 'science': return await fetchEnhancedScienceNews();
      case 'world': return await fetchEnhancedWorldNews();
      case 'general': return await fetchEnhancedGeneralNews();
      default: return await fetchEnhancedGeneralNews();
    }
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
};

export const fetchTrendingNews = async () => {
  try {
    const allNews = await fetchAllNewsFeed();
    return allNews
      .sort((a, b) => {
        const aEngagement = a.likes + (a.comments * 2);
        const bEngagement = b.likes + (b.comments * 2);
        return bEngagement - aEngagement;
      })
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
};

export const searchNews = async (query, category = null) => {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`;
    const response = await axios.get(url);
    return response.data.articles.map((article, index) => ({
      id: `search_${Date.now()}_${index}`,
      user: { 
        name: article.source.name, 
        username: article.source.id || 'news_source', 
        avatar: getCategoryAvatar(category || 'general') 
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || getRandomImage('search', index),
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 40) + 5,
      timestamp: new Date(article.publishedAt),
      category: category || 'general',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};

// ============= EXPORTS =============
export default {
  fetchAllNewsFeed,
  fetchEnhancedGeneralNews,
  fetchEnhancedTechNews,
  fetchEnhancedSportsNews,
  fetchEnhancedBusinessNews,
  fetchEnhancedEntertainmentNews,
  fetchEnhancedHealthNews,
  fetchEnhancedScienceNews,
  fetchEnhancedWorldNews,
  fetchEnhancedCryptoNews,
  fetchNewsByCategory,
  fetchTrendingNews,
  searchNews,
  fetchRealComments,
  fetchRealTechNews: fetchEnhancedTechNews,
  fetchRealSportsNews: fetchEnhancedSportsNews,
  fetchRealCryptoNews: fetchEnhancedCryptoNews
};