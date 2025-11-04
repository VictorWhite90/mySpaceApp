import axios from 'axios';

// ============= CONFIGURATION =============
const NEWS_API_KEY = 'dd2d0304768e433cb56b0f057408a8bc'; 
const NEWSDATA_API_KEY = 'pub_56d37a31446d43ed87b434c31f3d824d'; 

// ============= FETCH ALL NEWS FEED (Enhanced) =============
export const fetchAllNewsFeed = async () => {
  try {
    const [techNews, sportsNews, cryptoNews, generalNews] = await Promise.all([
      fetchEnhancedTechNews(),
      fetchEnhancedSportsNews(),
      fetchEnhancedCryptoNews(),
      fetchGeneralNews()
    ]);

    // Combine and shuffle all posts
    const allPosts = [...techNews, ...sportsNews, ...cryptoNews, ...generalNews]
      .sort(() => Math.random() - 0.5)
      .slice(0, 60); // Increased to 60 posts

    return allPosts;
  } catch (error) {
    console.error('Error fetching all news feed:', error);
    return getFallbackNews();
  }
};

// ============= ENHANCED TECH NEWS (Multiple Sources) =============
export const fetchEnhancedTechNews = async () => {
  const sources = [
    fetchNewsAPITech(),
    fetchHackerNews(),
    fetchTechCrunchRSS(),
    fetchGuardianTech()
  ];

  try {
    const results = await Promise.allSettled(sources);
    const allNews = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);
    
    return allNews.slice(0, 20);
  } catch (error) {
    console.error('Tech news error:', error);
    return getFallbackTechNews();
  }
};

// NewsAPI.org - Tech News
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
        avatar: article.urlToImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop'
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || `https://picsum.photos/seed/tech${index}/600/400`,
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

