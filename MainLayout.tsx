import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native';
import { theme } from './src/theme/theme'; // Import your central theme tokens

const COLLAPSED_WIDTH = 70;
const EXPANDED_WIDTH = 220;

interface MainLayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  onNavigate: (screenId: string) => void;
}

export default function MainLayout({ children, activeScreen, onNavigate }: MainLayoutProps) {
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

  const navItems = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊' },
    { id: 'prices', title: 'Price / Unit', icon: '🏷️' },
    { id: 'formulas', title: 'Cookbook', icon: '🧪' },
    { id: 'production', title: 'Production', icon: '⚙️' },
    { id: 'inventory', title: 'Inventory', icon: '📦' },
    { id: 'ledger', title: 'Ledger', icon: '📒' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>
        {/* SIDEBAR RAIL */}
        <Animated.View style={[styles.sidebar, { width: sidebarWidthAnim }]}>
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuIconButton}>
              <Text style={styles.menuIconText}>☰</Text>
            </TouchableOpacity>
            {isExpanded && <Text style={styles.brandTitle}>FormulaFlow</Text>}
          </View>

          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navItem, isActive && styles.activeNavItem]}
                  onPress={() => onNavigate(item.id)}
                >
                  <Text style={styles.navIcon}>{item.icon}</Text>
                  {isExpanded && (
                    <Text style={[styles.navText, isActive && styles.activeNavText]}>
                      {item.title}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* MAIN CONTENT AREA */}
        <View style={styles.contentArea}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: theme.colors.sidebarBg,
    borderRightWidth: 1,
    borderRightColor: theme.colors.sidebarBorder,
    paddingTop: 15,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
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
  menuList: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
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
  contentArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});