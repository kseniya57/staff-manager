const addSubscriptions = function(
  prefix,
  storeKey,
  queries,
  variables,
  addQuery = true,
  key
) {
  if (!key) {
    key = storeKey;
  }

  if (addQuery) {
    this.$apollo.addSmartQuery(key, queries.all);
  }

  this.$apollo.queries[key].subscribeToMore({
    document: queries.added,
    variables,
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { [`${prefix}Added`]: added }
        }
      }
    ) => {
      if (previousResult[storeKey].find(item => item.id === added.id)) {
        return previousResult;
      }
      return {
        [storeKey]: [...previousResult[storeKey], added]
      };
    }
  });

  this.$apollo.queries[key].subscribeToMore({
    document: queries.updated,
    variables,
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { [`${prefix}Updated`]: updated }
        }
      }
    ) => {
      const old = previousResult[storeKey].find(item => item.id === updated.id);
      if (old) {
        Object.assign(old, updated);
      }
      return {
        [storeKey]: previousResult[storeKey]
      };
    }
  });

  this.$apollo.queries[key].subscribeToMore({
    document: queries.deleted,
    variables,
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { [`${prefix}Deleted`]: deletedId }
        }
      }
    ) => {
      return {
        [storeKey]: previousResult[storeKey].filter(
          item => item.id !== deletedId
        )
      };
    }
  });
};

export default {
  install: Vue => (Vue.prototype.$addSubscriptions = addSubscriptions)
};
