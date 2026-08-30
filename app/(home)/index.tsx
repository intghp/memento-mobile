import React from 'react';
import { StyleSheet, View } from 'react-native';
import HabitList from '../../src/components/habits/HabitList';

export default function HabitsScreen() {
  return (
    <View style={styles.container}>
      <HabitList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});