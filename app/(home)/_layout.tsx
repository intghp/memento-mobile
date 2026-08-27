import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function HomeLayout() {
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.calendarPlaceholder}>
        <Text style={styles.calendarTitle}>Memento</Text>
        <Text style={styles.calendarSubtitle}>Calendário Horizontal</Text>
      </View>

      {/* AS 3 ABAS DESLIZÁVEIS */}
      <TopTabs
        initialRouteName="index" // Começa na tela do meio (Hábitos)
        screenOptions={{
          tabBarStyle: { backgroundColor: '#121212' },
          tabBarIndicatorStyle: { backgroundColor: '#ffffff', height: 3 },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
        }}
      >
        <TopTabs.Screen name="tasks" options={{ title: 'Tarefas' }} />
        <TopTabs.Screen name="index" options={{ title: 'Hábitos' }} />
        <TopTabs.Screen name="notes" options={{ title: 'Notas' }} />
      </TopTabs>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  calendarPlaceholder: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#121212',
  },
  calendarTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff' },
  calendarSubtitle: { fontSize: 14, color: '#888888', marginTop: 4 },
});