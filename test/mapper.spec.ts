import { expect } from 'chai';
import { jsonToQif } from '../src/mapper';
import { QifData, QifType } from '../src/types';

describe('jsonToQif()', () => {
    it('should write bank type correctly', () => {
        const object: QifData = {
            type: QifType.Bank,
            transactions: []
        };

        const output: string = jsonToQif(object);

        expect(output).to.equal(QifType.Bank);
    });

    it('should write investment type correctly', () => {
        const object: QifData = {
            type: QifType.Investment,
            transactions: []
        };

        const output: string = jsonToQif(object);

        expect(output).to.equal(QifType.Investment);
    });

    it('should write card type correctly', () => {
        const object: QifData = {
            type: QifType.Card,
            transactions: []
        };

        const output: string = jsonToQif(object);

        expect(output).to.equal(QifType.Card);
    });

    it('should throw an error on unsupported type', () => {
        const object: QifData = {
            type: QifType.Account,
            transactions: []
        };

        expect(() => jsonToQif(object)).to.throw('');

    });

    describe('investment accounts', () => {
        it('should write single transaction with investment values correctly', () => {
            const object: QifData = {
                type: QifType.Investment,
                transactions: [
                    {
                        date: '19/07/2020',
                        investmentAction: 'Sell',
                        investmentSecurity: 'MSFT',
                        investmentPrice: 123,
                        investmentQuantity: 1,
                        amount: 123,
                        clearedStatus: 'cleared',
                        investmentReminder: 'reminder',
                        memo: 'Do androids dream of electric sheep?',
                        investmentComission: 10,
                        investmentAccount: '[PAYEE]',
                        investmentAmountTransferred: 100
                    }
                ]
            };

            const output = jsonToQif(object);

            expect(output).to.equal(`!Type:Invst
D19/07/2020
NSell
YMSFT
I123
Q1
T123
Ccleared
Preminder
MDo androids dream of electric sheep?
O10
L[PAYEE]
$100
^`);
        });
    });

    describe('non investment accounts', () => {
        it('should write a transaction with all the detail items', () => {
            const object: QifData = {
                type: QifType.Card,
                transactions: [
                    {
                        date: '19/09/2019',
                        amount: -15,
                        clearedStatus: 'uncleared',
                        reference: '12345',
                        payee: 'ATM',
                        memo: 'Some comment',
                        address: ['Glasgow'],
                        category: 'Spending'
                    }
                ]
            };

            const output = jsonToQif(object);

            expect(output).to.equal(
                `!Type:CCard
D19/09/2019
T-15
N12345
PATM
MSome comment
AGlasgow
LSpending
^`
            );
        });

        it('should write single transaction with address correctly', () => {
            const object: QifData = {
                type: QifType.Bank,
                transactions: [
                    {
                        date: '19/09/2019',
                        amount: -15,
                        payee: 'ATM',
                        address: ['42 Buchanan Road', 'Glasgow']
                    }
                ]
            };

            const output = jsonToQif(object);

            expect(output).to.equal(
                `!Type:Bank\nD19/09/2019\nT-15\nPATM\nA42 Buchanan Road\nAGlasgow\n^`
            );
        });

        it('should write single transaction with splits correctly', () => {
            const object: QifData = {
                type: QifType.Bank,
                transactions: [
                    {
                        date: '19/09/2019',
                        amount: -15,
                        payee: 'ATM',
                        splits: [
                            {
                                amount: 10,
                                category: 'Groceries',
                                memo: 'Grocery Shopping money'
                            },
                            {
                                percent: 33,
                                category: 'Clothes',
                                memo: 'Gloves'
                            }
                        ]
                    }
                ]
            };

            const output = jsonToQif(object);

            expect(output).to.equal(
                `!Type:Bank
D19/09/2019
T-15
PATM
SGroceries
EGrocery Shopping money
$10
SClothes
EGloves
%33
^`
            );
        });
    });
});