// Hacker News (YCombinator)
const fetchHackerNews = async () => {
  try {
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = topStoriesRes.data.slice(0, 10);
    
    const stories = await Promise.all(
      storyIds.map(id => 
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      )
    );
    
    return stories.map(res => ({
      id: `tech_hn_${res.data.id}`,
      user: {
        name: 'Hacker News',
        username: res.data.by,
        avatar: 'https://news.ycombinator.com/y18.svg'
      },
      text: res.data.title,
      content: res.data.title,
      image: `https://picsum.photos/seed/hn${res.data.id}/600/400`,
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

// TechCrunch via RSS
const fetchTechCrunchRSS = async () => {
  try {
    // Using RSS2JSON service (free, no key needed)
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://techcrunch.com/feed/'
    );
    
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `tech_tc_${Date.now()}_${index}`,
      user: {
        name: 'TechCrunch',
        username: 'techcrunch',
        avatar: 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || `https://picsum.photos/seed/tc${index}/600/400`,
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

// Guardian Tech (existing)
const fetchGuardianTech = async () => {
  try {
    const response = await axios.get(
      'https://content.guardianapis.com/technology?show-fields=thumbnail,trailText&api-key=test&page-size=8'
    );
    
    return response.data.response.results.map((article, index) => ({
      id: `tech_guard_${article.id}`,
      user: {
        name: 'The Guardian',
        username: 'guardian_tech',
        avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || `https://picsum.photos/seed/gtech${index}/600/400`,
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

// ============= ENHANCED SPORTS NEWS (Multiple Sources) =============
export const fetchEnhancedSportsNews = async () => {
  const sources = [
    fetchNewsAPISports(),
    fetchESPNNews(),
    fetchBBCSports(),
    fetchGuardianSports(),
    fetchSkySportsRSS()
  ];

  try {
    const results = await Promise.allSettled(sources);
    const allNews = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);
    
    return allNews.slice(0, 25);
  } catch (error) {
    console.error('Sports news error:', error);
    return getFallbackSportsNews();
  }
};

// NewsAPI.org - Sports News
const fetchNewsAPISports = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=12&apiKey=${NEWS_API_KEY}`
    );
    
    return response.data.articles.map((article, index) => ({
      id: `sports_newsapi_${Date.now()}_${index}`,
      user: {
        name: article.source.name,
        username: article.source.id || 'sports_news',
        avatar: article.urlToImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop'
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || `https://picsum.photos/seed/sport${index}/600/400`,
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

// Sky Sports RSS
const fetchSkySportsRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.skysports.com/rss/12040'
    );
    
    return response.data.items.slice(0, 10).map((item, index) => ({
      id: `sports_sky_${Date.now()}_${index}`,
      user: {
        name: 'Sky Sports',
        username: 'skysports',
        avatar: 'https://images.unsplash.com/photo-1543326627-abf0b1a1e998?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || `https://picsum.photos/seed/sky${index}/600/400`,
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

// ESPN News
const fetchESPNNews = async () => {
  try {
    const response = await axios.get(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news'
    );
    
    return response.data.articles.slice(0, 8).map((article, index) => ({
      id: `sports_espn_${article.id || Date.now() + index}`,
      user: {
        name: 'ESPN',
        username: 'espn',
        avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'
      },
      text: article.headline,
      content: article.description || article.headline,
      image: article.images?.[0]?.url || `https://picsum.photos/seed/espn${index}/600/400`,
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

// BBC Sports RSS
const fetchBBCSports = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/sport/rss.xml'
    );
    
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `sports_bbc_${Date.now()}_${index}`,
      user: {
        name: 'BBC Sport',
        username: 'bbcsport',
        avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || `https://picsum.photos/seed/bbc${index}/600/400`,
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

// Guardian Sports (existing)
const fetchGuardianSports = async () => {
  try {
    const response = await axios.get(
      'https://content.guardianapis.com/sport/football?show-fields=thumbnail,trailText&api-key=test&page-size=10'
    );
    
    return response.data.response.results.map((article, index) => ({
      id: `sports_guard_${article.id}`,
      user: {
        name: 'The Guardian',
        username: 'guardian_sports',
        avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || `https://picsum.photos/seed/gsport${index}/600/400`,
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

// ============= ENHANCED CRYPTO NEWS (Multiple Sources) =============
export const fetchEnhancedCryptoNews = async () => {
  const sources = [
    fetchCoinTelegraph(),
    fetchCoinDeskRSS(),
    fetchCryptoPanicNews(),
    fetchCryptoNewsAPI(),
    fetchRedditCrypto()
  ];

  try {
    const results = await Promise.allSettled(sources);
    const allNews = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);
    
    return allNews.slice(0, 20);
  } catch (error) {
    console.error('Crypto news error:', error);
    return getFallbackCryptoNews();
  }
};

// CoinTelegraph RSS
const fetchCoinTelegraph = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss'
    );
    
    const prices = await fetchCryptoPrices();
    
    return response.data.items.slice(0, 8).map((item, index) => {
      const coin = prices[index % prices.length];
      return {
        id: `crypto_ct_${Date.now()}_${index}`,
        user: {
          name: 'Cointelegraph',
          username: 'cointelegraph',
          avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop'
        },
        text: `${item.title}\n\n${coin.emoji} ${coin.name}: $${coin.price.toLocaleString()} (${coin.change > 0 ? '+' : ''}${coin.change.toFixed(2)}%)`,
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

// CoinDesk RSS
const fetchCoinDeskRSS = async () => {
  try {
    const response = await axios.get(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.coindesk.com/arc/outboundfeeds/rss/'
    );
    
    return response.data.items.slice(0, 8).map((item, index) => ({
      id: `crypto_cd_${Date.now()}_${index}`,
      user: {
        name: 'CoinDesk',
        username: 'coindesk',
        avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || item.title,
      image: item.thumbnail || item.enclosure?.link || `https://picsum.photos/seed/cd${index}/600/400`,
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

// CryptoPanic News
const fetchCryptoPanicNews = async () => {
  try {
    // CryptoPanic has a free API - sign up at https://cryptopanic.com/developers/api/
    const response = await axios.get(
      'https://cryptopanic.com/api/v1/posts/?auth_token=free&public=true'
    );
    
    return response.data.results.slice(0, 10).map((item, index) => ({
      id: `crypto_cp_${item.id}`,
      user: {
        name: item.source.title,
        username: item.source.domain,
        avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.title,
      image: `https://picsum.photos/seed/cp${index}/600/400`,
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

// Crypto News API (if you have a key)
const fetchCryptoNewsAPI = async () => {
  try {
    // Get from https://cryptonews-api.com
    const response = await axios.get(
      'https://cryptonews-api.com/api/v1?tickers=BTC,ETH,BNB,XRP&items=10&token=demo'
    );
    
    return response.data.data.slice(0, 8).map((item, index) => ({
      id: `crypto_cna_${Date.now()}_${index}`,
      user: {
        name: item.news_url.split('/')[2],
        username: 'crypto_news',
        avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop'
      },
      text: item.title,
      content: item.text || item.title,
      image: item.image_url || `https://picsum.photos/seed/cna${index}/600/400`,
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

// Reddit Crypto (existing but enhanced)
const fetchRedditCrypto = async () => {
  try {
    const redditResponse = await axios.get(
      'https://www.reddit.com/r/CryptoCurrency/hot.json?limit=12'
    );
    
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
        text: `${item.data.title}\n\n${coin.emoji} ${coin.name}: $${coin.price.toLocaleString()} (${coin.change > 0 ? '+' : ''}${coin.change.toFixed(2)}%)`,
        content: item.data.selftext || item.data.title,
        image: (item.data.thumbnail && item.data.thumbnail !== 'self' && item.data.thumbnail !== 'default') 
          ? item.data.thumbnail 
          : coin.image,
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

// Helper: Fetch Crypto Prices
const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false'
    );
    
    return response.data.map(coin => ({
      name: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change: coin.price_change_percentage_24h || 0,
      emoji: (coin.price_change_percentage_24h || 0) > 0 ? '🟢' : '🔴',
      image: coin.image
    }));
  } catch (error) {
    return [
      { name: 'BTC', price: 45000, change: 2.5, emoji: '🟢', image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100' },
      { name: 'ETH', price: 2800, change: 3.2, emoji: '🟢', image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=100' }
    ];
  }
};

// ============= GENERAL NEWS (World, Business, etc.) =============
const fetchGeneralNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${NEWS_API_KEY}`
    );
    
    return response.data.articles.map((article, index) => ({
      id: `general_${Date.now()}_${index}`,
      user: {
        name: article.source.name,
        username: article.source.id || 'news',
        avatar: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&h=100&fit=crop'
      },
      text: article.title,
      content: article.description || article.title,
      image: article.urlToImage || `https://picsum.photos/seed/gen${index}/600/400`,
      likes: Math.floor(Math.random() * 1200) + 200,
      comments: Math.floor(Math.random() * 90) + 15,
      timestamp: new Date(article.publishedAt),
      category: 'general',
      source: article.source.name,
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.log('General news unavailable');
    return [];
  }
};

// ============= FETCH REAL COMMENTS (Enhanced) =============
export const fetchRealComments = async (postId) => {
  try {
    // Try to fetch real comments from Reddit if it's a Reddit post
    if (postId.includes('crypto_reddit_') || postId.includes('reddit')) {
      const redditId = postId.replace('crypto_reddit_', '').replace('reddit_', '');
      
      try {
        const response = await axios.get(
          `https://www.reddit.com/comments/${redditId}.json?limit=25`
        );
        
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
    
    // Fallback to realistic generated comments
    return generateRealisticComments(postId);
  } catch (error) {
    return generateRealisticComments(postId);
  }
};

// ============= GENERATE REALISTIC COMMENTS =============
const generateRealisticComments = (postId = '') => {
  const commentTemplates = {
    tech: [
      "This is incredible! The architecture looks really well thought out.",
      "Been waiting for this release for months. Exceeds expectations! 🚀",
      "The performance benchmarks are impressive. Great work!",
      "Any timeline for TypeScript support? Would be amazing.",
      "This solves a major problem we've been facing. Thank you!",
      "The docs are crystal clear. Easy to integrate!",
      "How does this compare to similar solutions?",
      "Love the developer experience here. Very intuitive API.",
      "Already deployed to production. Working perfectly!",
      "The community support is fantastic. Keep it up! 💪",
      "Mind blown by the innovation here! 🤯",
      "This is going to change the game completely.",
      "The scalability potential is huge.",
      "Open source version coming soon?",
      "Security audit results look solid. Nice!"
    ],
    sports: [
      "What an absolute masterclass! Best match this season! 🔥",
      "That finish was pure class. World-class talent!",
      "The tactics were spot on. Everything clicked perfectly.",
      "Unbelievable comeback! Never stopped believing! 👏",
      "The atmosphere must have been electric tonight!",
      "This rivalry delivers every single time.",
      "Incredible sportsmanship from both sides. Respect!",
      "The young players really stepped up. Bright future! ⭐",
      "That skill display was next level. Wow!",
      "Can't wait for the rematch! Season heating up! 🏆",
      "VAR got that one right. Correct decision.",
      "Manager's substitutions changed the game.",
      "Defense was rock solid today. Impressive!",
      "The pace of that counter-attack was insane!",
      "Title race is getting very interesting now..."
    ],
    crypto: [
      "Market sentiment shifting bullish. Good signs! 📈",
      "This tech could revolutionize finance completely.",
      "DYOR and only invest what you can lose! Stay safe.",
      "Institutional adoption accelerating faster than expected.",
      "This dip is prime accumulation territory. 💎🙌",
      "We need regulatory clarity for mass adoption.",
      "Fundamentals looking incredibly strong right now.",
      "DeFi continues showing blockchain's true potential.",
      "Holding strong since 2017. Very bullish! 🚀",
      "The tech improvements are moving so fast!",
      "Layer 2 solutions are game changers for scalability.",
      "Smart contract audits are crucial. Security first!",
      "Staking rewards looking attractive long-term.",
      "The tokenomics make a lot of sense here.",
      "Bear market = building season. Stay focused."
    ],
    general: [
      "Thanks for sharing this important update!",
      "This is exactly what we needed to hear.",
      "The implications of this are huge.",
      "More coverage on this topic please!",
      "Really well-written article. Clear and informative.",
      "This affects so many people. Critical news.",
      "Hoping for positive developments soon.",
      "The data presented here is eye-opening.",
      "We need more transparency on this issue.",
      "Great journalism. Keep up the excellent work! 👏"
    ]
  };
  
  // Determine category from postId
  let category = 'tech';
  if (postId.includes('sports')) category = 'sports';
  if (postId.includes('crypto')) category = 'crypto';
  if (postId.includes('general')) category = 'general';
  
  const templates = commentTemplates[category];
  const numComments = 10 + Math.floor(Math.random() * 11); // 10-20 comments
  
  const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'Chris', 'Lisa', 'David', 'Nina', 'James', 'Sofia', 'Ryan', 'Maya', 'Tom', 'Zoe', 'Ben'];
  
  return Array.from({ length: numComments }, (_, index) => ({
    id: `gen_comment_${Date.now()}_${index}`,
    user: {
      name: `${names[index % names.length]}${Math.floor(Math.random() * 100)}`,
      username: `user_${Math.floor(Math.random() * 10000)}`,
      avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`
    },
    text: templates[Math.floor(Math.random() * templates.length)],
    likes: Math.floor(Math.random() * 150) + 1,
    timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
    isLiked: false
  }));
};

// ============= FALLBACK DATA =============
const getFallbackNews = () => [
  ...getFallbackTechNews(),
  ...getFallbackSportsNews(),
  ...getFallbackCryptoNews()
];

const getFallbackTechNews = () => [
  {
    id: `tech_fallback_${Date.now()}_1`,
    user: {
      name: 'Tech Insider',
      username: 'tech_insider',
      avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop'
    },
    text: 'Apple unveils revolutionary AI features for iOS 18 with enhanced Siri capabilities',
    content: 'Major AI improvements coming to iPhone with focus on privacy and performance',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    likes: 1242,
    comments: 89,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'tech',
    source: 'Tech News',
    liked: false
  },
  {
    id: `tech_fallback_${Date.now()}_2`,
    user: {
      name: 'AI Research',
      username: 'ai_research',
      avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop'
    },
    text: 'OpenAI releases GPT-4.5 Turbo with enhanced multimodal capabilities',
    content: 'New model offers significant improvements in reasoning and context',
    image: 'https://images.unsplash.com/photo-1677442135136-760c81240f34?w=600&h=400&fit=crop',
    likes: 856,
    comments: 67,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: 'tech',
    source: 'AI News',
    liked: false
  }
];

const getFallbackSportsNews = () => [
  {
    id: `sports_fallback_${Date.now()}_1`,
    user: {
      name: 'Sky Sports',
      username: 'skysports',
      avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop'
    },
    text: '🔴 LIVE: Champions League action - Real Madrid vs Bayern Munich thriller underway',
    content: 'European giants clash in epic Champions League semi-final showdown',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop',
    likes: 3245,
    comments: 234,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    category: 'sports',
    source: 'Sky Sports',
    liked: false
  },
  {
    id: `sports_fallback_${Date.now()}_2`,
    user: {
      name: 'Premier League',
      username: 'premierleague',
      avatar: 'https://images.unsplash.com/photo-1543326627-abf0b1a1e998?w=100&h=100&fit=crop'
    },
    text: 'Manchester City secures dramatic derby win with Haaland\'s stunning last-minute goal',
    content: 'Thrilling Manchester derby ends 3-2 with late heroics at the Etihad',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
    likes: 2890,
    comments: 178,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: 'sports',
    source: 'Premier League',
    liked: false
  },
  {
    id: `sports_fallback_${Date.now()}_3`,
    user: {
      name: 'ESPN',
      username: 'espn',
      avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop'
    },
    text: 'Lakers vs Celtics overtime classic: Historic rivalry delivers another instant classic',
    content: 'NBA legends clash in double OT thriller at TD Garden',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&h=400&fit=crop',
    likes: 1890,
    comments: 156,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    category: 'sports',
    source: 'ESPN',
    liked: false
  }
];

const getFallbackCryptoNews = () => [
  {
    id: `crypto_fallback_${Date.now()}_1`,
    user: {
      name: 'Crypto Analyst',
      username: 'crypto_whale',
      avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop'
    },
    text: '🟢 Bitcoin surges past $48,000 as institutional adoption accelerates - Bulls target $60k',
    content: 'Major institutions continue accumulating BTC amid growing mainstream acceptance',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
    likes: 892,
    comments: 145,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: 'crypto',
    source: 'Crypto News',
    liked: false
  },
  {
    id: `crypto_fallback_${Date.now()}_2`,
    user: {
      name: 'DeFi Daily',
      username: 'defi_daily',
      avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop'
    },
    text: '🟢 Ethereum breaks $3,000 barrier as network activity reaches all-time high',
    content: 'ETH surges on massive DeFi and NFT adoption across the ecosystem',
    image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=600&h=400&fit=crop',
    likes: 567,
    comments: 89,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'crypto',
    source: 'DeFi News',
    liked: false
  }
];

// ============= EXPORTS =============
export default {
  fetchAllNewsFeed,
  fetchEnhancedTechNews,
  fetchEnhancedSportsNews,
  fetchEnhancedCryptoNews,
  fetchRealComments,
  
  // Legacy exports for backward compatibility
  fetchRealTechNews: fetchEnhancedTechNews,
  fetchRealSportsNews: fetchEnhancedSportsNews,
  fetchRealCryptoNews: fetchEnhancedCryptoNews
};