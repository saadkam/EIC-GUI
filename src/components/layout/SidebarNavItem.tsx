import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const IconComponent = item.icon;
  return (
    <TouchableOpacity
      style={[
        styles.navItem,
        !isExpanded && styles.collapsedNavItem,
        isActive && styles.activeNavItem,
      ]}
      onPress={() => onSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {IconComponent && <IconComponent size={27} />}
      </View>
      {isExpanded && (
        <Text
          numberOfLines={1}
          style={[styles.navText, isActive && styles.activeNavText]}
        >
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    minHeight: 44,
  },
  collapsedNavItem: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  activeNavItem: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSizeMd,
    fontWeight: theme.typography.fontWeightMedium,
    marginLeft: 12,
  },
  activeNavText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeightBold,
  },
});