module.exports = {
  // Upsert a record, by model and query condition
  upsert: function (model, query, data) {
    return model.update(query, data)
      .then(function (records) {
        if (records.length == 0) {
          return model.create(data)
        }
        else {
          return Promise.resolve(records[0]);
        }
      })
  }
}
