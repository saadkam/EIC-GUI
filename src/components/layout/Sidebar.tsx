import React, { useState, useRef } from 'react';
import { StyleSheet, Animated, ScrollView } from 'react-native';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavItem } from './SidebarNavItem';
import { NAV_ITEMS } from '../../constants/navigationItems';
import { theme } from '../../theme/theme';

const COLLAPSED_WIDTH = 70;
const EXPANDED_WIDTH = 220;

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screenId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarWidthAnim = useRef(new Animated.Value(COLLAPSED_WIDTH)).current;

  const toggleSidebar = () => {
    Animated.timing(sidebarWidthAnim, {
      toValue: isExpanded ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View style={[styles.sidebar, { width: sidebarWidthAnim }]}>
      <SidebarHeader isExpanded={isExpanded} onToggle={toggleSidebar} />

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            isActive={activeScreen === item.id}
            isExpanded={isExpanded}
            onSelect={onNavigate}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    borderRightWidth: 1,
    borderRightColor: theme.colors.sidebarBorder,
    paddingLeft: 20,
    marginLeft: 0,
    backgroundColor: theme.colors.surface,
    paddingTop: 15,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  menuList: {
    flex: 1,
  },
});