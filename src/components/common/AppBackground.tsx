import React from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { theme } from '../../theme/theme';

interface Props {
  children: React.ReactNode;
}

export const AppBackground: React.FC<Props> = ({ children }) => {
  return (
    <ImageBackground
      source={theme.assets.backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Optional dark ambient tint overlay to preserve high contrast for text */}
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: theme.colors.background, // Fallback while image loads
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 8, 19, 0.45)', // Tint allows glass cards to blur and pop
  },
});