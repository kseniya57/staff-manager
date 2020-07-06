import moment from 'moment';

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

export default {
  name: 'date',
  // if currentDate - date > 2days then formatted date else time from date to now
  handler: value => {
    const date = +new Date(value);
    if (Date.now() - date > TWO_DAYS) {
      return moment(date).format('DD.MM.YYYY');
    }
    return moment(date).fromNow();
  }
};
