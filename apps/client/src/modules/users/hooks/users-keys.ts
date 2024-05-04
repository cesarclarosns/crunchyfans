export const usersKeys = {
  all: () => ['users'] as const,
  detail: (id: string | null) => [...usersKeys.details(), id] as const,
  details: () => [...usersKeys.all(), 'detail'] as const,
  me: () => [...usersKeys.all(), 'me'] as const,
  profile: (id: string | null) => [...usersKeys.profiles(), id] as const,
  profiles: () => [...usersKeys.all(), 'profile'] as const,
};
