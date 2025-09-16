import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  StatusBar,
  RefreshControl,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import notificationService, { NotificationData } from '@/services/notificationService';

export default function NotificationHistoryScreen() {
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notificationList = notificationService.getNotifications();
    setNotifications(notificationList);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
    setRefreshing(false);
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите удалить все уведомления?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            notificationService.clearNotifications();
            setNotifications([]);
          }
        }
      ]
    );
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // меньше минуты
      return 'Только что';
    } else if (diff < 3600000) { // меньше часа
      const minutes = Math.floor(diff / 60000);
      return `${minutes} мин назад`;
    } else if (diff < 86400000) { // меньше дня
      const hours = Math.floor(diff / 3600000);
      return `${hours} ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationData }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Ionicons name="notifications" size={20} color="#007AFF" />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody}>{item.body}</Text>
          <Text style={styles.notificationTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>
      {item.data && Object.keys(item.data).length > 0 && (
        <View style={styles.notificationData}>
          <Text style={styles.dataTitle}>Дополнительные данные:</Text>
          <Text style={styles.dataContent}>{JSON.stringify(item.data, null, 2)}</Text>
        </View>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#000' : '#f5f5f5',
    },
    header: {
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#fff' : '#333',
      marginBottom: 5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
    },
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 15,
    },
    notificationCount: {
      fontSize: 16,
      color: colorScheme === 'dark' ? '#fff' : '#333',
      fontWeight: '500',
    },
    clearButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    clearButtonText: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#fff' : '#333',
      marginLeft: 5,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    notificationItem: {
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#333',
      marginBottom: 4,
    },
    notificationBody: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginBottom: 8,
      lineHeight: 20,
    },
    notificationTime: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#888' : '#999',
    },
    notificationData: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
    },
    dataTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      marginBottom: 4,
    },
    dataContent: {
      fontSize: 11,
      color: colorScheme === 'dark' ? '#888' : '#999',
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f8f8f8',
      padding: 8,
      borderRadius: 6,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colorScheme === 'dark' ? '#fff' : '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: colorScheme === 'dark' ? '#ccc' : '#666',
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 История уведомлений</Text>
        <Text style={styles.headerSubtitle}>Все полученные push уведомления</Text>
        
        <View style={styles.headerActions}>
          <Text style={styles.notificationCount}>
            {notifications.length} уведомлений
          </Text>
          {notifications.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllNotifications}>
              <Ionicons 
                name="trash-outline" 
                size={16} 
                color={colorScheme === 'dark' ? '#fff' : '#333'} 
              />
              <Text style={styles.clearButtonText}>Очистить</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="notifications-off-outline" 
            size={64} 
            color={colorScheme === 'dark' ? '#666' : '#ccc'}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>Нет уведомлений</Text>
          <Text style={styles.emptySubtitle}>
            Здесь будут отображаться все полученные push уведомления.{'\n'}
            Попробуйте отправить тестовое уведомление с сервера.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.listContainer}
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colorScheme === 'dark' ? '#fff' : '#007AFF'}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}