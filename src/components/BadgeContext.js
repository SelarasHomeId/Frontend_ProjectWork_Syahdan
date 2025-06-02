// BadgeContext.js
import { createContext, useContext } from 'react';

const BadgeContext = createContext(); // Pastikan nama context benar

export const BadgeProvider = ({ children }) => {
  const setBadge = async (count) => {
    if ('setAppBadge' in navigator) {
      await navigator.setAppBadge(count).catch(console.error);
    } else {
      // Fallback untuk browser yang tidak support
      document.title = count > 0 ? `(${count}) ${document.title}` : document.title.replace(/^\(\d+\)\s/, '');
    }
  };

  const clearBadge = async () => {
    if ('clearAppBadge' in navigator) {
      await navigator.clearAppBadge().catch(console.error);
    } else {
      document.title = document.title.replace(/^\(\d+\)\s/, '');
    }
  };

  return (
    <BadgeContext.Provider value={{ setBadge, clearBadge }}>
      {children}
    </BadgeContext.Provider>
  );
};

// Pastikan nama hook diekspor dengan benar
export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadge must be used within a BadgeProvider');
  }
  return context;
};