import { useRouter } from 'expo-router';
import {
  ArrowLeft, Bell, ChevronRight, Clock,
  DownloadCloud, FileText, Globe, Info, Moon,
  Smartphone, Trash2, UploadCloud
} from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUPPORTED_LANGUAGES } from '../src/locales';
import { useSettingsStore } from '../src/store/useSettingsStore';

export default function SettingsScreen() {
  const { 
    notificationsEnabled, setNotificationsEnabled,
    hapticsEnabled, setHapticsEnabled,
    notificationTime,
    setLanguage
  } = useSettingsStore();
  const router = useRouter();
  
  // Tradiução
  const { t, i18n } = useTranslation();

  // Função para trocar idioma no clique
  const toggleLanguage = () => {
    const langCodes = Object.keys(SUPPORTED_LANGUAGES);
    const currentIndex = langCodes.indexOf(i18n.language);
    const nextLang = langCodes[(currentIndex + 1) % langCodes.length] || 'en';
    
    i18n.changeLanguage(nextLang);
    setLanguage(nextLang);
  };

  // Componente reutilizável para cada linha de configuração
  const SettingItem = ({ icon: Icon, title, value, isToggle, toggleValue, onToggle, onPress, isDestructive, disabled }: any) => (
    <TouchableOpacity 
      style={[styles.settingItem, disabled && { opacity: 0.5 }]} 
      onPress={onPress} 
      activeOpacity={isToggle ? 1 : 0.7}
      disabled={isToggle || disabled}
    >
      <View style={styles.itemLeft}>
        <Icon color={isDestructive ? "#FF5252" : "#888888"} size={22} strokeWidth={2} />
        <Text style={[styles.itemTitle, isDestructive && styles.itemDestructive]}>
          {title}
        </Text>
      </View>

      <View style={styles.itemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        
        {isToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#2A2A2A', true: '#00E676' }}
            thumbColor={'#ffffff'}
            disabled={disabled}
          />
        ) : (
          <ChevronRight color="#444444" size={20} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SIMPLES */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* GERAL */}
        <Text style={styles.sectionLabel}>{t('settings.general')}</Text>
        
        <SettingItem 
          icon={Bell} 
          title={t('settings.daily_reminders')} 
          isToggle 
          toggleValue={notificationsEnabled}
          onToggle={setNotificationsEnabled}
        />
        
        {/* Só mostra a opção de horário se as notificações estiverem ligadas */}
        {notificationsEnabled && (
          <SettingItem 
            icon={Clock} 
            title={t('settings.reminder_time')} 
            value={notificationTime} 
            onPress={() => console.log('Abrir seletor de horário')}
          />
        )}

        <SettingItem 
          icon={Smartphone} 
          title={t('settings.haptics')} 
          isToggle 
          toggleValue={hapticsEnabled}
          onToggle={setHapticsEnabled}
        />

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionLabel}>{t('settings.appearance')}</Text>

        {/* BOTÃO QUE TROCA DE IDIOMA */}
        <SettingItem 
          icon={Globe} 
          title={t('settings.language')} 
          value={SUPPORTED_LANGUAGES[i18n.language] || SUPPORTED_LANGUAGES['en']} 
          onPress={toggleLanguage}
        />

        <SettingItem 
          icon={Moon} 
          title={t('settings.theme')} 
          value="Dark" 
          onPress={() => console.log('Abrir opções: Claro, Escuro, Sistema')}
        />

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionLabel}>{t('settings.data_backup')}</Text>
        
        <SettingItem 
          icon={UploadCloud} 
          title={t('settings.export_backup')} 
          onPress={() => console.log('Gerar arquivo de backup para restaurar depois')}
        />
        <SettingItem 
          icon={DownloadCloud} 
          title={t('settings.import_backup')} 
          onPress={() => console.log('Restaurar dados de um arquivo')}
        />
        <SettingItem 
          icon={FileText} 
          title={t('settings.export_csv')} 
          onPress={() => console.log('Gerar CSV para o Excel')}
        />
        <SettingItem 
          icon={Trash2} 
          title={t('settings.delete_all')} 
          isDestructive
          onPress={() => console.log('Alerta de exclusão extrema')}
        />

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionLabel}>{t('settings.info')}</Text>
        
        <SettingItem 
          icon={Info} 
          title={t('settings.about')} 
          onPress={() => console.log('Abrir tela Sobre')}
        />
        
        <Text style={styles.versionText}>{t('settings.version')} 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  
  // TÍTULO DAS SEÇÕES
  sectionLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 8,
  },

  // ITEM DE CONFIGURAÇÃO (FLAT)
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    color: '#E0E0E0',
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  itemDestructive: {
    color: '#FF5252',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    color: '#888888',
    fontSize: 14,
    marginRight: 8,
  },

  // DIVISORES
  sectionDivider: {
    height: 1,
    backgroundColor: '#1A1A1A',
    marginTop: 16,
  },

  // RODAPÉ
  versionText: {
    textAlign: 'center',
    color: '#444444',
    fontSize: 12,
    marginTop: 40,
    fontWeight: '500',
    letterSpacing: 0.5,
  }
});