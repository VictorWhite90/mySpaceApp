export const generateMockPosts = (count = 20) => {
  const users = [
    { name: 'Sarah Chen', username: 'sarahc', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Marcus Johnson', username: 'mjohnson', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Elena Rodriguez', username: 'erodriguez', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'David Kim', username: 'dkim', avatar: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Priya Sharma', username: 'priyash', avatar: 'https://i.pravatar.cc/150?img=5' },
  ];

  const texts = [
    'Just launched our new product! 🚀 Excited to share this journey with everyone.',
    'Beautiful sunset today. Sometimes you need to stop and appreciate the little things.',
    'Working on something exciting. Can\'t wait to share more details soon!',
    'Coffee + Code = Perfect Monday morning ☕💻',
    'Amazing conference today! Met so many talented people in the industry.',
    'Throwback to last summer\'s adventure. Time to plan the next one!',
    'Learning something new every day. Growth mindset is everything 📚',
    'Just hit a major milestone! Thank you all for the support 🙏',
  ];

  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    null,
    null,
  ];

  return Array.from({ length: count }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    return {
      id: Date.now() + i,
      user,
      text: texts[Math.floor(Math.random() * texts.length)],
      image: images[Math.floor(Math.random() * images.length)],
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 50),
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      liked: false,
    };
  });
};