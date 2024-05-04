import { formatRelative, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

const formatRelativeLocale = {
  lastWeek: 'MMM, dd',
  nextWeek: 'MMM, dd',
  other: 'MMM, dd',
  today: "hh:mm aaaaa'm'",
  tomorrow: 'MMM, dd',
  yesterday: "'Yesterday'",
};

export const locale: Locale = {
  ...enUS,
  formatRelative: (token: keyof typeof formatRelativeLocale) =>
    formatRelativeLocale[token],
  options: {
    weekStartsOn: 1,
  },
};
