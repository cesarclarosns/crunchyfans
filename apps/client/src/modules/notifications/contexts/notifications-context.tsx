interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationsProvider(props: NotificationProviderProps) {
  return props.children;
}
