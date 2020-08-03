import { expect } from 'chai';
import { qifToJson } from './parser';
import { QifData, QifTransaction, QifType } from './types';

describe('qifToJson()', () => {
  it('should parse type correctly', () => {
    const qif: string = `!Type:Bank
    ^`;

    const output = qifToJson(qif);

    expect(output.type).to.equal(QifType.Bank);
    expect(output.transactions).to.be.empty;
  });

  it('should parse amount, payee and date correctly', () => {
    const qif: string = `!Type:Bank
D12/09/2019
T350
PWork
^`;
    const output = qifToJson(qif);

    expect(output.transactions).to.have.length(1);
    expect(output.transactions[0].date).to.equal('12/09/2019');
    expect(output.transactions[0].amount).to.equal(350);
    expect(output.transactions[0].payee).to.equal('Work');
  });

  it('should parse category correctly', () => {
    const qif: string = `!Type:Bank
D12/09/2019
T350
PWork
LBills
^`;
    const output = qifToJson(qif);

    expect(output.transactions).to.have.length(1);
    expect(output.transactions[0].category).to.equal('Bills');
  });

  it('should parse memo correctly', () => {
    const qif: string = `!Type:Bank
D12/09/2019
T-350
PWork
MPizza Money
^`;
    const output = qifToJson(qif);

    expect(output.transactions).to.have.length(1);
    expect(output.transactions[0].memo).to.equal('Pizza Money');
  });

  it('should parse address correctly', () => {
    const qif: string = `!Type:Bank
D12/09/2019
T-350
PWork
A103 Dalry Road
^`;
    const output = qifToJson(qif);

    expect(output.transactions).to.have.length(1);
    expect(output.transactions[0].address?.length).to.equal(1);
    expect(output.transactions[0].address).to.contain('103 Dalry Road');
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
    const output: QifData = qifToJson(qif);

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
