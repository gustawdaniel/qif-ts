import {expect} from 'chai';
import {serializeQif} from '../src/serializer';
import {QifAccountType, QifData, QifType} from '../src/types';

describe('serializeQif()', () => {
    it('should write bank type correctly', () => {
        const object: QifData = {
            type: QifType.Bank,
            transactions: []
        };

        const output: string = serializeQif(object);

        expect(output).to.equal(QifType.Bank);
    });

    it('should write investment type correctly', () => {
        const object: QifData = {
            type: QifType.Investment,
            transactions: []
        };

        const output: string = serializeQif(object);

        expect(output).to.equal(QifType.Investment);
    });

    it('should write card type correctly', () => {
        const object: QifData = {
            type: QifType.Card,
            transactions: []
        };

        const output: string = serializeQif(object);

        expect(output).to.equal(QifType.Card);
    });

    it('should throw an error on unsupported type', () => {
        const object: QifData = {
            type: QifType.Memorized,
            transactions: []
        };

        expect(() => serializeQif(object)).to.throw('Qif File Type not currently supported: !Type:Memorized');

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

            const output = serializeQif(object);

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

        it('should not write out detail items if not given in object', () => {
            const object: QifData = {
                type: QifType.Investment,
                transactions: [
                    {
                        date: '19/07/2020',
                        amount: 12
                    }
                ]
            };

            const output = serializeQif(object);

            expect(output).to.equal(`!Type:Invst
D19/07/2020
T12
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

            const output = serializeQif(object);

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

            const output = serializeQif(object);

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

            const output = serializeQif(object);

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

    it('multi account file should be serializable', () => {
        const object: QifData = {
            accounts: [
                {name: 'Alior GBP', type: 'Bank' as QifAccountType},
                {name: 'Alior PLN', type: 'Bank' as QifAccountType}
            ],
            transactions: [
                {
                    amount: 750,
                    account: 'Alior PLN',
                    date: "04/30'16",
                    payee: 'Web Page',
                    category: 'Income:Invoices'
                },
                {
                    amount: -668.28,
                    account: 'Alior PLN',
                    date: "05/04'16",
                    payee: 'Accounting',
                    category: 'Company:Accounting'
                },
                {
                    amount: 900,
                    account: 'Alior GBP',
                    date: "04/30'16",
                    payee: 'New computer',
                    category: 'Company:Devices'
                },
                {
                    amount: -855.28,
                    account: 'Alior GBP',
                    date: "05/04'16",
                    payee: 'Coffee',
                    category: 'Food:Drink'
                }
            ],
            type: '!Account' as QifType
        };

        const expectedOut = `!Account
NAlior GBP
TBank
^
NAlior PLN
TBank
^
!Account
NAlior GBP
TBank
^
!Type:Bank
D04/30'16
U900.00
T900.00
PNew computer
LCompany:Devices
^
D05/04'16
U-855.28
T-855.28
PCoffee
LFood:Drink
^
!Account
NAlior PLN
TBank
^
!Type:Bank
D04/30'16
U750.00
T750.00
PWeb Page
LIncome:Invoices
^
D05/04'16
U-668.28
T-668.28
PAccounting
LCompany:Accounting
^`;
        const output = serializeQif(object);

        expect(output).to.equal(
            expectedOut
                .split('\n')
                .filter((l: string) => l[0] !== 'U')
                .map(l => l[0] === 'T' && parseFloat(l.substring(1)) ? 'T' + parseFloat(l.substring(1)) : l)
                .join('\n')
        );
    })
});
