#!/usr/bin/env node

/**
 * Скрипт для тестирования отправки push уведомлений через Expo Push API
 * Использование: node test-expo-notification.js <EXPO_PUSH_TOKEN>
 */

const https = require('https');

function sendExpoNotification(token, title = 'Тестовое уведомление', body = 'Это тестовое сообщение') {
  const message = {
    to: token,
    title: title,
    body: body,
    data: {
      timestamp: Date.now().toString(),
      test: 'true'
    },
    sound: 'default',
    badge: 1,
    priority: 'high'
  };

  const postData = JSON.stringify(message);

  const options = {
    hostname: 'exp.host',
    port: 443,
    path: '/--/api/v2/push/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Статус: ${res.statusCode}`);
    console.log(`Заголовки: ${JSON.stringify(res.headers)}`);
    
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log('Ответ:', chunk);
    });
    
    res.on('end', () => {
      console.log('Уведомление отправлено через Expo Push API!');
    });
  });

  req.on('error', (e) => {
    console.error(`Ошибка: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Использование: node test-expo-notification.js <EXPO_PUSH_TOKEN> [title] [body]');
  console.log('');
  console.log('Примеры:');
  console.log('  node test-expo-notification.js "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"');
  console.log('  node test-expo-notification.js "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]" "Привет!" "Как дела?"');
  console.log('');
  console.log('Получите Expo Push Token из приложения и используйте его здесь.');
  process.exit(1);
}

const token = args[0];
const title = args[1] || 'Тестовое уведомление';
const body = args[2] || 'Это тестовое сообщение из скрипта';

console.log('Отправка уведомления через Expo Push API...');
console.log(`Token: ${token}`);
console.log(`Title: ${title}`);
console.log(`Body: ${body}`);
console.log('');

sendExpoNotification(token, title, body);
