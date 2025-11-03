import axios from 'axios';

// ============= CONFIGURATION =============
const CONFIG = {
  NEWS_API_KEY: 'dd2d0304768e433cb56b0f057408a8bc',
  GNEWS_API_KEY: '40fc4f2a6ffb64830419e2ab908229ed',
  COINGECKO_API: 'https://api.coingecko.com/api/v3'
};

// ============= MAIN NEWS FEED =============
export const fetchAllNewsFeed = async () => {
  try {
    console.log('🚀 Fetching comprehensive news feed...');
    
    // Use Promise.allSettled to handle API failures gracefully
    const [techNews, sportsNews, cryptoNews] = await Promise.allSettled([
      fetchTechNews().catch(error => {
        console.warn('Tech news failed:', error.message);
        return getFallbackTechNews();
      }),
      fetchSportsNews().catch(error => {
        console.warn('Sports news failed:', error.message);
        return getFallbackSportsNews();
      }),
      fetchCryptoNews().catch(error => {
        console.warn('Crypto news failed:', error.message);
        return getFallbackCryptoNews();
      })
    ]);

    // Combine all news sources
    const allNews = [
      ...(techNews.status === 'fulfilled' ? techNews.value : getFallbackTechNews()),
      ...(sportsNews.status === 'fulfilled' ? sportsNews.value : getFallbackSportsNews()),
      ...(cryptoNews.status === 'fulfilled' ? cryptoNews.value : getFallbackCryptoNews())
    ];

    // Ensure all posts have required fields
    const validatedNews = allNews.map(post => ({
      id: post.id || `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user: post.user || {
        name: 'Unknown Source',
        username: 'unknown',
        avatar: 'https://i.pravatar.cc/150?img=0'
      },
      text: post.text || 'No content available',
      content: post.content || post.text || 'No content available',
      image: post.image || `https://picsum.photos/seed/${Date.now()}/600/400`,
      likes: post.likes || Math.floor(Math.random() * 100) + 10,
      comments: post.comments || Math.floor(Math.random() * 20) + 1,
      timestamp: post.timestamp || new Date(),
      category: post.category || 'general',
      source: post.source || 'Unknown Source',
      liked: post.liked || false
    }));

    console.log(`✅ Successfully loaded ${validatedNews.length} news items`);
    return shuffleArray(validatedNews).slice(0, 25);

  } catch (error) {
    console.error('❌ Error in main news feed:', error);
    return getComprehensiveFallbackNews();
  }
};

// ============= INDIVIDUAL CATEGORY FUNCTIONS =============
export const fetchTechNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=10&apiKey=${CONFIG.NEWS_API_KEY}`
    );
    
    return response.data.articles.map((article, index) => ({
      id: `tech_${index}_${Date.now()}`,
      user: {
        name: article.source?.name || 'Tech News',
        username: 'tech_updates',
        avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=face'
      },
      text: article.title,
      content: article.description || 'Latest technology news and updates.',
      image: article.urlToImage || `https://picsum.photos/seed/tech${index}/600/400`,
      likes: Math.floor(Math.random() * 200) + 50,
      comments: Math.floor(Math.random() * 25) + 5,
      timestamp: new Date(article.publishedAt),
      category: 'tech',
      source: article.source?.name || 'Tech Source',
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.warn('Tech news API failed, using fallback');
    return getFallbackTechNews();
  }
};

export const fetchSportsNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=10&apiKey=${CONFIG.NEWS_API_KEY}`
    );
    
    return response.data.articles.map((article, index) => ({
      id: `sports_${index}_${Date.now()}`,
      user: {
        name: article.source?.name || 'Sports News',
        username: 'sports_updates',
        avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop&crop=face'
      },
      text: article.title,
      content: article.description || 'Latest sports news and match updates.',
      image: article.urlToImage || `https://picsum.photos/seed/sports${index}/600/400`,
      likes: Math.floor(Math.random() * 300) + 100,
      comments: Math.floor(Math.random() * 30) + 10,
      timestamp: new Date(article.publishedAt),
      category: 'sports',
      source: article.source?.name || 'Sports Network',
      url: article.url,
      liked: false
    }));
  } catch (error) {
    console.warn('Sports news API failed, using fallback');
    return getFallbackSportsNews();
  }
};

