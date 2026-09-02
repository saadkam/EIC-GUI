import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavItem } from '../../types/navigation';
import { theme } from '../../theme/theme';

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onSelect: (id: string) => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  isExpanded,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[styles.navItem, isActive && styles.activeNavItem]}
      onPress={() => onSelect(item.id)}
    >
      <Text style={styles.navIcon}>{item.icon}</Text>
      {isExpanded && (
        <Text style={[styles.navText, isActive && styles.activeNavText]}>
          {item.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 8,
    marginTop: theme.spacing.lg,
  },
  activeNavItem: {
    backgroundColor: theme.colors.primary,
  },
  navIcon: {
    fontSize: 20,
    width: 30,
    textAlign: 'center',
  },
  navText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSizeMd,
    fontWeight: theme.typography.fontWeightNormal,
    marginLeft: 12,
  },
  activeNavText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeightBold,
  },
});