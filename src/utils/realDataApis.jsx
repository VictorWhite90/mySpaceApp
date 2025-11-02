import axios from 'axios';

// Real News API (NewsAPI.org - you'll need a free API key)
const NEWS_API_KEY = 'your_newsapi_key_here'; // Get from https://newsapi.org

// Real Tech News from NewsAPI
export const fetchRealTechNews = async () => {
  try {
    // If you have NewsAPI key, use this:
    // const response = await axios.get(
    //   `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
    // );
    
    // Fallback to Guardian API (no API key needed)
    const response = await axios.get(
      'https://content.guardianapis.com/technology?show-fields=thumbnail,trailText&api-key=test&page-size=10'
    );
    
    return response.data.response.results.slice(0, 8).map((article, index) => ({
      id: `tech_${article.id}`,
      user: {
        name: article.fields?.byline || 'Tech News',
        username: 'tech_news',
        avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=face'
      },
      text: article.webTitle,
      image: article.fields?.thumbnail || `https://picsum.photos/600/400?tech=${index}`,
      likes: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date(article.webPublicationDate),
      category: 'tech',
      source: 'The Guardian'
    }));
  } catch (error) {
    console.error('Tech News API error:', error);
    return getFallbackTechNews();
  }
};

// Real Sports News
export const fetchRealSportsNews = async () => {
  try {
    const response = await axios.get(
      'https://content.guardianapis.com/sport?show-fields=thumbnail,trailText&api-key=test&page-size-10'
    );
    
    return response.data.response.results.slice(0, 8).map((article, index) => ({
      id: `sports_${article.id}`,
      user: {
        name: article.fields?.byline || 'Sports News',
        username: 'sports_news',
        avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop&crop=face'
      },
      text: article.webTitle,
      image: article.fields?.thumbnail || `https://picsum.photos/600/400?sports=${index}`,
      likes: Math.floor(Math.random() * 1000) + 200,
      comments: Math.floor(Math.random() * 100) + 20,
      timestamp: new Date(article.webPublicationDate),
      category: 'sports',
      source: 'The Guardian'
    }));
  } catch (error) {
    console.error('Sports News API error:', error);
    return getFallbackSportsNews();
  }
};

// Real Crypto News with actual discussions
export const fetchRealCryptoNews = async () => {
  try {
    // Get real crypto prices
    const priceResponse = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    );
    
    // Get crypto news from Reddit
    const redditResponse = await axios.get(
      'https://www.reddit.com/r/CryptoCurrency/hot.json?limit=10'
    );
    
    const cryptoPosts = redditResponse.data.data.children.slice(0, 6).map((item, index) => {
      const coin = priceResponse.data[index] || priceResponse.data[0];
      return {
        id: `crypto_${item.data.id}`,
        user: {
          name: `Crypto Trader`,
          username: item.data.author,
          avatar: `https://i.pravatar.cc/150?u=${item.data.author}`
        },
        text: `${item.data.title} | ${coin?.name || 'BTC'}: $${coin?.current_price || '45,000'}`,
        image: item.data.thumbnail && item.data.thumbnail !== 'self' ? item.data.thumbnail : coin?.image,
        likes: item.data.ups,
        comments: item.data.num_comments,
        timestamp: new Date(item.data.created_utc * 1000),
        category: 'crypto',
        source: 'r/CryptoCurrency'
      };
    });
    
    return cryptoPosts;
  } catch (error) {
    console.error('Crypto News API error:', error);
    return getFallbackCryptoNews();
  }
};

