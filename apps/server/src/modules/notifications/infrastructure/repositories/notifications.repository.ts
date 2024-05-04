import { INotificationsRepository } from '@/modules/notifications/domain/interfaces/notifications.repository';

export class MongodbNotificationsRepository
  implements INotificationsRepository
{
  constructor() {}

  createNotification: () => void;
  findNotifications: () => void;
  findOneNotificationById: (notificationId: string) => void;
  updateNotification: () => void;
  deleteNotification: (notificationId: string) => void;
}
