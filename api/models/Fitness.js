module.exports = {
  attributes: {
    uid: {
      type: 'string',
      required: true
    },

    date: {
      type: 'string'
    },

    goal_steps: {
      type: 'integer'
    },

    total_distance: {
      type: 'integer'
    },

    total_calories: {
      type: 'integer'
    },

    total_steps: {
      type: 'integer'
    },

    total_activities: {
      type: 'integer'
    },

    total_intensity_dist_in_step: {
      type: 'array'
    },

    reach_goal: {
      type: 'boolean'
    },

    href: {
      type: 'string'
    },

    changed: {
      type: 'boolean'
    }
  },

  upsert: function (query, data) {
    return UpsertService.upsert(Fitness, query, data)
  },
}
