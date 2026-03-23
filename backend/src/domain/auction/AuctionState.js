export class AuctionState {
  /**
   * @param {object} auction Sequelize instance/plain object
   * @param {number} actorId current user id
   * @returns {boolean}
   */
  canEditAuction(auction, actorId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {object} auction
   * @param {number} actorId
   * @returns {boolean}
   */
  canDeleteAuction(auction, actorId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {object} auction
   * @param {Date} now
   * @returns {boolean}
   */
  canPlaceBid(auction, now) {
    throw new Error('Not implemented');
  }
}

