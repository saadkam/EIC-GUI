import { LedgerEntry } from '../../../types/ledger';

export const INITIAL_TRANSACTIONS: LedgerEntry[] = [
  { id: '1', date: '2026-07-20', description: 'Batch #104 Caustic Soda Purchase', category: 'Raw Material', type: 'expense', amount: 1450.00 },
  { id: '2', date: '2026-07-21', description: 'Sale - Degreaser 500L (Client A)', category: 'Finished Goods', type: 'income', amount: 3200.00 },
  { id: '3', date: '2026-07-22', description: 'Lab Equipment Calibration', category: 'Maintenance', type: 'expense', amount: 350.00 },
  { id: '4', date: '2026-07-23', description: 'Sale - Floor Wax 200kg (Client B)', category: 'Finished Goods', type: 'income', amount: 1850.00 },
  { id: '5', date: '2026-07-24', description: 'Surfactant Bulk Shipment', category: 'Raw Material', type: 'expense', amount: 2100.00 },
];