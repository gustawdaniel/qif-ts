import {
  QifData,
  QifMapperError,



  QifSplit, QifTransaction,
  QifType,
  QIF_TYPE_STRINGS_MAP
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

export function qifToJson(data: string): QifData {
  const dataLines: string[] = data.split('\n').map((l) => l.trim());

  const typeText: string = dataLines.shift() || '';
  const type: QifType = QIF_TYPE_STRINGS_MAP[typeText];

  const qifData: QifData = {
    type,
    transactions: []
  };

  let transaction: QifTransaction = {};
  let parsingSplit = false;
  let currentSplit: QifSplit = {};
  for (const line of dataLines) {

    const lineText = line.substring(1);

    // handle Splits
    if (parsingSplit === true) {
      switch (line[0]) {
        case 'E':
          currentSplit.memo = lineText;
          continue;
        case '$':
          currentSplit.amount = parseFloat(lineText);
          continue;
        case '%':
          currentSplit.percent = parseFloat(lineText);
          continue;
        case 'S':
          transaction.splits = transaction.splits || [];
          transaction.splits.push(currentSplit);
          currentSplit = {};
          currentSplit.category = lineText;
          continue;
      }

      if (Object.keys(currentSplit).length > 0) {
        transaction.splits = transaction.splits || [];
        transaction.splits.push(currentSplit);
        currentSplit = {};
      }
      parsingSplit = false;

    }

    switch (line[0]) {
      case 'S': // Split
        parsingSplit = true;
        currentSplit.category = lineText;
        break;
      case '^':
        if (Object.keys(transaction).length > 0) {
          qifData.transactions.push(transaction);
          transaction = {};
        }
        break;
      case 'D':
        transaction.date = lineText;
        break;
      case 'T':
      case 'U':
        transaction.amount = parseFloat(lineText);
        break;
      case 'L':
        transaction.category = lineText;
        break;
      case 'M':
        transaction.memo = lineText;
        break;
      case 'P':
        transaction.payee = lineText;
        break;
      case 'A':
        transaction.address = transaction.address || [];
        transaction.address.push(lineText);
        break;
      case 'Y':
        transaction.securityName = lineText;
        break;
      case 'I':
        transaction.securityPrice = parseFloat(lineText);
        break;
      case 'Q':
        transaction.shareQuantity = parseFloat(lineText);
        break;
      case 'O':
        transaction.comissionCost = parseFloat(lineText);
        break;
      case '$':
        transaction.amountTransferred = parseFloat(lineText);
        break;
      case 'B':
        transaction.amountTransferred = parseFloat(lineText);
        break;
      case 'F':
        transaction.reimbursableFlag = true;
        break;
      default:
        throw new QifMapperError('Could not map line: ' + line);
    }


  }


  return qifData;
}

function parseTransaction(): QifTransaction {
  const date: string = '';
  const amount: number = 0;
  const payee: string = '';
  const category: string | undefined = undefined;
  const memo: string | undefined = undefined;
  const address: string | undefined = undefined;

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
    output.push('A' + transaction.address.join('\n'));
  }

  output.push('^');

  return output;
}
