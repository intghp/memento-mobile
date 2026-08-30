import React from 'react';
import { StyleSheet, View } from 'react-native';
import TasksList from '../../src/components/tasks/TaskList';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <TasksList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});