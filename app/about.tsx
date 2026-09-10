import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Code,
  ExternalLink,
  GitBranch,
  Mail,
  Monitor,
  ShieldCheck
} from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const openEmail = () => {
    Linking.openURL('mailto:memento.app.suporte@gmail.com?subject=Contato%20Memento');
  };

  const openGithub = () => {
    Linking.openURL('https://github.com/intghp/memento-mobile');
  };

  const openDesktopRepo = () => {
    Linking.openURL('https://github.com/intghp/memento'); 
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      t('about.privacy_title'),
      t('about.privacy_message')
    );
  };

  const showLicenses = () => {
    Alert.alert(
      t('about.opensource_title'),
      t('about.opensource_message')
    );
  };

  const ActionItem = ({ icon: Icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionIcon}>
        <Icon color="#ffffff" size={20} />
      </View>
      <View style={styles.actionTextContainer}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
      </View>
      <ExternalLink color="#444444" size={16} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('about.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.brandingContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.appName}>Memento</Text>
          <Text style={styles.appVersion}>{t('about.version')} 1.0.0</Text>
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionLabel}>{t('about.useful_links')}</Text>
        <ActionItem 
          icon={Monitor} 
          title={t('about.desktop_title')} 
          subtitle={t('about.desktop_subtitle')}
          onPress={openDesktopRepo}
        />
        <ActionItem 
          icon={GitBranch} 
          title={t('about.github_title')} 
          subtitle={t('about.github_subtitle')}
          onPress={openGithub}
        />
        <ActionItem 
          icon={Mail} 
          title={t('about.contact_title')} 
          subtitle={t('about.contact_subtitle')}
          onPress={openEmail}
        />

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionLabel}>{t('about.legal')}</Text>
        <ActionItem 
          icon={ShieldCheck} 
          title={t('about.privacy_title')} 
          subtitle={t('about.privacy_subtitle')}
          onPress={showPrivacyPolicy}
        />
        <ActionItem 
          icon={Code} 
          title={t('about.opensource_title')} 
          subtitle={t('about.opensource_subtitle')}
          onPress={showLicenses}
        />

        <Text style={styles.footerText}>
          {t('about.footer')}
          © {new Date().getFullYear()} Memento
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  scrollContent: { paddingBottom: 60 },
  
  brandingContainer: { alignItems: 'center', paddingHorizontal: 32, marginTop: 24, marginBottom: 16 },
  logoPlaceholder: { width: 72, height: 72, backgroundColor: '#2A2A2A', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoText: { color: '#00E676', fontSize: 36, fontWeight: 'bold' },
  appName: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  appVersion: { color: '#888888', fontSize: 14, fontWeight: '500', marginBottom: 16 },
  
  sectionLabel: { color: '#666666', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2, paddingHorizontal: 24, marginTop: 24, marginBottom: 8 },
  sectionDivider: { height: 1, backgroundColor: '#1A1A1A', marginTop: 16 },
  
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24, backgroundColor: '#121212' },
  actionIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  actionTextContainer: { flex: 1, marginRight: 16 },
  actionTitle: { color: '#E0E0E0', fontSize: 16, fontWeight: '500', marginBottom: 2 },
  actionSubtitle: { color: '#888888', fontSize: 12 },
  
  footerText: { textAlign: 'center', color: '#444444', fontSize: 12, marginTop: 48, lineHeight: 18, fontWeight: '500' }
});