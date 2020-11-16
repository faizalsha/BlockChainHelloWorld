const SHA256 = require("crypto-js/sha256");
class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.transactions)
    ).toString();
  }
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("BLOCK MINED: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block("01/01/2020", "Genesis Block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("Block mined successfully...");
    this.chain.push(block);
    this.pendingTransactions = [];
    this.createTransaction(new Transaction(null, miningRewardAddress, 7));
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.calculateHash() !== currentBlock.hash) return false;
      if (currentBlock.previousBlock.hash !== previousBlock.hash) return false;
    }
    return true;
  }
}
let myChain = new BlockChain();
// myChain.createTransaction(new Transaction("shadab", "faizan", 25));
myChain.createTransaction(new Transaction("aasif", "shahzeb", 12));
myChain.createTransaction(new Transaction("sumit", "amit", 45));
myChain.minePendingTransaction("shadab");
myChain.minePendingTransaction("final");
console.log("balance of shadab: " + myChain.getBalanceOfAddress("shadab"));
