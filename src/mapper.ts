import { QifData, QifTransaction } from "./types";

export function jsonToQif(data: QifData): string {

  let output: string[] = [];

  if (data.type) {
    output.push('!Type:' + data.type);
  }

  data.transactions
  .map(t => transactionToString(t))
  .forEach(t => output.push(...t));

  return output.join('\n');
}

export function qifToJson(data: string): QifData {
  return {
    type: 'Bank',
    transactions: []
  }
}

function parseTransaction(): QifTransaction {

  const date: string = '';
  const amount: number = 0;
  const payee: string = '';
  const category: string | undefined = undefined;
  const memo: string | undefined = undefined;
  const address : string | undefined = undefined;

  return {
    date,
    amount,
    payee,
    category,
    memo,
    address
  };

}

function transactionToString(transaction: QifTransaction): string[] {
  const output: string[] = [];

  output.push('D' + transaction.date);
  output.push('T' + transaction.amount);
  output.push('P' + transaction.payee);

  if (transaction.category) {
    output.push('L' + transaction.category);
  }

  if (transaction.memo) {
    output.push('M' + transaction.memo);
  }

  if (transaction.address) {
    output.push('A' + transaction.address);
  }

  output.push('^');

  return output;
}