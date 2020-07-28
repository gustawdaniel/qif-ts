export type QifData = {
  type?: string;
  transactions: QifTransaction[];
}

export type QifTransaction = {
  date: string;
  amount: number;
  payee: string;
  category?: string;
  memo?: string;
  address?: string;
}
