import React from 'react';
import { createContext, useContext } from 'react';

import { type UserProfile } from '@/models/users/user';

export const UserProfileContext = createContext<{
  userProfile: UserProfile;
} | null>(null);

export function UserProfileProvider({
  userProfile,
  children,
}: {
  userProfile: UserProfile;
  children: React.ReactNode;
}) {
  return (
    <UserProfileContext.Provider value={{ userProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error(
      'useUserProfileContext must be used inside a UserProfileProvider',
    );
  }

  return context;
}
