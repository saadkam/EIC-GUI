import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
  Pressable,
} from 'react-native';

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

  // Handles expanding/collapsing the sidebar smoothly
  const toggleSidebar = () => {
    Animated.timing(sidebarWidthAnim, {
      toValue: isExpanded ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      duration: 200,
      useNativeDriver: false, // Layout widths require JS driver
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
        {/* --- PERSISTENT SIDEBAR RAIL --- */}
        <Animated.View style={[styles.sidebar, { width: sidebarWidthAnim }]}>
          {/* Header Toggle Button */}
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.menuIconButton}>
              <Text style={styles.menuIconText}>☰</Text>
            </TouchableOpacity>
            {isExpanded && <Text style={styles.brandTitle}>FormulaFlow</Text>}
          </View>

          {/* Navigation Items */}
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

        {/* --- MAIN CONTENT AREA --- */}
        <View style={styles.contentArea}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#1E293B',
    borderRightWidth: 1,
    borderRightColor: '#334155',
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
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  menuIconText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 8,
  },
  activeNavItem: {
    //backgroundColor: '#3B82F6', old nav
    backgroundColor: '#38BDF8',
  },
  navIcon: {
    fontSize: 20,
    width: 30,
    textAlign: 'center',
  },
  navText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  activeNavText: {
    color: '#FFF',
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#180227',
  },
});