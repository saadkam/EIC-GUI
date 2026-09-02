import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export type IconName = 'menu' | 'close' | 'minimize' | 'restore' | 'logout';

export interface IconProps {
  name?: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const AppIcon: React.FC<IconProps> = ({
  name = 'menu',
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => {
  const renderPath = () => {
    switch (name) {
      // Hamburger Menu (3 horizontal lines)
      case 'menu':
        return (
          <Path
            d="M4 6H20M4 12H20M4 18H20"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      // Close / Dismiss Cross (X)
      case 'close':
        return (
          <Path
            d="M18 6L6 18M6 6L18 18"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      // Minimize (Windows desktop titlebar style underline)
      case 'minimize':
        return (
          <Path
            d="M4 14H20"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );

      // Restore / Maximize (Overlapping windows / square outline)
      case 'restore':
        return (
          <>
            {/* Background window */}
            <Path
              d="M8 4H18C19.1046 4 20 4.89543 20 6V16"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Foreground window */}
            <Rect
              x="4"
              y="8"
              width="12"
              height="12"
              rx="1.5"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      // Logout / Sign Out (Door frame with exiting directional arrow)
      case 'logout':
        return (
          <Path
            d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {renderPath()}
    </Svg>
  );
};

// Backwards compatibility alias for MenuIcon
export const MenuIcon: React.FC<Omit<IconProps, 'name'>> = (props) => (
  <AppIcon name="menu" {...props} />
);