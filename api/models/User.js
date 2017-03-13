module.exports = {
  attributes: {
    uid: {
      type: 'string',
      required: true
    },
    
    first_name: {
      type: 'string'
    },

    last_name: {
      type: 'string'
    },

    email: {
      type: 'float'
    },

    weight: {
      type: 'float'
    },

    height: {
      type: 'float'
    },
    
    changed: {
      type: 'boolean'
    }
  }
};
