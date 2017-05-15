module.exports = {
  attributes: {
    uid: {
      type: 'string',
      required: true
    },

    date: {
      type: 'string'
    },

    goal_minutes: {
      type: 'integer'
    },

    total_sleep_minutes: {
      type: 'integer'
    },

    total_sleeps: {
      type: 'integer'
    },

    href: {
      type: 'string'
    },

    changed: {
      type: 'boolean'
    }
  },

  upsert: function (query, data) {
    return UpsertService.upsert(Sleep, query, data)
  },
}
