import { QifData, QifMapperError, QifTransaction, QifType } from './types';

export function jsonToQif(data: QifData): string {
    const output: string[] = [];

    if (data.type) {
        output.push(data.type);
    }

    const transactionMappingFunction = getMappingFunction(data.type);

    data.transactions
        .map((transaction) => transactionMappingFunction(transaction))
        .forEach((t) => output.push(...t));

    return output.join('\n');
}

function getMappingFunction(
    type: QifType
): (transaction: QifTransaction) => string[] {
    switch (type) {
        case QifType.Investment:
            return investmentTransactionToString;
        case QifType.Bank:
        case QifType.Cash:
        case QifType.Card:
        case QifType.Liability:
        case QifType.Asset:
            return nonInvestmentTransactionToString;
        default:
            throw new QifMapperError(
                'Qif File Type not currently supported: ' + type
            );
    }
}

function investmentTransactionToString(transaction: QifTransaction): string[] {
    const output: string[] = [];

    if (transaction.date) {
        output.push('D' + transaction.date);
    }

    if (transaction.investmentAction) {
        output.push('N' + transaction.investmentAction);
    }

    if (transaction.investmentSecurity) {
        output.push('Y' + transaction.investmentSecurity);
    }

    if (transaction.investmentPrice) {
        output.push('I' + transaction.investmentPrice);
    }

    if (transaction.investmentQuantity) {
        output.push('Q' + transaction.investmentQuantity);
    }

    if (transaction.amount) {
        output.push('T' + transaction.amount);
    }

    if (transaction.clearedStatus) {
        output.push('C' + transaction.clearedStatus);
    }

    if (transaction.investmentReminder) {
        output.push('P' + transaction.investmentReminder);
    }

    if (transaction.memo) {
        output.push('M' + transaction.memo);
    }

    if (transaction.investmentComission) {
        output.push('O' + transaction.investmentComission);
    }

    if (transaction.investmentAccount) {
        output.push('L' + transaction.investmentAccount);
    }

    if (transaction.investmentAmountTransferred) {
        output.push('$' + transaction.investmentAmountTransferred);
    }

    output.push('^');

    return output;
}

function nonInvestmentTransactionToString(
    transaction: QifTransaction
): string[] {
    const output: string[] = [];

    if (transaction.date) {
        output.push('D' + transaction.date);
    }

    if (transaction.amount) {
        output.push('T' + transaction.amount);
    }

    if (transaction.reference) {
        output.push('N' + transaction.reference);
    }

    if (transaction.payee) {
        output.push('P' + transaction.payee);
    }

    if (transaction.memo) {
        output.push('M' + transaction.memo);
    }

    if (transaction.address) {
        output.push('A' + transaction.address.join('\nA'));
    }

    if (transaction.category) {
        output.push('L' + transaction.category);
    }

    if (transaction.splits) {
        for (const split of transaction.splits) {
            if (split.category) {
                output.push('S' + split.category);
            }

            if (split.memo) {
                output.push('E' + split.memo);
            }

            if (split.amount) {
                output.push('$' + split.amount);
            }

            if (split.percent) {
                output.push('%' + split.percent);
            }
        }
    }

    output.push('^');

    return output;
}
