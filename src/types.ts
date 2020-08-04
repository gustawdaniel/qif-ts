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
  clearedStatus?: 'cleared' | 'reconciled' |'unreconciled/uncleared' // TODO parser,mapper C
  checkNumber?:  number | 'Deposit' | 'Transfer' | 'Print' | 'ATM' | 'EFT'; // TODO parser,mapper N
  payee?: string; // P
  address?: string[]; // A
  category?: string; // L
  reimbursableFlag?: boolean // TODO mapper F
  splits?: QifSplit[] // TODO mapper
  investmentAction?: 'Buy' | 'BuyX' | 'Sell' | 'SellX' | 'CGLong' | 'CGLongX' | 'CGMid' |
  'CGMidX' | 'CGShort' | 'CGShortX' | 'Div' | 'DivX' | 'IntInc' | 'IntIncX' |
  'ReinvDiv' | 'ReinvInt' | 'ReinvLg' | 'ReinvMd' | 'ReinvSh' | 'Reprice' |
  'XIn' | 'XOut' | 'MiscExp' | 'MiscExpX' | 'MiscInc' | 'MiscIncX' | 'MargInt' |
  'MargIntX' | 'RtrnCap' | 'RtrnCapX' | 'StkSplit' | 'ShrsOut' | 'ShrsIn' // TODO parser,mapper N
  securityName?: string // todo mapper Y
  securityPrice?: number // todo mapper I
  shareQuantity?: number // todo mapper Q
  comissionCost?: number // todo mapper O
  amountTransferred?: number // todo mapper $
  budgetedAmount?: number // todo mapper B
}

export type QifSplit = {
  category?: string; // S
  memo?: string; // E
  amount?: number; // $
  percent?: number; // %
}

export class QifMapperError extends Error {

}