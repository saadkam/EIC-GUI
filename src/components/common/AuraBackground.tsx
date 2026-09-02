/*********************************************************************
 * 
 * 
 *    Redundant via AppBackground
 * 
 * 
 */



import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

interface Props {
  children: React.ReactNode;
}

export const AuraBackground: React.FC<Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Dynamic Aura Ambient Lighting Mesh */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            {/* Top-Left Violet Aura */}
            <RadialGradient id="violetAura" cx="15%" cy="20%" r="45%">
              <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.28" />
              <Stop offset="60%" stopColor="#4F46E5" stopOpacity="0.12" />
              <Stop offset="100%" stopColor="#0A0612" stopOpacity="0" />
            </RadialGradient>

            {/* Center-Right Cyan Glow */}
            <RadialGradient id="cyanAura" cx="85%" cy="30%" r="40%">
              <Stop offset="0%" stopColor="#06B6D4" stopOpacity="0.22" />
              <Stop offset="55%" stopColor="#0891B2" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#0A0612" stopOpacity="0" />
            </RadialGradient>

            {/* Bottom-Center Emerald Flow */}
            <RadialGradient id="emeraldAura" cx="50%" cy="85%" r="50%">
              <Stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <Stop offset="70%" stopColor="#047857" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#0A0612" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Rect x="0" y="0" width="100%" height="100%" fill="#090514" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#violetAura)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#cyanAura)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#emeraldAura)" />
        </Svg>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090514',
  },
  content: {
    flex: 1,
  },
});