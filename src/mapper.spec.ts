import { expect } from 'chai';
import { jsonToQif, qifToJson } from './mapper';
import { QifData, QifTransaction, QifType } from './types';

describe('jsonToQif()', () => {
  it('should write type correctly', () => {
    const object: QifData = {
      type: QifType.Bank,
      transactions: []
    };

    const output: string = jsonToQif(object);

    expect(output).to.equal(QifType.Bank);
  });

  it('should write single transaction with only amount, payee and date correctly', () => {
    const object: QifData = {
      type: QifType.Bank,
      transactions: [{ date: '19/07/2020', amount: -20, payee: 'ATM' }]
    };

    const output = jsonToQif(object);

    expect(output).to.equal(`!Type:Bank\nD19/07/2020\nT-20\nPATM\n^`);
  });

  it('should write single transaction with category correctly', () => {
    const object: QifData = {
      type: QifType.Bank,
      transactions: [
        { date: '19/09/2020', amount: -25, payee: 'ATM', category: 'General' }
      ]
    };

    const output = jsonToQif(object);

    expect(output).to.equal(`!Type:Bank\nD19/09/2020\nT-25\nPATM\nLGeneral\n^`);
  });

  it('should write single transaction with memo correctly', () => {
    const object: QifData = {
      type: QifType.Bank,
      transactions: [
        {
          date: '19/09/2020',
          amount: -25,
          payee: 'ATM',
          memo: 'Cash for sandwiches'
        }
      ]
    };

    const output = jsonToQif(object);

    expect(output).to.equal(
      `!Type:Bank\nD19/09/2020\nT-25\nPATM\nMCash for sandwiches\n^`
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
          address: ['42 Buchanan Road']
        }
      ]
    };

    const output = jsonToQif(object);

    expect(output).to.equal(
      `!Type:Bank\nD19/09/2019\nT-15\nPATM\nA42 Buchanan Road\n^`
    );
  });

  it('should write single transaction with all fields correctly', () => {
    const object: QifData = {
      type: QifType.Bank,
      transactions: [
        {
          date: '19/09/2019',
          amount: -15,
          payee: 'ATM',
          category: 'General',
          memo: 'Spending Money',
          address: ['42 Buchanan Road']
        }
      ]
    };

    const output = jsonToQif(object);

    expect(output).to.equal(
      `!Type:Bank\nD19/09/2019\nT-15\nPATM\nLGeneral\nMSpending Money\nA42 Buchanan Road\n^`
    );
  });

  it('should write multiple transactions with differing fields correctly', () => {
    const object: QifData = {
      type: QifType.Bank,
      transactions: [
        {
          date: '19/09/2019',
          amount: -15,
          payee: 'ATM',
          category: 'General',
          memo: 'Spending Money',
          address: ['42 Buchanan Road']
        },
        {
          date: '14/09/2019',
          amount: 12.99,
          payee: 'Stewart Thomson',
          memo: 'Thanks for the pizza!',
          address: ['42 Buchanan Road']
        },
        {
          date: '12/09/2019',
          amount: 350,
          payee: 'Work',
          category: 'Income'
        }
      ]
    };

    const output = jsonToQif(object);

    expect(output).to.equal(
      `!Type:Bank
D19/09/2019
T-15
PATM
LGeneral
MSpending Money
A42 Buchanan Road
^
D14/09/2019
T12.99
PStewart Thomson
MThanks for the pizza!
A42 Buchanan Road
^
D12/09/2019
T350
PWork
LIncome
^`
    );
  });
});

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
