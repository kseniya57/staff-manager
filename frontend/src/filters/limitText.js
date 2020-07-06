export default {
  name: 'limit',
  handler: (value, limit) => {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
};
