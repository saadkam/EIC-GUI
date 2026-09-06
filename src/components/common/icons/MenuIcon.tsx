import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export interface IconProps {
  size?: number;
}

// 1. Dashboard Chart / Pie Duotone Icon
export const DashboardIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* Translucent Duotone Fill */}
      <Path
        d="M224,128a96,96,0,0,1-96,96V168a40,40,0,0,0,0-80V32A96,96,0,0,1,224,128Z"
        fill="rgba(6, 182, 212, 0.35)"
      />
      {/* Primary Solid Outline */}
      <Path
        d="M128,24a8,8,0,0,0-8,8V88a8,8,0,0,0,8,8,32,32,0,1,1-27.72,16,8,8,0,0,0-2.93-10.93l-48.5-28A8,8,0,0,0,37.92,76,104,104,0,1,0,128,24ZM48.09,91.1,83,111.26A48.09,48.09,0,0,0,80,128c0,1.53.08,3,.22,4.52L41.28,143A88.16,88.16,0,0,1,48.09,91.1Zm-2.67,67.31,39-10.44A48.1,48.1,0,0,0,120,175.32v40.31A88.2,88.2,0,0,1,45.42,158.41ZM136,215.63V175.32a48,48,0,0,0,0-94.65V40.36a88,88,0,0,1,0,175.27Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const HamburgerIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* 1. Translucent Background Layer (from path with opacity="0.2") */}
      <Path
        d="M216,64V192H40V64Z"
        fill="rgba(241, 249, 250, 0.35)"
      />

      {/* 2. Primary Foreground Layer (solid path) */}
      <Path
        d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const RupeeIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      {/* 1. Translucent Accent / Duotone Backdrop */}
      {/* Soft pill behind the letterhead and glow behind the period */}
      <Rect
        x="28"
        y="52"
        width="96"
        height="80"
        rx="16"
        fill="rgba(6, 182, 212, 0.28)"
      />
      <Circle
        cx="228"
        cy="188"
        r="20"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Primary Foreground Tone: Capital "R" */}
      <Path
        d="M44,48 H108 C132,48 148,62 148,84 C148,104 134,118 112,122 L152,196 H124 L88,126 H68 V196 H44 Z M68,70 V106 H104 C118,106 124,98 124,88 C124,78 118,70 104,70 Z"
        fill="#06B6D4"
      />

      {/* 3. Primary Foreground Tone: Lowercase "s" */}
      <Path
        d="M208,126 L194,136 C188,128 178,124 168,124 C156,124 148,130 148,138 C148,146 156,150 172,154 C194,160 208,168 208,184 C208,202 188,212 166,212 C146,212 132,204 124,192 L138,182 C144,192 154,196 166,196 C176,196 184,192 184,184 C184,176 176,172 160,168 C138,162 126,154 126,138 C126,122 142,110 168,110 C186,110 198,116 208,126 Z"
        fill="#06B6D4"
      />

      {/* 4. Primary Foreground Tone: Period Dot "." */}
      <Circle
        cx="228"
        cy="188"
        r="10"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const FlaskIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* 1. Translucent Liquid Fill Layer (from path with opacity="0.2") */}
      <Path
        d="M208,216H48a8,8,0,0,1-6.86-12.12l30.48-50.8h0c13.23-2.48,32-1.41,56.37,10.92,32.25,16.33,54.75,12.91,67.5,7.65h0l19.34,32.23A8,8,0,0,1,208,216Z"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Primary Foreground Outline & Measurement Marks */}
      <Path
        d="M221.69,199.77,160,96.92V40h8a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16h8V96.92L34.31,199.77A16,16,0,0,0,48,224H208a16,16,0,0,0,13.72-24.23ZM110.86,103.25A7.93,7.93,0,0,0,112,99.14V40h32V99.14a7.93,7.93,0,0,0,1.14,4.11L183.36,167c-12,2.37-29.07,1.37-51.75-10.11-15.91-8.05-31.05-12.32-45.22-12.81ZM48,208l28.54-47.58c14.25-1.73,30.31,1.85,47.82,10.72,19,9.61,35,12.88,48,12.88a69.89,69.89,0,0,0,19.55-2.7L208,208Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const FactoryIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* 1. Translucent Background Layer (from path with opacity="0.2") */}
      <Path
        d="M216,136v80H40V88l64,48V88l64,48Z"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Primary Foreground Outline & Details */}
      <Path
        d="M116,176a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h28A8,8,0,0,1,116,176Zm60-8H148a8,8,0,0,0,0,16h28a8,8,0,0,0,0-16Zm64,48a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16h8V88a8,8,0,0,1,12.8-6.4L96,120V88a8,8,0,0,1,12.8-6.4l38.74,29.05L159.1,29.74A16.08,16.08,0,0,1,174.94,16h18.12A16.08,16.08,0,0,1,208.9,29.74l15,105.13s.08.78.08,1.13v72h8A8,8,0,0,1,240,216Zm-77.86-94.4,8.53,6.4h36.11L193.06,32H174.94ZM48,208H208V144H168a8,8,0,0,1-4.8-1.6l-14.4-10.8,0,0L112,104v32a8,8,0,0,1-12.8,6.4L48,104Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};


