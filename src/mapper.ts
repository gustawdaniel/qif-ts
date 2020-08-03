import {
  QifData,




  QifTransaction
} from './types';

export function jsonToQif(data: QifData): string {
  const output: string[] = [];

  if (data.type) {
    output.push(data.type);
  }

  data.transactions
    .map((t) => transactionToString(t))
    .forEach((t) => output.push(...t));

  return output.join('\n');
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
    output.push('A' + transaction.address.join('\n'));
  }

  output.push('^');

  return output;
}
