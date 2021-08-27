function createTransactions(points, cleanTransactions) {
  let pointsLeft = points;
  const output = []

  for (let i = 0; i < cleanTransactions.length; i++) {
    if (pointsLeft === 0) break;

    const subtractPoints =
      pointsLeft > cleanTransactions[i].points
        ? cleanTransactions[i].points
        : pointsLeft;

    pointsLeft -= subtractPoints;

    let newTransaction = {
      payer: cleanTransactions[i].payer,
      points: -subtractPoints,
      timestamp: new Date()
    };

    output.push(newTransaction);
  }

  return output
}

module.exports = createTransactions;