export const InventoryIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 1. Translucent Duotone Fill Layers (Internal storage boxes & tiers) */}
      <Rect
        x="6"
        y="4"
        width="12"
        height="4"
        fill="rgba(6, 182, 212, 0.35)"
      />
      <Rect
        x="6"
        y="14"
        width="6"
        height="6"
        fill="rgba(6, 182, 212, 0.35)"
      />
      <Rect
        x="14"
        y="16"
        width="4"
        height="4"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Primary Foreground Structural Racks & Outlines */}
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1V23C0 23.5523 0.447715 24 1 24C1.55228 24 2 23.5523 2 23V22H22V23C22 23.5523 22.4477 24 23 24C23.5523 24 24 23.5523 24 23V1C24 0.447715 23.5523 0 23 0C22.4477 0 22 0.447715 22 1V8H20V3C20 2.44772 19.5523 2 19 2H11C10.4477 2 10 2.44772 10 3V4H5C4.44772 4 4 4.44772 4 5V8H2V1ZM10 6H6V8H10V6ZM2 10V20H4V13C4 12.4477 4.44772 12 5 12H13C13.5523 12 14 12.4477 14 13V14H19C19.5523 14 20 14.4477 20 15V20H22V10H2ZM18 8V4H12V8H18ZM12 20H6V14H12V20ZM14 20V16H18V20H14Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const LedgerIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* 1. Translucent Right-Page Fill (from path with opacity="0.2") */}
      <Path
        d="M232,56V200H160a32,32,0,0,0-32,32V88a32,32,0,0,1,32-32Z"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Primary Foreground Outline & Journal Lines */}
      <Path
        d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64ZM160,88h40a8,8,0,0,1,0,16H160a8,8,0,0,1,0-16Zm48,40a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,128Zm0,32a8,8,0,0,1-8,8H160a8,8,0,0,1,0-16h40A8,8,0,0,1,208,160Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const ChallanIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* 1. Translucent Sheet Fill (from path with opacity="0.2") */}
      <Path
        d="M224,56V200a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Primary Foreground Frame & Content Lines */}
      <Path
        d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const DeliveryChallanIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* 1. Translucent Duotone Fill: Background Challan Sheet + Truck Cargo Bay */}
      <Path
        d="M200,40H56A16,16,0,0,0,40,56V168a8,8,0,0,0,8,8H76v-8a8,8,0,0,1,8-8h8a8,8,0,0,1,8,8v8h8a8,8,0,0,0,8-8V118a8,8,0,0,1,8-8h84a8,8,0,0,0,8-8V56A16,16,0,0,0,200,40ZM168,88H72a8,8,0,0,1,0-16h96a8,8,0,0,1,0,16Z"
        fill="rgba(6, 182, 212, 0.35)"
      />
      <Path
        d="M106,108h64a0,0,0,0,1,0,0v39a11,11,0,0,1-11,11H117a11,11,0,0,1-11-11v-39A0,0,0,0,1,106,108Z"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Solid Foreground: Background Challan Frame & Header Lines */}
      <Path
        d="M200,32H56A24,24,0,0,0,32,56V192a24,24,0,0,0,24,24h20a8,8,0,0,0,0-16H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8v44a8,8,0,0,0,16,0V56A24,24,0,0,0,200,32ZM72,88h96a8,8,0,0,0,0-16H72a8,8,0,0,0,0,16Z"
        fill="#06B6D4"
      />

      {/* 3. Solid Foreground: Enlarged Delivery Truck in Front */}
      <Path
        d="M31.41,17l-1.54-1.54-1.69-5.09A2,2,0,0,0,26.28,9H20V7a3,3,0,0,0-3-3H3A3,3,0,0,0,0,7V22a3,3,0,0,0,3,3H4.14a4,4,0,1,0,0-2H3a1,1,0,0,1-1-1V7A1,1,0,0,1,3,6H17a1,1,0,0,1,1,1V23H15a1,1,0,0,0,0,2h6.14a4,4,0,0,0,7.72,0H30a2,2,0,0,0,2-2V18.41A2,2,0,0,0,31.41,17ZM8,22a2,2,0,1,1-2,2A2,2,0,0,1,8,22Zm19.61-7H24V11h2.28ZM25,26a2,2,0,1,1,2-2A2,2,0,0,1,25,26Zm5-3H28.86a4,4,0,0,0-7.72,0H20V11h2v5a1,1,0,0,0,1,1h5.59L30,18.41Z"
        transform="translate(68, 70) scale(5.8)"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const OrderCartIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 115.35 122.88" fill="none">
      {/* 1. Translucent Sheet Accent (Duotone Fill) */}
      <Rect
        x="7.57"
        y="7.59"
        width="85.63"
        height="98.67"
        rx="2"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Solid Primary Geometry (Cart, Wheels, Document Frame) */}
      <Path
        d="M25.27,86.92c-1.81,0-3.26-1.46-3.26-3.26s1.47-3.26,3.26-3.26h21.49c1.81,0,3.26,1.46,3.26,3.26s-1.46,3.26-3.26,3.26 H25.27L25.27,86.92L25.27,86.92z M61.1,77.47c-0.96,0-1.78-0.82-1.78-1.82c0-0.96,0.82-1.78,1.78-1.78h4.65c0.04,0,0.14,0,0.18,0 c1.64,0.04,3.1,0.36,4.33,1.14c1.37,0.87,2.37,2.19,2.92,4.15c0,0.04,0,0.09,0.05,0.14l0.46,1.82h39.89c1,0,1.78,0.82,1.78,1.78 c0,0.18-0.05,0.36-0.09,0.55l-4.65,18.74c-0.18,0.82-0.91,1.37-1.73,1.37l0,0l-29.18,0c0.64,2.37,1.28,3.65,2.14,4.24 c1.05,0.68,2.87,0.73,5.93,0.68h0.04l0,0h20.61c1,0,1.78,0.82,1.78,1.78c0,1-0.82,1.78-1.78,1.78H87.81l0,0 c-3.79,0.04-6.11-0.05-7.98-1.28c-1.92-1.28-2.92-3.46-3.92-7.43l0,0L69.8,80.2c0-0.05,0-0.05-0.04-0.09 c-0.27-1-0.73-1.69-1.37-2.05c-0.64-0.41-1.5-0.59-2.51-0.59c-0.05,0-0.09,0-0.14,0H61.1L61.1,77.47L61.1,77.47z M103.09,114.13 c2.42,0,4.38,1.96,4.38,4.38s-1.96,4.38-4.38,4.38s-4.38-1.96-4.38-4.38S100.67,114.13,103.09,114.13L103.09,114.13L103.09,114.13z M83.89,114.13c2.42,0,4.38,1.96,4.38,4.38s-1.96,4.38-4.38,4.38c-2.42,0-4.38-1.96-4.38-4.38S81.48,114.13,83.89,114.13 L83.89,114.13L83.89,114.13z M25.27,33.58c-1.81,0-3.26-1.47-3.26-3.26c0-1.8,1.47-3.26,3.26-3.26h50.52 c1.81,0,3.26,1.46,3.26,3.26c0,1.8-1.46,3.26-3.26,3.26H25.27L25.27,33.58L25.27,33.58z M7.57,0h85.63c2.09,0,3.99,0.85,5.35,2.21 s2.21,3.26,2.21,5.35v59.98h-6.5V7.59c0-0.29-0.12-0.56-0.31-0.76c-0.2-0.19-0.47-0.31-0.76-0.31l0,0H7.57 c-0.29,0-0.56,0.12-0.76,0.31S6.51,7.3,6.51,7.59v98.67c0,0.29,0.12,0.56,0.31,0.76s0.46,0.31,0.76,0.31h55.05 c0.61,2.39,1.3,4.48,2.23,6.47H7.57c-2.09,0-3.99-0.85-5.35-2.21C0.85,110.24,0,108.34,0,106.25V7.57c0-2.09,0.85-4,2.21-5.36 S5.48,0,7.57,0L7.57,0L7.57,0z M25.27,60.25c-1.81,0-3.26-1.46-3.26-3.26s1.47-3.26,3.26-3.26h50.52c1.81,0,3.26,1.46,3.26,3.26 s-1.46,3.26-3.26,3.26H25.27L25.27,60.25L25.27,60.25z"
        fill="#06B6D4"
      />
    </Svg>
  );
};

