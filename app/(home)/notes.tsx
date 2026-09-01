import React from 'react';
import { StyleSheet, View } from 'react-native';
import NoteEditor from '../../src/components/notes/NoteEditor';

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      <NoteEditor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});