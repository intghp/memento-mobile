import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, NativeModules } from 'react-native';
import { db } from '../database/db';

export const exportBackup = async (t: any) => {
  try {
    const tasks = await db.getAllAsync('SELECT * FROM tasks;');
    const habits = await db.getAllAsync('SELECT * FROM habits;');
    const habitLogs = await db.getAllAsync('SELECT * FROM habit_logs;');
    const notes = await db.getAllAsync('SELECT * FROM notes;');

    const backupData = JSON.stringify({ tasks, habits, habitLogs, notes });
    const timestamp = new Date().toISOString().split('T')[0];
    const backupPath = `${FileSystem.cacheDirectory || ''}memento-backup-${timestamp}.json`;

    await FileSystem.writeAsStringAsync(backupPath, backupData);

    await Sharing.shareAsync(backupPath, {
      mimeType: 'application/json',
      dialogTitle: t('settings.export_backup'),
    });
  } catch (error) {
    Alert.alert(t('settings.error'), t('settings.export_error'));
  }
};

export const importBackup = async (t: any) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: 'application/json',
    });

    if (result.canceled) return;

    const fileUri = result.assets[0].uri;
    const fileName = result.assets[0].name;

    if (!fileName.endsWith('.json')) {
      Alert.alert(t('settings.error'), t('settings.invalid_file'));
      return;
    }

    Alert.alert(
      t('settings.warning'),
      t('settings.import_warning'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        { 
          text: t('settings.confirm'), 
          style: 'destructive',
          onPress: async () => {
            try {
              const fileContent = await FileSystem.readAsStringAsync(fileUri);
              const data = JSON.parse(fileContent);

              await db.execAsync(`
                PRAGMA foreign_keys = OFF;
                DELETE FROM tasks;
                DELETE FROM habit_logs;
                DELETE FROM habits;
                DELETE FROM notes;
                PRAGMA foreign_keys = ON;
              `);

              const insertTable = async (tableName: string, rows: any[]) => {
                if (!rows || rows.length === 0) return;
                const columns = Object.keys(rows[0]);
                const placeholders = columns.map(() => '?').join(', ');
                
                const statement = await db.prepareAsync(
                  `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`
                );
                
                try {
                  for (const row of rows) {
                    const values = columns.map(c => row[c] !== undefined ? row[c] : null);
                    await statement.executeAsync(values);
                  }
                } finally {
                  await statement.finalizeAsync();
                }
              };

              await insertTable('habits', data.habits || []);
              await insertTable('habit_logs', data.habitLogs || []);
              await insertTable('tasks', data.tasks || []);
              await insertTable('notes', data.notes || []);

              if (__DEV__ && NativeModules.DevSettings) {
                NativeModules.DevSettings.reload();
              } else {
                Alert.alert(t('settings.success'), t('settings.import_success'));
              }
            } catch (err) {
              console.error(err);
              Alert.alert(t('settings.error'), t('settings.import_error'));
            }
          }
        }
      ]
    );
  } catch (error) {
    Alert.alert(t('settings.error'), t('settings.import_error'));
  }
};