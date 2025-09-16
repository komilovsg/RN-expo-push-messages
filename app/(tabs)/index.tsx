import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  StatusBar,
  Platform,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import notificationService from '@/services/notificationService';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [token, setToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    initializeNotifications();
    
    // Обновляем счетчик уведомлений каждые 5 секунд
    const interval = setInterval(() => {
      const notifications = notificationService.getNotifications();
      setNotificationCount(notifications.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const initializeNotifications = async () => {
    const hasPermission = await notificationService.requestPermission();
    setIsPermissionGranted(hasPermission);
    
    if (hasPermission) {
      const fcmToken = await notificationService.getToken();
      setToken(fcmToken);
      notificationService.setupMessageHandlers();
    }
  };

  const handleRequestPermission = async () => {
    const hasPermission = await notificationService.requestPermission();
    setIsPermissionGranted(hasPermission);
    
    if (hasPermission) {
      const fcmToken = await notificationService.getToken();
      setToken(fcmToken);
      notificationService.setupMessageHandlers();
      Alert.alert('Успешно!', 'Разрешения на уведомления получены');
    }
  };

  const handleGetToken = async () => {
    const fcmToken = await notificationService.getToken();
    if (fcmToken) {
      setToken(fcmToken);
      Alert.alert('FCM Token', fcmToken, [
        { text: 'Скопировать', onPress: () => {
          // В реальном приложении здесь можно добавить копирование в буфер обмена
          console.log('Token copied:', fcmToken);
        }},
        { text: 'OK' }
      ]);
    }
  };

  const handleSubscribeToTopic = async () => {
    const success = await notificationService.subscribeToTopic('test-topic');
    if (success) {
      Alert.alert('Успешно!', 'Подписались на топик "test-topic"');
    }
  };

  const handleUnsubscribeFromTopic = async () => {
    const success = await notificationService.unsubscribeFromTopic('test-topic');
    if (success) {
      Alert.alert('Успешно!', 'Отписались от топика "test-topic"');
    }
  };

  const handleTestNotification = async () => {
    const success = await notificationService.sendLocalNotification(
      'Тестовое уведомление',
      'Это локальное уведомление для тестирования интерфейса',
      { test: true, timestamp: Date.now() }
    );
    
    if (success) {
      Alert.alert('Успешно!', 'Локальное уведомление отправлено');
    } else {
      Alert.alert('Ошибка', 'Не удалось отправить уведомление');
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#000' : '#f5f5f5',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#333',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      textAlign: 'center',
    },
    statusCard: {
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#333',
      marginBottom: 12,
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusIcon: {
      marginRight: 12,
    },
    statusText: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      flex: 1,
    },
    statusValue: {
      fontSize: 14,
      fontWeight: '500',
      color: isPermissionGranted ? '#4CAF50' : '#F44336',
    },
    buttonContainer: {
      marginBottom: 20,
    },
    button: {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonPrimary: {
      backgroundColor: '#007AFF',
    },
    buttonSuccess: {
      backgroundColor: '#4CAF50',
    },
    buttonWarning: {
      backgroundColor: '#FF9800',
    },
    buttonDanger: {
      backgroundColor: '#F44336',
    },
    buttonIcon: {
      marginRight: 12,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#fff',
      flex: 1,
    },
    buttonTextDefault: {
      color: colorScheme === 'dark' ? '#fff' : '#333',
    },
    tokenContainer: {
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
    },
    tokenTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#333',
      marginBottom: 8,
    },
    tokenText: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    emptyToken: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#666' : '#999',
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🔔 Push Notifications</Text>
          <Text style={styles.subtitle}>Тестирование Expo Notifications</Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Статус системы</Text>
          <View style={styles.statusItem}>
            <Ionicons 
              name={isPermissionGranted ? 'checkmark-circle' : 'close-circle'} 
              size={20} 
              color={isPermissionGranted ? '#4CAF50' : '#F44336'}
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>Разрешения на уведомления:</Text>
            <Text style={styles.statusValue}>
              {isPermissionGranted ? 'Разрешены' : 'Запрещены'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons 
              name={token ? 'checkmark-circle' : 'close-circle'} 
              size={20} 
              color={token ? '#4CAF50' : '#F44336'}
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>Expo Push Token:</Text>
            <Text style={styles.statusValue}>
              {token ? 'Получен' : 'Не получен'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons 
              name="notifications" 
              size={20} 
              color="#007AFF"
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>Уведомлений получено:</Text>
            <Text style={[styles.statusValue, { color: '#007AFF' }]}>
              {notificationCount}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonPrimary]} 
            onPress={handleRequestPermission}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Запросить разрешения</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSuccess]} 
            onPress={handleGetToken}
            disabled={!isPermissionGranted}
          >
            <Ionicons name="key-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Получить Expo Push Token</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonWarning]} 
            onPress={handleSubscribeToTopic}
            disabled={!isPermissionGranted}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Подписаться на топик</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonDanger]} 
            onPress={handleUnsubscribeFromTopic}
            disabled={!isPermissionGranted}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Отписаться от топика</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleTestNotification}
          >
            <Ionicons 
              name="flash-outline" 
              size={24} 
              color={colorScheme === 'dark' ? '#fff' : '#333'} 
              style={styles.buttonIcon} 
            />
            <Text style={[styles.buttonText, styles.buttonTextDefault]}>Тестовое уведомление</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleOpenSettings}
          >
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={colorScheme === 'dark' ? '#fff' : '#333'} 
              style={styles.buttonIcon} 
            />
            <Text style={[styles.buttonText, styles.buttonTextDefault]}>Открыть настройки</Text>
          </TouchableOpacity>
        </View>

        {token && (
          <View style={styles.tokenContainer}>
            <Text style={styles.tokenTitle}>Expo Push Token:</Text>
            <Text style={styles.tokenText}>{token}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}