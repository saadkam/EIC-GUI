import React from 'react';

// ==========================================
// YOUR EXISTING LAYOUT TYPES (Sidebar/Menu)
// ==========================================
export interface IconProps {
  size?: number;
}

export interface NavItem {
  id: string;
  title: string;
  icon: React.ComponentType<IconProps>;
}

export interface MainLayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  onNavigate: (screenId: string) => void;
}

// ==========================================
// NEW: DOMAIN MODELS
// ==========================================
export type PartnerType = 'Customer' | 'Supplier' | 'Both';

export interface BusinessPartner {
  id: string;
  name: string;
  type: PartnerType;
  phone: string;
  ntn?: string;
  email?: string;
  billingAddress?: string;
  shippingAddress?: string;
}

// ==========================================
// NEW: REACT NAVIGATION STACK PARAMETERS
// ==========================================
// This tells TypeScript exactly what data is allowed to be passed between screens.
export type RootStackParamList = {
  // Add your other main screens here as you build them
  Dashboard: undefined;
  LedgerScreen: undefined;
  PaymentChallanScreen: undefined;
  
  // The new Business Partner screens
  BusinessPartnersList: undefined; // Takes no props when navigating to it
  BusinessPartnerForm: { partner?: BusinessPartner }; // Takes an optional partner to edit
};