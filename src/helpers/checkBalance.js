function checkBalance(points, transactions) {
  /**
   * @param {Integer}         points                                            points used for spending
   * @param {Array}           transactions                                    raw transactions list from the database
   * @param {String}           transactions[i].payer                      Name of payer
   * @param {Integer}         transactions[i].points                      Points to add or deduct
   * @param {Date}             transactions[i].timestamp               ISODate of transaction invoked
   * @param {Boolean}        transactions[i].seen              Seen flag from the previous cleanTransaction function
   */
  const totalBalance = transactions.reduce((acc, curr) => acc + curr.points, 0);

  if (totalBalance < points) {
    const error = new Error('More points required.');
    error.data = points - totalBalance
    error.statusCode = 405;
    throw error;
  }
}

module.exports = checkBalance;
