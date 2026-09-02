import { AppBackground } from '../components/common/AppBackground';
import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Sidebar } from './layout/Sidebar';
import { MainLayoutProps } from '../types/navigation';
import { theme } from '../theme/theme';

export default function MainLayout({ children, activeScreen, onNavigate }: MainLayoutProps) {
  return (
    <AppBackground>
    <SafeAreaView style={styles.container}>
        <View style={styles.shell}>
          <Sidebar activeScreen={activeScreen} onNavigate={onNavigate} />
          <View style={styles.contentArea}>{children}</View>
        </View>
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure container does not block the JPEG image
    padding: 0,
    
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});