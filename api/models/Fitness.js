module.exports = {
  attributes: {
    uid: {
      type: 'string',
      required: true
    },
    
    id: {
      type: 'string'
    },

    date: {
      type: 'string'
    },

    points: {
      type: 'integer'
    },

    steps: {
      type: 'integer'
    },

    changed: {
      type: 'boolean'
    }
  }
};
