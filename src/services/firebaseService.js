import { db, auth } from '../firebase/config'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp // ✅ ADD THIS IMPORT
} from 'firebase/firestore';

// ✅ ADD THIS FUNCTION - Create user profile
export const createUserProfile = async (userData) => {
  try {
    await setDoc(doc(db, 'users', userData.uid), {
      name: userData.name || userData.displayName || 'User',
      username: userData.username || userData.email?.split('@')[0] || `user${userData.uid.slice(0, 8)}`,
      email: userData.email,
      avatar: userData.avatar || `https://i.pravatar.cc/150?u=${userData.uid}`,
      bio: userData.bio || '',
      location: userData.location || '',
      website: userData.website || '',
      followers: [],
      following: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ User profile created in Firestore');
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Your existing functions remain the same...
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const followUser = async (currentUserId, targetUserId) => {
  try {
    const batch = [
      updateDoc(doc(db, 'users', currentUserId), {
        following: arrayUnion(targetUserId)
      }),
      updateDoc(doc(db, 'users', targetUserId), {
        followers: arrayUnion(currentUserId)
      })
    ];
    
    await Promise.all(batch);
    return true;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    const batch = [
      updateDoc(doc(db, 'users', currentUserId), {
        following: arrayRemove(targetUserId)
      }),
      updateDoc(doc(db, 'users', targetUserId), {
        followers: arrayRemove(currentUserId)
      })
    ];
    
    await Promise.all(batch);
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const checkFollowingStatus = async (currentUserId, targetUserId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', currentUserId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.following?.includes(targetUserId) || false;
    }
    return false;
  } catch (error) {
    console.error('Error checking follow status:', error);
    throw error;
  }
};

// Posts Functions
// In src/services/firebaseService.js
export const getUserPosts = async (userId) => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef, 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to Date if needed
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToUserProfile = (userId, callback) => {
  return onSnapshot(doc(db, 'users', userId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

export const createUserPost = async (userId, postData) => {
  try {
    const postRef = doc(collection(db, 'posts'));
    const post = {
      id: postRef.id,
      userId: userId,
      user: {
        name: postData.user.name,
        username: postData.user.username,
        avatar: postData.user.avatar
      },
      text: postData.text,
      image: postData.image || null,
      likes: 0,
      comments: 0,
      timestamp: serverTimestamp(),
      liked: false,
      category: 'user',
      content: postData.text,
      source: 'User Post'
    };

    await setDoc(postRef, post);
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};



// In src/services/firebaseService.js
export const subscribeToUserPosts = (userId, callback) => {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef, 
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp
      });
    });
    callback(posts);
  }, (error) => {
    console.error('Error in posts subscription:', error);
  });
};