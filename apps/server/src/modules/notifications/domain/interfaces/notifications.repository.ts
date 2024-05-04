import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { FindNotificationsDto } from '../dtos/find-notifications.dto';
import { NotificationDto } from '../dtos/notification.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';

export class INotificationsRepository {
  createNotification: (
    dto: CreateNotificationDto,
  ) => Promise<CreateNotificationDto>;

  findNotifications: (dto: FindNotificationsDto) => Promise<NotificationDto[]>;

  findOneNotificationById: (
    notificationId: string,
  ) => Promise<NotificationDto | null>;

  updateNotification: (
    notificationId: string,
    dto: UpdateNotificationDto,
  ) => Promise<NotificationDto | null>;

  deleteNotification: (
    notificationId: string,
  ) => Promise<NotificationDto | null>;
}
