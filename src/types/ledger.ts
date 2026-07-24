export type TransactionType = 'income' | 'expense';

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
}

export interface FinancialSummary {
  income: number;
  expense: number;
  balance: number;
}