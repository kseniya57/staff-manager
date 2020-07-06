const formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

export const moneyFormat = (value, currency = '₽') =>
  `${formatter.format(+value).replace(/,/g, ' ')} ${currency}`;

export default {
  name: 'money',
  handler: moneyFormat
};