export const InvoiceIcon: React.FC<IconProps> = ({ size = 20 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      {/* 1. Translucent Duotone Fill Layer (from path with opacity="0.2") */}
      <Path
        d="M224,104v88a8,8,0,0,1-8,8H168V104Z"
        fill="rgba(6, 182, 212, 0.35)"
      />

      {/* 2. Primary Foreground Outline & Drawers */}
      <Path
        d="M28,128a8,8,0,0,1,0-16H56a8,8,0,0,0,0-16H40a24,24,0,0,1,0-48,8,8,0,0,1,16,0h8a8,8,0,0,1,0,16H40a8,8,0,0,0,0,16H56a24,24,0,0,1,0,48,8,8,0,0,1-16,0ZM232,56V192a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v40H160V160H80a8,8,0,0,1,0-16h80V112H104a8,8,0,0,1,0-16H216V64H96a8,8,0,0,1,0-16H224A8,8,0,0,1,232,56Zm-56,88h40V112H176Zm40,48V160H176v32Z"
        fill="#06B6D4"
      />
    </Svg>
  );
};
// You can add more menu icons directly below as you extract them:
// export const PricesDuotoneIcon: React.FC<IconProps> = ({ size = 20 }) => ( ... );
// export const FormulasDuotoneIcon: React.FC<IconProps> = ({ size = 20 }) => ( ... );