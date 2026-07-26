export interface NavItem {
  id: string;
  title: string;
  icon: string;
}

export interface MainLayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  onNavigate: (screenId: string) => void;
}