import {Currency, CurrencySign} from '../enums/currency.enum';
import * as moment from 'moment';

const formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

export const moneyFormat = (amount: string | number, currency: Currency = Currency.RUB) => `${formatter.format(+amount).replace(/,/g, ' ')} ${CurrencySign[currency]}`;

const TIME_BREAKPOINT = 1000 * 60 * 60 * 24;

export const dateFormat = (date: number | string, format = 'DD.MM.YYYY HH:mm:SS') => (Date.now() - +new Date(date) > TIME_BREAKPOINT) ? moment(date).format(format) : moment(date).locale('ru').fromNow();