export const fetchCryptoNews = async () => {
  try {
    // Simple crypto news without complex API calls
    const coins = [
      { name: 'Bitcoin', symbol: 'BTC', price: 45230, change: 2.34 },
      { name: 'Ethereum', symbol: 'ETH', price: 2380, change: 1.56 },
      { name: 'Solana', symbol: 'SOL', price: 102.45, change: 5.67 }
    ];

    return coins.map((coin, index) => ({
      id: `crypto_${index}_${Date.now()}`,
      user: {
        name: 'Crypto Analyst',
        username: 'crypto_expert',
        avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=face'
      },
      text: `${coin.change > 0 ? '🟢' : '🔴'} ${coin.name} ${coin.change > 0 ? 'surges' : 'dips'} to $${coin.price.toLocaleString()}`,
      content: `Market update: ${coin.name} (${coin.symbol}) is trading at $${coin.price.toLocaleString()} with ${coin.change > 0 ? '+' : ''}${coin.change.toFixed(2)}% change.`,
      image: `https://picsum.photos/seed/crypto${index}/600/400`,
      likes: Math.floor(Math.random() * 150) + 50,
      comments: Math.floor(Math.random() * 20) + 5,
      timestamp: new Date(Date.now() - index * 60 * 60 * 1000),
      category: 'crypto',
      source: 'Crypto Markets',
      liked: false,
      coin: coin.name
    }));
  } catch (error) {
    console.warn('Crypto news failed, using fallback');
    return getFallbackCryptoNews();
  }
};

// ============= FALLBACK DATA =============
const getFallbackTechNews = () => {
  return [
    {
      id: `tech_fb_1_${Date.now()}`,
      user: { name: 'Tech News', username: 'tech_updates', avatar: 'https://i.pravatar.cc/150?img=5' },
      text: 'AI Revolution Transforms Software Development',
      content: 'Artificial intelligence is changing how developers write and deploy code across industries.',
      image: 'https://picsum.photos/seed/tech1/600/400',
      likes: 245,
      comments: 32,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'tech',
      source: 'Tech Journal',
      liked: false
    }
    // Add more fallback posts as needed
  ];
};

const getFallbackSportsNews = () => {
  return [
    {
      id: `sports_fb_1_${Date.now()}`,
      user: { name: 'Sports Center', username: 'sports_updates', avatar: 'https://i.pravatar.cc/150?img=6' },
      text: 'Championship Finals Set After Dramatic Semi-Finals',
      content: 'The stage is set for an exciting championship match after yesterday semi-final victories.',
      image: 'https://picsum.photos/seed/sports1/600/400',
      likes: 389,
      comments: 47,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      category: 'sports',
      source: 'Sports Network',
      liked: false
    }
  ];
};

const getFallbackCryptoNews = () => {
  return [
    {
      id: `crypto_fb_1_${Date.now()}`,
      user: { name: 'Crypto Updates', username: 'crypto_news', avatar: 'https://i.pravatar.cc/150?img=7' },
      text: '🟢 Bitcoin Shows Strong Recovery in Early Trading',
      content: 'Bitcoin has shown strong bullish signals in early trading sessions today.',
      image: 'https://picsum.photos/seed/crypto1/600/400',
      likes: 156,
      comments: 28,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      category: 'crypto',
      source: 'Crypto Markets',
      liked: false
    }
  ];
};

const getComprehensiveFallbackNews = () => {
  return [
    ...getFallbackTechNews(),
    ...getFallbackSportsNews(),
    ...getFallbackCryptoNews()
  ];
};

// ============= HELPER FUNCTIONS =============
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ============= COMMENTS FUNCTION =============
export const fetchRealComments = async (postId) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sampleComments = [
      {
        id: `comment_${postId}_1`,
        user: {
          name: 'Alex Johnson',
          username: 'alexj',
          avatar: 'https://i.pravatar.cc/150?img=8'
        },
        text: 'This is really interesting! Thanks for sharing.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        likes: 5
      },
      {
        id: `comment_${postId}_2`,
        user: {
          name: 'Sarah Miller',
          username: 'sarahm',
          avatar: 'https://i.pravatar.cc/150?img=9'
        },
        text: 'Great perspective on this topic!',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        likes: 3
      }
    ];
    
    return sampleComments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// ============= EXPORTS =============
export default {
  fetchAllNewsFeed,
  fetchTechNews,
  fetchSportsNews,
  fetchCryptoNews,
  fetchRealComments
};