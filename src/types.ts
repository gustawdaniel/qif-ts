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
  '!Type:Invoice': QifType.Invoice,
  '!Account': QifType.Account,
  '!Type:Cat': QifType.Category,
  '!Type:Class': QifType.Class,
  '!Type:Memorized': QifType.Memorized
}

export type QifTransaction = {
  date?: string; // D
  amount?: number; // T,U
  memo?: string; // M
  clearedStatus?: 'cleared' | 'reconciled' |'unreconciled/uncleared' // TODO parser C
  checkNumber?:  number | 'Deposit' | 'Transfer' | 'Print' | 'ATM' | 'EFT'; // TODO N
  payee?: string; // P
  address?: string[]; // A
  category?: string; // L
  reimbursableFlag?: boolean // F
  splits?: QifSplit[]
  investmentAction?: 'Buy' | 'BuyX' | 'Sell' | 'SellX' | 'CGLong' | 'CGLongX' | 'CGMid' |
  'CGMidX' | 'CGShort' | 'CGShortX' | 'Div' | 'DivX' | 'IntInc' | 'IntIncX' |
  'ReinvDiv' | 'ReinvInt' | 'ReinvLg' | 'ReinvMd' | 'ReinvSh' | 'Reprice' |
  'XIn' | 'XOut' | 'MiscExp' | 'MiscExpX' | 'MiscInc' | 'MiscIncX' | 'MargInt' |
  'MargIntX' | 'RtrnCap' | 'RtrnCapX' | 'StkSplit' | 'ShrsOut' | 'ShrsIn' // TODO parser N
  securityName?: string // Y
  securityPrice?: number // I
  shareQuantity?: number // Q
  comissionCost?: number // O
  amountTransferred?: number // $
  budgetedAmount?: number // B
}

export type QifSplit = {
  category?: string; // S
  memo?: string; // E
  amount?: number; // $
  percent?: number; // %
}

export class QifMapperError extends Error {

}