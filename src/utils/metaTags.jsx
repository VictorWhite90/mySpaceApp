import { useEffect } from 'react';

// Utility to dynamically update meta tags for social media sharing
export const updateMetaTags = ({
  title = 'ConnectSphere - Connect, Share, Inspire Together',
  description = 'Join the next generation of social networking. Share moments, engage with communities, and build meaningful connections in real-time.',
  image = '/og-image.png',
  url = window.location.href,
  type = 'website'
}) => {
  // Update or create meta tags
  const setMetaTag = (property, content, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Update title
  document.title = title;
  setMetaTag('title', title);
  
  // Update description
  setMetaTag('description', description);
  
  // Update Open Graph tags
  setMetaTag('og:title', title, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:image', image.startsWith('http') ? image : `${window.location.origin}${image}`, true);
  setMetaTag('og:url', url, true);
  setMetaTag('og:type', type, true);
  
  // Update Twitter Card tags
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  setMetaTag('twitter:image', image.startsWith('http') ? image : `${window.location.origin}${image}`);
  setMetaTag('twitter:url', url);
};

// Hook to use in React components
export const useMetaTags = (metaData) => {
  useEffect(() => {
    updateMetaTags(metaData);
  }, [metaData]);
};

