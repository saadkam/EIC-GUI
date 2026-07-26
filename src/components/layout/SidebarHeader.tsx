import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isExpanded, onToggle }) => {
  return (
    <View style={styles.sidebarHeader}>
      <TouchableOpacity onPress={onToggle} style={styles.menuIconButton}>
        <Text style={styles.menuIconText}>☰</Text>
      </TouchableOpacity>
      {isExpanded && <Text style={styles.brandTitle}>FormulaFlow</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  menuIconButton: {
    padding: theme.spacing.sm,
    borderRadius: 6,
    backgroundColor: theme.colors.sidebarBorder,
  },
  menuIconText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeLg,
    fontWeight: theme.typography.fontWeightBold,
  },
  brandTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizeLg,
    fontWeight: theme.typography.fontWeightBold,
    marginLeft: 15,
  },
});