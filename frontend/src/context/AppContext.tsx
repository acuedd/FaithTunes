import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';


type AppContextType = {
  permissions: {
    showEdit: boolean;
    showDelete: boolean;
    showAuthorizationToggle: boolean;
    showPlaylist: boolean;
  };
};


const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const permissions = {
    showEdit: isAuthenticated,
    showDelete: isAuthenticated,
    showAuthorizationToggle: isAuthenticated,
    showPlaylist: true,
  };


  const value: AppContextType = {
    permissions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}