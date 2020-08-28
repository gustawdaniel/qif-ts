import {
  QifData,
  QifSplit,
  QifTransaction,
  QifType,
  QIF_TYPE_STRINGS_MAP,
  QifParserError
} from './types';

/**
 * Deserializes a valid QIF formatted string.
 *
 * @param data - The string to be deserialized
 * @returns A QifData object describing the data in the input
 *
 * @public
 */
export function deserializeQif(data: string): QifData {
    const dataLines: string[] = data.split('\n').map((l) => l.trim()).filter(l => l !== '');

    if (dataLines.length === 0) {
        throw new QifParserError('No valid QIF content found.');
    }

    const type: QifType = QIF_TYPE_STRINGS_MAP[dataLines[0]];

    dataLines.shift();

    switch (type) {
        case QifType.Investment:
            return parseInvestmentFile(dataLines);
        case QifType.Bank:
        case QifType.Cash:
        case QifType.Card:
        case QifType.Liability:
        case QifType.Asset:
            return parseNonInvestmentFile(dataLines, type);
        default:
            throw new QifParserError(
                'Qif File Type not supported: ' + type
            );
    }
}

function parseNonInvestmentFile(dataLines: string[], type: QifType): QifData {
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
            case 'D':
                transaction.date = lineText;
                break;
            case 'T':
                transaction.amount = parseFloat(lineText);
                break;
            case 'C':
                transaction.clearedStatus = lineText;
                break;
            case 'N':
                transaction.reference = lineText;
                break;
            case 'P':
                transaction.payee = lineText;
                break;
            case 'M':
                transaction.memo = lineText;
                break;
            case 'A':
                transaction.address = transaction.address || [];
                transaction.address.push(lineText);
                break;
            case 'L':
                transaction.category = lineText;
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
            default:
                throw new QifParserError(
                    'Did not recognise detail item for line: ' + line
                );
        }
    }

    return qifData;
}

function parseInvestmentFile(dataLines: string[]): QifData {
    const qifData: QifData = {
        type: QifType.Investment,
        transactions: []
    };

    let transaction: QifTransaction = {};
    for (const line of dataLines) {
        const lineText = line.substring(1);

        switch (line[0]) {
            case 'D':
                transaction.date = lineText;
                break;
            case 'N':
                transaction.investmentAction = lineText;
                break;
            case 'Y':
                transaction.investmentSecurity = lineText;
                break;
            case 'I':
                transaction.investmentPrice = parseFloat(lineText);
                break;
            case 'Q':
                transaction.investmentQuantity = parseFloat(lineText);
                break;
            case 'T':
                transaction.amount = parseFloat(lineText);
                break;
            case 'C':
                transaction.clearedStatus = lineText;
                break;
            case 'P':
                transaction.investmentReminder = lineText;
                break;
            case 'M':
                transaction.memo = lineText;
                break;
            case 'O':
                transaction.investmentComission = parseFloat(lineText);
                break;
            case 'L':
                transaction.investmentAccount = lineText;
                break;
            case '$':
                transaction.investmentAmountTransferred = parseFloat(lineText);
            case '^':
                if (Object.keys(transaction).length > 0) {
                    qifData.transactions.push(transaction);
                    transaction = {};
                }
                break;
            default:
                throw new QifParserError(
                    'Did not recognise detail item for line: ' + line
                );
        }
    }

    return qifData;
}
