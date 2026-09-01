import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  status: {
    color: '#888888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  input: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 18,
    lineHeight: 28,
  }
});