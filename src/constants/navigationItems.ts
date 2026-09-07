import { NavItem } from '../types/navigation';
import { 
  DashboardIcon, 
  RupeeIcon, 
  FlaskIcon, 
  FactoryIcon , 
  InventoryIcon, 
  LedgerIcon,
  ChallanIcon,
  DeliveryChallanIcon,
  OrderCartIcon,
  InvoiceIcon} 
  from '../components/common/icons/MenuIcon';

export const NAV_ITEMS: NavItem[] = [
  { 
    id: 'dashboard', 
    title: 'Dashboard', 
    icon: DashboardIcon, 
  },
  { id: 'order', title: 'Order', icon: OrderCartIcon,
    },
  { id: 'prices', title: 'Price / Unit', icon: RupeeIcon,
    },
  { id: 'formulas', title: 'Cookbook',icon: FlaskIcon
    },
  { id: 'production', title: 'Production', icon: FactoryIcon,
    },
  { id: 'inventory', title: 'Inventory', icon: InventoryIcon,
    },
  { id: 'ledger', title: 'Ledger', icon: LedgerIcon,
     },
  { id: 'challan', title: 'Challan', icon: ChallanIcon,
     },
  { id: 'invoice', title: 'Invoice', icon: InvoiceIcon,
     },
  { id: 'delivery_challan', title: 'Delivery Challan', icon: DeliveryChallanIcon,
     },
  { id: 'BusinessPartners', title: 'Businesses', icon: DeliveryChallanIcon,
     },
];