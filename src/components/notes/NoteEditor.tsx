import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { useDateStore } from '../../store/useDateStore';
import { useNoteStore } from '../../store/useNoteStore';
import { styles } from './styles';

export default function NoteEditor() {
  const { t } = useTranslation();
  
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

    setSaveStatus(t('notes.saving'));
    
    // Espera o usuário parar de digitar por 1 segundo (1000ms) para salvar
    const timeoutId = setTimeout(async () => {
      await saveNote(selectedDate, text);
      setSaveStatus(t('notes.saved'));
      
      // Apaga o "Salvo ✔️" depois de 2 segundos para manter a tela limpa
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);

    // Se ele voltar a digitar antes de 1 segundo, cancela o salvamento anterior
    return () => clearTimeout(timeoutId);
  }, [text, selectedDate, t]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('notes.title')}</Text>
        <Text style={styles.status}>{saveStatus}</Text>
      </View>
      
      <TextInput
        style={styles.input}
        multiline
        placeholder={t('notes.placeholder')}
        placeholderTextColor="#555"
        value={text}
        onChangeText={setText}
        textAlignVertical="top"
      />
    </KeyboardAvoidingView>
  );
}