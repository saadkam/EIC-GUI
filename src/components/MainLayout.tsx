import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Sidebar } from './layout/Sidebar';
import { MainLayoutProps } from '../types/navigation';
import { theme } from '../theme/theme';

export default function MainLayout({ children, activeScreen, onNavigate }: MainLayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>
        <Sidebar activeScreen={activeScreen} onNavigate={onNavigate} />
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
  contentArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});