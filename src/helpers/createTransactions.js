function createTransactions(points, cleanTransactions) {
  /**
   * Used to create a new CONSUMPTION transactions array, where negative transactions are being created.
   *
   * We're trying to produce an array of negative transactions to consume the cleanTransactions array. Essentially
   * we'll loop through each cleanTransaction and deduct the amount left from the points in order from oldest to newest.
   * It's important to note these elements outputed will be NEGATIVE transactions since they are consuming the positive
   * transactions from the cleanTransactions.
   *
   * @param {Integer}          points                                                      Points used for spending
   * @param {Array}            cleanTransactions                                    An list of consumable transactions from the cleanTransactions function
   * @param {Object}           cleanTransactions[i]                                A single transaction object
   * @param {String}            cleanTransactions[i].payer                      Name of payer
   * @param {Integer}           cleanTransactions[i].points                     Points to add or deduct
   * @param {Date}              cleanTransactions[i].timestamp               ISODate of transaction invoked
   * @param {Boolean}         cleanTransactions[i].seen                        Seen flag from the previous cleanTransaction function
   */
  let pointsLeft = points;
  const output = [];

  for (let i = 0; i < cleanTransactions.length; i++) {
    // If we've consumed all the spend points, then we're done
    if (pointsLeft === 0) break;

    // this is the parameter to subtract the pointsLeft from. This logic handles edges cases where the cleanTransaction might be smaller than
    // the pointsLeft
    const subtractPoints =
      pointsLeft > cleanTransactions[i].points
        ? cleanTransactions[i].points
        : pointsLeft;

    pointsLeft -= subtractPoints;

    // creating a new transactions object
    let newTransaction = {
      payer: cleanTransactions[i].payer,
      points: -subtractPoints,
      timestamp: new Date(),
    };

    output.push(newTransaction);
  }

  return output;
}

module.exports = createTransactions;
