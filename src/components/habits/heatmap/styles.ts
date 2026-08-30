import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  heatmapModalOverlay: {
    flex: 1,
    backgroundColor: '#121212',
  },
  heatmapModalContent: {
    flex: 1,
    backgroundColor: '#121212',
  },
  heatmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  heatmapCloseBtn: {
    padding: 8,
  },
  heatmapTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heatmapTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  heatmapStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 40,
  },
  heatmapStatBox: {
    justifyContent: 'center',
  },
  heatmapStatLabel: {
    color: '#666666',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heatmapStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  heatmapWrapper: {
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 12,
    marginTop: 8,
  },
  monthsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    height: 20,
  },
  monthLabelContainer: {
    width: 32, 
  },
  monthLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 4,
  },
  heatmapColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  heatmapSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapSquareText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  heatmapDayLabels: {
    marginLeft: 12,
    flexDirection: 'column',
    gap: 4,
    marginTop: 28, 
  },
  heatmapDayLabelText: {
    height: 28,
    textAlignVertical: 'center',
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
});