import React, { createContext, useContext, ReactNode } from 'react';

export type UserRole = 'guest' | 'front-office' | 'back-office' | 'admin';

interface UserRoleContextProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = React.useState<UserRole>('guest');

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
