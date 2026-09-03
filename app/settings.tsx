import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Cloud, HelpCircle, Info, Mail, Settings } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();

  const MenuItem = ({ icon: Icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Icon color="#888888" size={22} />
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight color="#444444" size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* GRUPO 1: APLICATIVO */}
        <Text style={styles.sectionTitle}>Aplicativo</Text>
        <View style={styles.sectionGroup}>
          <MenuItem 
            icon={Settings} 
            title="Preferências" 
            subtitle="Cores, temas e comportamentos"
            onPress={() => console.log('Preferências')} 
          />
          <View style={styles.divider} />
          <MenuItem 
            icon={Cloud} 
            title="Backup e Sincronização" 
            subtitle="Último backup: Hoje, 14:30"
            onPress={() => console.log('Backup')} 
          />
        </View>

        {/* GRUPO 2: SUPORTE */}
        <Text style={styles.sectionTitle}>Suporte</Text>
        <View style={styles.sectionGroup}>
          <MenuItem 
            icon={HelpCircle} 
            title="FAQ" 
            subtitle="Perguntas frequentes"
            onPress={() => console.log('FAQ')} 
          />
          <View style={styles.divider} />
          <MenuItem 
            icon={Mail} 
            title="Contatos" 
            subtitle="Fale com os desenvolvedores"
            onPress={() => console.log('Contatos')} 
          />
        </View>

        {/* GRUPO 3: SOBRE */}
        <Text style={styles.sectionTitle}>Sobre</Text>
        <View style={styles.sectionGroup}>
          <MenuItem 
            icon={Info} 
            title="Sobre o Memento" 
            subtitle="Versão 1.0.0"
            onPress={() => console.log('Sobre')} 
          />
        </View>

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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#121212',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 24,
    marginLeft: 8,
  },
  sectionGroup: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    marginLeft: 16,
  },
  menuItemTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    color: '#888888',
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginLeft: 54,
  }
});