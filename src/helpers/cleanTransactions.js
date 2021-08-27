
function cleanTransactions(transactions) {
  const output = [];

  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].points < 0 || transactions[i].seen) continue;

    transactions[i].seen = true;
    const currentTransaction = transactions[i];

    for (let j = i + 1; j < transactions.length; j++) {
      if (
        transactions[j].points > 0 ||
        transactions[j].seen ||
        transactions[j].payer !== currentTransaction.payer
      )
        continue;

      if (!currentTransaction.points) break;

      transactions[j].seen = true;
      currentTransaction.points += transactions[j].points;
    }

    if (!currentTransaction.points) continue;
    output.push(currentTransaction);
  }

  return output
}

module.exports = cleanTransactions;