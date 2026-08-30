import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    color: '#888888',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    position: 'relative',
    height: 50,
    justifyContent: 'center',
  },
  animatedInput: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  borderBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(221, 221, 221, 0.15)',
  },
  borderAnimated: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  checkbox: {
    marginRight: 16,
  },
  taskTitle: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  taskTitleCompleted: {
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    color: '#555555',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  clearButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
  },
  clearButtonText: {
    color: '#888888',
    marginLeft: 8,
    fontSize: 16,
  },
});