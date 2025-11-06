import React, { createContext, useState, useContext, useCallback } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // State to track the number of new, unread swap requests
  const [notificationCount, setNotificationCount] = useState(0);

  // State to trigger a refresh (used by RequestsPage)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually increase the badge count
  const incrementNotifications = useCallback(() => {
    setNotificationCount((prev) => prev + 1);
  }, []);

  // Function to clear the badge count (called when user views RequestsPage)
  const clearNotifications = useCallback(() => {
    setNotificationCount(0);
  }, []);

  // Function for components to call when they need the latest data
  const triggerDataRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1); // Changes state to force data fetching
  }, []);

  const value = {
    notificationCount,
    refreshTrigger,
    incrementNotifications,
    clearNotifications,
    triggerDataRefresh,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useNotifications = () => useContext(NotificationContext);
