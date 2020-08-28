import { expect } from 'chai';
import { QifData, QifTransaction, QifType } from '../src/types';
import {deserializeQif} from '../src/deserializer';

describe('deserializeQif()', () => {
  it('should parse type correctly', () => {
    const qif: string = `!Type:Bank
    ^`;

    const output = deserializeQif(qif);

    expect(output.type).to.equal(QifType.Bank);
    expect(output.transactions).to.be.empty;
  });

  it('should handle empty string', () => {

    const qif: string = ``;

    expect( () => deserializeQif(qif)).to.throw('No valid QIF content found.');

  });

  it('should throw an error on unsupported type', () => {
    const qif: string = `!Type:Memorized
    ^`;

    expect( () => deserializeQif(qif)).to.throw('Qif File Type not supported: !Type:Memorized');

  });

  describe('investment accounts', () => {
    it('should parse all investment fields correctly', () => {
      const qif: string = `!Type:Invst
D18/02/1992
NBuy
YAAPL
I12.35
Q100
T1300
Ccleared
PSell at 100
MBuying Apple Cheap
O65
LabcdeAccount
$1300
^`;

      const output = deserializeQif(qif);

      expect(output.type).to.equal(QifType.Investment);
      expect(output.transactions.length).to.equal(1);

      expect(output.transactions[0].date).to.equal('18/02/1992');
      expect(output.transactions[0].investmentAction).to.equal('Buy');
      expect(output.transactions[0].investmentSecurity).to.equal('AAPL');
      expect(output.transactions[0].investmentPrice).to.equal(12.35);
      expect(output.transactions[0].investmentQuantity).to.equal(100);
      expect(output.transactions[0].amount).to.equal(1300);
      expect(output.transactions[0].clearedStatus).to.equal(
        'cleared'
      );
      expect(output.transactions[0].investmentReminder).to.equal('Sell at 100');
      expect(output.transactions[0].memo).to.equal('Buying Apple Cheap');
      expect(output.transactions[0].investmentComission).to.equal(65);
      expect(output.transactions[0].investmentAccount).to.equal('abcdeAccount');
      expect(output.transactions[0].investmentAmountTransferred).to.equal(1300);
    });

    it('should throw error on bad detail item', () => {
      const qif: string = `!Type:Invst
D18/02/1992
NBuy
YAAPL
XBroken_Detail_Item
$1300
^`;

      expect(() => deserializeQif(qif)).to.throw(
        'Did not recognise detail item for line: XBroken_Detail_Item'
      );
    });
  });

  describe('non investment accounts', () => {

    it('should parse all noninvestment fields correctly', () => {
      const qif: string = `!Type:Bank
D18/02/1992
T100
Ccleared
NA1234
PGordon Coffee
MCoffee for the month
A103
AGordon Street
ALondon
LGroceries
^`;

      const output = deserializeQif(qif);

      expect(output.type).to.equal(QifType.Bank);
      expect(output.transactions.length).to.equal(1);

      expect(output.transactions[0].date).to.equal('18/02/1992');
      expect(output.transactions[0].amount).to.equal(100);
      expect(output.transactions[0].clearedStatus).to.equal('cleared');
      expect(output.transactions[0].reference).to.equal('A1234');
      expect(output.transactions[0].payee).to.equal('Gordon Coffee');
      expect(output.transactions[0].memo).to.equal('Coffee for the month');
      expect(output.transactions[0].address).to.have.members(['103', 'Gordon Street', 'London']);
      expect(output.transactions[0].category).to.equal('Groceries');

    });

    it('should throw error on bad detail item', () => {
      const qif: string = `!Type:Bank
D18/02/1992
XBroken_Detail_Item
^`;

      expect(() => deserializeQif(qif)).to.throw(
        'Did not recognise detail item for line: XBroken_Detail_Item'
      );
    });

    it('should parse splits transactions correctly', () => {
      const qif: string = `!Type:Bank
      D12/09/2019
      T350
      PAmazon
      SGroceries
      EFood
      $125
      SMedicine
      EMedical Supplies
      $225
      A123 Amazon Way
      ^`;
      const output: QifData = deserializeQif(qif);

      if (output.transactions[0] !== undefined) {
        const outputTransaction: QifTransaction = output.transactions[0];
        expect(outputTransaction.date).to.equal('12/09/2019');

        expect(outputTransaction.splits).to.have.deep.members([
          {
            category: 'Groceries',
            memo: 'Food',
            amount: 125
          },
          {
            category: 'Medicine',
            memo: 'Medical Supplies',
            amount: 225
          }
        ]);
      } else {
        expect(output.transactions.length).to.equal(1);
      }
    });
  });
});
