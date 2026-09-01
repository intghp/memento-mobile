import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useDateStore } from '../../store/useDateStore';
import { useNoteStore } from '../../store/useNoteStore';
import { styles } from './styles';

export default function NoteEditor() {
  const { selectedDate } = useDateStore();
  const { currentNote, fetchNote, saveNote } = useNoteStore();
  
  const [text, setText] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Busca a nota sempre que o usuário mudar o dia no calendário
  useEffect(() => {
    fetchNote(selectedDate);
  }, [selectedDate, fetchNote]);

  // Atualiza a tela quando a nota chega do banco
  useEffect(() => {
    setText(currentNote);
    setSaveStatus('');
  }, [currentNote]);

  // AUTO-SAVE
  useEffect(() => {
    // Se o texto não mudou, não faz nada
    if (text === currentNote) return;

    setSaveStatus('Salvando...');
    
    // Espera o usuário parar de digitar por 1 segundo (1000ms) para salvar
    const timeoutId = setTimeout(async () => {
      await saveNote(selectedDate, text);
      setSaveStatus('Salvo ✔️');
      
      // Apaga o "Salvo ✔️" depois de 2 segundos para manter a tela limpa
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);

    // Se ele voltar a digitar antes de 1 segundo, cancela o salvamento anterior
    return () => clearTimeout(timeoutId);
  }, [text, selectedDate]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Diário</Text>
        <Text style={styles.status}>{saveStatus}</Text>
      </View>
      
      {/* ScrollView captura os toques verticais e libera os horizontais para a navegação */}
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={styles.input}
          multiline
          placeholder="Como foi o seu dia? O que você está sentindo?..."
          placeholderTextColor="#555"
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}