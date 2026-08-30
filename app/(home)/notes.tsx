import React from 'react';
import { StyleSheet, View } from 'react-native';
import NotesList from '../../src/components/notes/NotesList';

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      <NotesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});