import { Notification } from '@app/entities/notification';
import { NotificationsRepository } from '@app/repositories/notifications-repository';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = [];

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = this.notifications.find((n) => n.id == notificationId);

    if (!notification) return null;

    return notification;
  }

  async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
    return this.notifications.filter((item) => {
      return item.recipientId === recipientId;
    });
  }

  async countManyByRecipientId(recipientId: string): Promise<number> {
    return this.notifications.filter((item) => {
      return item.recipientId === recipientId;
    }).length;
  }

  async create(notification: Notification) {
    this.notifications.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const notificationIndex = this.notifications.findIndex(
      (item) => item.id == notification.id,
    );

    if (notificationIndex >= 0) {
      this.notifications[notificationIndex] = notification;
    }
  }
}
