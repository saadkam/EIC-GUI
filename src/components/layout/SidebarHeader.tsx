import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';
import { MenuIcon } from '../common/icons/MenuIcon';

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isExpanded, onToggle }) => {
  return (
    <View style={styles.sidebarHeader}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.menuIconButton}
        activeOpacity={0.7}
      >
        <MenuIcon size={18} color={theme.colors.textPrimary} />
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
    marginTop: 10,
    paddingHorizontal: 5,
  },
  menuIconButton: {
    padding: theme.spacing.sm,
    borderRadius: 6,
    backgroundColor: theme.colors.sidebarBorder,
    alignItems: 'center',
    justifyContent: 'center',
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