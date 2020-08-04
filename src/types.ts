export type QifData = {
  type: QifType;
  transactions: QifTransaction[];
}

export enum QifType {
  Cash='!Type:Cash',
  Bank='!Type:Bank',
  Card='!Type:CCard',
  Investment='!Type:Invst',
  Asset='!Type:Oth A',
  Liability='!Type:Oth L',
  Invoice='!Type:Invoice',
  Account='!Account',
  Category='!Type:Cat',
  Class='!Type:Class',
  Memorized='!Type:Memorized'
}

export const QIF_TYPE_STRINGS_MAP: Record<string, QifType> = {
  '!Type:Cash': QifType.Cash,
  '!Type:Bank': QifType.Bank,
  '!Type:CCard': QifType.Card,
  '!Type:Invst': QifType.Investment,
  '!Type:Oth A': QifType.Asset,
  '!Type:Oth L': QifType.Liability,
  '!Account': QifType.Account,
  '!Type:Cat': QifType.Category,
  '!Type:Class': QifType.Class,
  '!Type:Memorized': QifType.Memorized
}

export type QifTransaction = {
  date?: string; // D
  amount?: number; // T
  clearedStatus?: string // C
  reference?: string // N
  payee?: string // P
  memo?: string // M
  address?: string[] // A
  category?: string; // L

  splits?: QifSplit[];

  investmentAction?: string; // N
  investmentSecurity?: string; // Y
  investmentPrice?: number; // I
  investmentQuantity?: number; // Q
  investmentReminder?: string // P
  investmentComission?: number // O
  investmentAccount?: string // L
  investmentAmountTransferred?: number // $
}

export type QifSplit = {
  category?: string; // S
  memo?: string; // E
  amount?: number; // $
  percent?: number; // %
}

export class QifMapperError extends Error {

}