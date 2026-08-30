import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar'; // <-- Adicionado aqui
import * as SystemUI from 'expo-system-ui';
import React, { useEffect, useState } from 'react';
import { initDB } from '../src/database/db';

// Impede que a tela de carregamento (Splash Screen) suma sozinha
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isDbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. O App liga e manda criar/conectar o Banco de Dados
        await initDB();
        await SystemUI.setBackgroundColorAsync('#121212');
      } catch (error) {
        console.error("Erro fatal ao carregar o app:", error);
      } finally {
        // 2. Quando o banco estiver pronto, o app é liberado
        setDbReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Enquanto o banco não estiver pronto, não desenha nenhuma tela por baixo
  if (!isDbReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
      </Stack>
    </>
  );
}