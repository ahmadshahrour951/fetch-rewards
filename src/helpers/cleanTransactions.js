
function cleanTransactions(transactions) {
  /**
   * Used to clean up the transactions array, where only the positive consumed transactions are listed.
   *
   * We're trying to clean the data going into the spend route by removing consumed transactions from oldest to newest.
   *  It's important to note that this is a nested for loop. The first loop will keep record of the positive transactions, the second loop will
   * look ahead and 'consume' negative transactions. If the positive transaction is fully consumed, there's need to look at it, if it isn't fully
   * consumed we can use it in the create transactions to deduct.
   *
   * @param {Array}            transactions                                  An list of raw transactions
   * @param {Object}          transactions[i]                               A single transaction object
   * @param {String}           transactions[i].payer                      Name of payer
   * @param {Integer}         transactions[i].points                      Points to add or deduct
   * @param {Date}             transactions[i].timestamp               ISODate of transaction invoked
   * @param {Boolean}        transactions[i].seen                        Seen flag from the previous cleanTransaction function
   */
  const output = [];

  // Loop through each positive unseen transaction
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].points < 0 || transactions[i].seen) continue;

    // Flag the current postive transaction as seen
    transactions[i].seen = true;
    const currentTransaction = transactions[i];

    // Look ahead of the current index and find negative unseen transactions that belong to the same payer as currentTransaction
    // if found - flag them as seen so that the next ith element need not check it and deduct
    for (let j = i + 1; j < transactions.length; j++) {
      if (
        transactions[j].points > 0 ||
        transactions[j].seen ||
        transactions[j].payer !== currentTransaction.payer
      )
        continue;

      // No need to continue if points are zero
      if (!currentTransaction.points) break;

      // Mark the negative transaction as seen (this will not be iterated again on the next loop) and deduct it from the current ith element
      transactions[j].seen = true;
      currentTransaction.points += transactions[j].points;
    }

    // If there's nothing to consume from the current transaction, there's no need to add it to the clean output
    if (!currentTransaction.points) continue;
    // This is the leftover positive transaction that CAN be consumed
    output.push(currentTransaction);
  }

  return output;
}

module.exports = cleanTransactions;