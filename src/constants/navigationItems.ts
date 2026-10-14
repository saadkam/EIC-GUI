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
  { id: 'invoice', title: 'Invoice', icon: InvoiceIcon,
  },
  { 
    id: 'delivery_challan', 
    title: 'Delivery Challan', 
    icon: DeliveryChallanIcon,
  },
  { 
    id: 'receivables', 
    title: 'Receivables', 
    icon: RupeeIcon,
  },
  { 
    id: 'purchases', 
    title: 'Purchase Order', 
    icon: OrderCartIcon,
  },
  { 
    id: 'payables', 
    title: 'Accounts Payable', 
    icon: RupeeIcon,
  },  
  { 
    id: 'formulas', 
    title: 'Cookbook',
    icon: FlaskIcon
  },
  { 
    id: 'prices', 
    title: 'Price / Unit', 
    icon: RupeeIcon,
  },
  { 
    id: 'ledger', 
    title: 'Ledger', 
    icon: LedgerIcon,
  },
  { 
    id: 'inventory', 
    title: 'Inventory', 
    icon: InventoryIcon,
  },
  { 
    id: 'BusinessPartners', 
    title: 'Businesses', 
    icon: DeliveryChallanIcon,
  },
  // { id: 'production', title: 'Production', icon: FactoryIcon, //add later
  // },
//////////////////no longer needed//////////////////////////////////////

  //  { id: 'challan', title: 'Challan', icon: ChallanIcon,
  //    },
];