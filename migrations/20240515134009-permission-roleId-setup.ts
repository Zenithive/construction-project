module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    return db.collection('permissions').updateMany({}, { $set: { roleId: "" } })
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    return db.collection('permissions').updateMany({}, { $unset: { roleId: "" } })
  }
};