// Fetch real comments for a post
export const fetchRealComments = async (postId) => {
  try {
    // For Reddit posts, fetch actual comments
    if (postId.includes('reddit_') || postId.includes('crypto_') || postId.includes('soccer_') || postId.includes('nba_') || postId.includes('sports_') || postId.includes('tech_')) {
      const redditId = postId.split('_').pop();
      const response = await axios.get(`https://www.reddit.com/comments/${redditId}.json?limit=15`);
      
      if (!response.data[1] || !response.data[1].data.children) {
        throw new Error('No comments found');
      }

      const comments = response.data[1].data.children
        .filter(comment => comment.kind === 't1') // Only actual comments
        .slice(0, 12) // Limit to 12 comments
        .map(comment => ({
          id: `reddit_comment_${comment.data.id}`,
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

      console.log(`Fetched ${comments.length} real comments from Reddit`);
      return comments;
    }
    
    // Fallback to generated comments for non-Reddit posts
    return generateRealisticComments();
  } catch (error) {
    console.error('Error fetching real comments from Reddit:', error);
    return generateRealisticComments();
  }
};

// Generate realistic comments when API fails
const generateRealisticComments = () => {
  const commentTemplates = {
    tech: [
      "This is exactly what we needed! The implementation looks solid.",
      "I've been working on something similar. Great to see this approach!",
      "Does this support TypeScript? Would love to see some examples.",
      "The performance improvements are impressive. Well done!",
      "Any plans for mobile support? This would be perfect for our app.",
      "Interesting approach! How does this compare to existing solutions?",
      "The documentation is very clear. Easy to get started!",
    ],
    sports: [
      "What a game! The intensity was incredible from start to finish.",
      "That goal was absolutely world class. Player of the season contender!",
      "The tactics were spot on today. Manager got everything right.",
      "Unbelievable comeback! Never count this team out.",
      "The atmosphere in the stadium was electric tonight!",
      "This rivalry just keeps getting better every season.",
      "Incredible sportsmanship shown by both teams. Respect!",
    ],
    crypto: [
      "The market sentiment is definitely shifting bullish lately.",
      "This technology could revolutionize the entire financial system.",
      "Important to remember: only invest what you can afford to lose!",
      "The adoption rate is accelerating faster than expected.",
      "This dip is a great buying opportunity for long-term holders.",
      "The regulatory clarity is much needed for mass adoption.",
      "The fundamentals remain strong despite price volatility.",
    ]
  };
  
  const categories = ['tech', 'sports', 'crypto'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const templates = commentTemplates[randomCategory];
  
  return Array.from({ length: 6 + Math.floor(Math.random() * 6) }, (_, index) => ({
    id: `gen_comment_${Date.now()}_${index}`,
    user: {
      name: `User${Math.floor(Math.random() * 1000)}`,
      username: `user${Math.floor(Math.random() * 10000)}`,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
    },
    text: templates[Math.floor(Math.random() * templates.length)],
    likes: Math.floor(Math.random() * 50),
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    isLiked: false
  }));
};

// Fallback data in case APIs fail
const getFallbackTechNews = () => [
  {
    id: 'tech_1',
    user: {
      name: 'Tech Insider',
      username: 'tech_insider',
      avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Apple announces new AI features coming to iOS 18 with enhanced Siri capabilities',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    likes: 1242,
    comments: 89,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'tech'
  },
  {
    id: 'tech_2',
    user: {
      name: 'AI Research',
      username: 'ai_research',
      avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=face'
    },
    text: 'OpenAI releases GPT-4.5 with multimodal understanding and faster response times',
    image: 'https://images.unsplash.com/photo-1677442135136-760c81240f34?w=600&h=400&fit=crop',
    likes: 856,
    comments: 67,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: 'tech'
  }
];

const getFallbackSportsNews = () => [
  {
    id: 'sports_1',
    user: {
      name: 'Premier League',
      username: 'premierleague',
      avatar: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Manchester City wins dramatic derby against United with last-minute goal from Haaland',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop',
    likes: 3245,
    comments: 234,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: 'sports'
  },
  {
    id: 'sports_2',
    user: {
      name: 'NBA Official',
      username: 'nba',
      avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Lakers vs Celtics: Classic rivalry continues with overtime thriller in Boston',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
    likes: 1890,
    comments: 156,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    category: 'sports'
  }
];

const getFallbackCryptoNews = () => [
  {
    id: 'crypto_1',
    user: {
      name: 'Crypto Analyst',
      username: 'crypto_whale',
      avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Bitcoin breaks $45,000 as institutional adoption continues to grow - analysts predict $60k by EOY',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
    likes: 892,
    comments: 145,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'crypto'
  },
  {
    id: 'crypto_2',
    user: {
      name: 'DeFi Daily',
      username: 'defi_daily',
      avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Ethereum Shanghai upgrade goes live - staking withdrawals now available for validators',
    image: 'https://images.unsplash.com/photo-1639762681057-40897d1b5ba5?w=600&h=400&fit=crop',
    likes: 567,
    comments: 89,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: 'crypto'
  }
];