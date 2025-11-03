import axios from 'axios';

// ============= TECH NEWS =============
export const fetchRealTechNews = async () => {
  try {
    // Using Guardian API (free, no key needed)
    const response = await axios.get(
      'https://content.guardianapis.com/technology?show-fields=thumbnail,trailText&api-key=test&page-size=15'
    );
    
    return response.data.response.results.slice(0, 15).map((article, index) => ({
      id: `tech_${article.id}_${Date.now()}`,
      user: {
        name: article.fields?.byline || 'The Guardian Tech',
        username: 'guardian_tech',
        avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=face'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || `https://picsum.photos/seed/tech${index}/600/400`,
      likes: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date(article.webPublicationDate),
      category: 'tech',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.error('Tech News API error:', error);
    return getFallbackTechNews();
  }
};

// ============= SPORTS NEWS =============
export const fetchRealSportsNews = async () => {
  try {
    const response = await axios.get(
      'https://content.guardianapis.com/sport?show-fields=thumbnail,trailText&api-key=test&page-size=10'
    );
    
    return response.data.response.results.slice(0, 15).map((article, index) => ({
      id: `sports_${article.id}_${Date.now()}`,
      user: {
        name: article.fields?.byline || 'The Guardian Sports',
        username: 'guardian_sports',
        avatar: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop&crop=face'
      },
      text: article.webTitle,
      content: article.fields?.trailText || article.webTitle,
      image: article.fields?.thumbnail || `https://picsum.photos/seed/sport${index}/600/400`,
      likes: Math.floor(Math.random() * 1000) + 200,
      comments: Math.floor(Math.random() * 100) + 20,
      timestamp: new Date(article.webPublicationDate),
      category: 'sports',
      source: 'The Guardian',
      url: article.webUrl,
      liked: false
    }));
  } catch (error) {
    console.error('Sports News API error:', error);
    return getFallbackSportsNews();
  }
};

// ============= CRYPTO NEWS =============
export const fetchRealCryptoNews = async () => {
  try {
    // Get crypto prices from CoinGecko
    const priceResponse = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false'
    );
    
    // Get crypto discussions from Reddit
    const redditResponse = await axios.get(
      'https://www.reddit.com/r/CryptoCurrency/hot.json?limit=15'
    );
    
    const cryptoPosts = redditResponse.data.data.children.slice(0, 10).map((item, index) => {
      const coin = priceResponse.data[index] || priceResponse.data[0];
      const priceChange = coin?.price_change_percentage_24h || 0;
      const emoji = priceChange > 0 ? '🟢' : '🔴';
      
      return {
        id: `crypto_${item.data.id}`,
        user: {
          name: item.data.author,
          username: `u/${item.data.author}`,
          avatar: `https://i.pravatar.cc/150?u=${item.data.author}`
        },
        text: `${item.data.title}\n\n${emoji} ${coin?.name || 'BTC'}: $${coin?.current_price?.toLocaleString() || '45,000'} (${priceChange > 0 ? '+' : ''}${priceChange?.toFixed(2)}%)`,
        content: item.data.selftext || item.data.title,
        image: (item.data.thumbnail && item.data.thumbnail !== 'self' && item.data.thumbnail !== 'default') 
          ? item.data.thumbnail 
          : coin?.image,
        likes: item.data.ups,
        comments: item.data.num_comments,
        timestamp: new Date(item.data.created_utc * 1000),
        category: 'crypto',
        source: 'r/CryptoCurrency',
        url: `https://reddit.com${item.data.permalink}`,
        liked: false
      };
    });
    
    return cryptoPosts;
  } catch (error) {
    console.error('Crypto News API error:', error);
    return getFallbackCryptoNews();
  }
};

// ============= FETCH REAL COMMENTS =============
export const fetchRealComments = async (postId) => {
  try {
    // Extract Reddit ID from post ID
    if (postId.includes('crypto_')) {
      const redditId = postId.replace('crypto_', '');
      
      try {
        const response = await axios.get(
          `https://www.reddit.com/comments/${redditId}.json?limit=20`
        );
        
        if (response.data && response.data[1] && response.data[1].data.children) {
          const comments = response.data[1].data.children
            .filter(comment => comment.kind === 't1' && comment.data.body) // Only actual comments
            .slice(0, 15) // Limit to 15 comments
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

          if (comments.length > 0) {
            console.log(`✅ Fetched ${comments.length} real comments from Reddit`);
            return comments;
          }
        }
      } catch (redditError) {
        console.log('Reddit comments unavailable, using generated comments');
      }
    }
    
    // Fallback to realistic generated comments
    return generateRealisticComments(postId);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return generateRealisticComments(postId);
  }
};

// ============= GENERATE REALISTIC COMMENTS =============
const generateRealisticComments = (postId = '') => {
  const commentTemplates = {
    tech: [
      "This is a game-changer! The implementation looks really solid.",
      "I've been following this project for months. Great to see it finally launch!",
      "The performance improvements are incredible. Well done team! 🚀",
      "Any plans for TypeScript support? Would love to see type definitions.",
      "This solves a major pain point I've been dealing with. Thank you!",
      "The documentation is really clear and comprehensive. Easy to get started!",
      "How does this compare to the existing solutions in the ecosystem?",
      "The API design is intuitive. Love the developer experience here.",
      "Already integrated this into our production app. Working flawlessly!",
      "The community around this project is amazing. Keep up the great work! 💪"
    ],
    sports: [
      "What an absolute thriller! Best game I've watched this season! 🔥",
      "That last-minute goal was pure class. World-class performance!",
      "The tactics from the manager were spot on today. Everything clicked.",
      "Unbelievable comeback! This team never gives up. True champions! 👏",
      "The atmosphere in the stadium must have been electric tonight!",
      "This rivalry just keeps delivering incredible matches every time.",
      "Incredible sportsmanship shown by both teams. Massive respect!",
      "The young players really stepped up today. Future looks bright! ⭐",
      "That was some next-level skill on display. Wow!",
      "Can't wait for the rematch! This season is getting intense! 🏆"
    ],
    crypto: [
      "The market sentiment is definitely shifting bullish. Good signs ahead! 📈",
      "This technology has the potential to revolutionize finance completely.",
      "Remember: only invest what you can afford to lose. Stay safe out there!",
      "The institutional adoption is accelerating faster than anyone predicted.",
      "This dip is a great accumulation opportunity for long-term holders. 💎🙌",
      "Regulatory clarity would really help mainstream adoption take off.",
      "The fundamentals remain incredibly strong despite the volatility.",
      "DeFi continues to show the true potential of blockchain tech.",
      "Been holding since 2017. Feeling very bullish about the future! 🚀",
      "The tech improvements in this space are moving at lightning speed!"
    ]
  };
  
  // Determine category from postId
  let category = 'tech';
  if (postId.includes('sports')) category = 'sports';
  if (postId.includes('crypto')) category = 'crypto';
  
  const templates = commentTemplates[category];
  const numComments = 8 + Math.floor(Math.random() * 7); // 8-14 comments
  
  return Array.from({ length: numComments }, (_, index) => ({
    id: `gen_comment_${Date.now()}_${index}`,
    user: {
      name: `${['Alex', 'Sarah', 'Mike', 'Emma', 'Chris', 'Lisa', 'David', 'Nina'][index % 8]}${Math.floor(Math.random() * 100)}`,
      username: `user_${Math.floor(Math.random() * 10000)}`,
      avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`
    },
    text: templates[Math.floor(Math.random() * templates.length)],
    likes: Math.floor(Math.random() * 100) + 1,
    timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000), // Within last 12 hours
    isLiked: false
  }));
};

// ============= FALLBACK DATA =============
const getFallbackTechNews = () => [
  {
    id: `tech_fallback_${Date.now()}_1`,
    user: {
      name: 'Tech Insider',
      username: 'tech_insider',
      avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Apple announces groundbreaking AI features for iOS 18 with enhanced Siri and on-device intelligence',
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
      avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=face'
    },
    text: 'OpenAI releases GPT-4.5 Turbo with multimodal capabilities and 3x faster response times',
    content: 'New model offers significant improvements in reasoning and context understanding',
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
      name: 'Premier League',
      username: 'premierleague',
      avatar: 'https://images.unsplash.com/photo-1543326627-abf0b1a1e998?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Manchester City secures dramatic derby win against United with Haaland\'s stunning last-minute goal',
    content: 'Thrilling Manchester derby ends 3-2 with late heroics',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop',
    likes: 3245,
    comments: 234,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: 'sports',
    source: 'Premier League',
    liked: false
  },
  {
    id: `sports_fallback_${Date.now()}_2`,
    user: {
      name: 'NBA Official',
      username: 'nba',
      avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Lakers vs Celtics overtime thriller: Classic rivalry delivers another instant classic in Boston',
    content: 'Historic matchup goes to double OT with incredible performances',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&h=400&fit=crop',
    likes: 1890,
    comments: 156,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    category: 'sports',
    source: 'NBA',
    liked: false
  }
];

const getFallbackCryptoNews = () => [
  {
    id: `crypto_fallback_${Date.now()}_1`,
    user: {
      name: 'Crypto Analyst',
      username: 'crypto_whale',
      avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=face'
    },
    text: '🟢 Bitcoin breaks $45,000 barrier as institutional adoption accelerates - Analysts predict $60k by Q4',
    content: 'Major institutions continue accumulating BTC amid growing mainstream acceptance',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&h=400&fit=crop',
    likes: 892,
    comments: 145,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'crypto',
    source: 'Crypto News',
    liked: false
  },
  {
    id: `crypto_fallback_${Date.now()}_2`,
    user: {
      name: 'DeFi Daily',
      username: 'defi_daily',
      avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=face'
    },
    text: '🟢 Ethereum Shanghai upgrade complete - Staking withdrawals now live for all validators',
    content: 'Major milestone achieved as Ethereum completes successful network upgrade',
    image: 'https://images.unsplash.com/photo-1639762681057-40897d1b5ba5?w=600&h=400&fit=crop',
    likes: 567,
    comments: 89,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: 'crypto',
    source: 'DeFi News',
    liked: false
  }
];

// Default export
export default {
  fetchRealTechNews,
  fetchRealSportsNews,
  fetchRealCryptoNews,
  fetchRealComments,
};