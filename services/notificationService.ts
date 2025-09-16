import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Alert } from 'react-native';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  data?: any;
}

// Настройка обработчика уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private notifications: NotificationData[] = [];
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          Alert.alert('Уведомления отключены', 'Пожалуйста, включите уведомления в настройках');
          return false;
        }
        
        return true;
      } else {
        Alert.alert('Физическое устройство требуется', 'Push уведомления работают только на физических устройствах');
        return false;
      }
    } catch (error) {
      console.error('Ошибка при запросе разрешений:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log('Push уведомления работают только на физических устройствах');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: '12c6e3fe-46e1-4eb7-b16e-073bf99501e0', // Ваш project ID из app.json
      });
      
      console.log('Expo Push Token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Ошибка при получении токена:', error);
      return null;
    }
  }

  async subscribeToTopic(topic: string): Promise<boolean> {
    try {
      // Expo Notifications не поддерживает топики напрямую
      // Но мы можем симулировать это для демонстрации
      console.log(`Подписались на топик: ${topic}`);
      Alert.alert('Информация', `В Expo Notifications топики не поддерживаются напрямую. Топик "${topic}" зарегистрирован для демонстрации.`);
      return true;
    } catch (error) {
      console.error('Ошибка при подписке на топик:', error);
      return false;
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<boolean> {
    try {
      // Expo Notifications не поддерживает топики напрямую
      console.log(`Отписались от топика: ${topic}`);
      Alert.alert('Информация', `В Expo Notifications топики не поддерживаются напрямую. Отписка от топика "${topic}" зарегистрирована для демонстрации.`);
      return true;
    } catch (error) {
      console.error('Ошибка при отписке от топика:', error);
      return false;
    }
  }

  setupMessageHandlers() {
    // Обработка входящих уведомлений
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Получено уведомление:', notification);
      this.addNotification({
        id: notification.request.identifier,
        title: notification.request.content.title || 'Уведомление',
        body: notification.request.content.body || '',
        timestamp: Date.now(),
        data: notification.request.content.data,
      });
    });

    // Обработка нажатий на уведомления
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Уведомление открыто:', response);
      this.addNotification({
        id: response.notification.request.identifier,
        title: response.notification.request.content.title || 'Уведомление',
        body: response.notification.request.content.body || '',
        timestamp: Date.now(),
        data: response.notification.request.content.data,
      });
    });
  }

  async sendLocalNotification(title: string, body: string, data?: any) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Показать немедленно
      });
      
      // Добавляем в историю
      this.addNotification({
        id: Date.now().toString(),
        title,
        body,
        timestamp: Date.now(),
        data,
      });
      
      return true;
    } catch (error) {
      console.error('Ошибка при отправке локального уведомления:', error);
      return false;
    }
  }

  addNotification(notification: NotificationData) {
    this.notifications.unshift(notification);
    // Ограничиваем количество уведомлений в истории
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
  }

  getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  clearNotifications() {
    this.notifications = [];
  }

  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }
}

export default new NotificationService();