import { expect } from 'chai';
import { jsonToQif } from './mapper';
import { QifData, QifType } from './types';

describe('jsonToQif()', () => {
  it('should write bank type correctly', () => {
    const object: QifData = {
      type: QifType.Bank,
      transactions: [],
    };

    const output: string = jsonToQif(object);

    expect(output).to.equal(QifType.Bank);
  });

  it('should write investment type correctly', () => {
    const object: QifData = {
      type: QifType.Investment,
      transactions: [],
    };

    const output: string = jsonToQif(object);

    expect(output).to.equal(QifType.Investment);
  });

  it('should write card type correctly', () => {
    const object: QifData = {
      type: QifType.Card,
      transactions: [],
    };

    const output: string = jsonToQif(object);

    expect(output).to.equal(QifType.Card);
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
            investmentAmountTransferred: 100,
          },
        ],
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

    it('should throw an error when trying to write a detail item that does not belong to investments', () => {
      // TODO
    });
  });

  describe('non investment accounts', () => {
    it('should write single transaction with address correctly', () => {
      const object: QifData = {
        type: QifType.Bank,
        transactions: [
          {
            date: '19/09/2019',
            amount: -15,
            payee: 'ATM',
            address: ['42 Buchanan Road', 'Glasgow'],
          },
        ],
      };

      const output = jsonToQif(object);

      expect(output).to.equal(
        `!Type:Bank\nD19/09/2019\nT-15\nPATM\nA42 Buchanan Road\nAGlasgow\n^`
      );
    });
  });
});
