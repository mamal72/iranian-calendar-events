[![Build Status](https://travis-ci.org/mamal72/iranian-calendar-events.svg?branch=master)](https://travis-ci.org/mamal72/iranian-calendar-events)
[![license](https://img.shields.io/github/license/mamal72/iranian-calendar-events.svg)](https://github.com/mamal72/iranian-calendar-events/blob/master/LICENSE)

# iranian-calendar-events

A simple package to fetch Iranian calendar events (Jalali, Hijri, Gregorian) from [time.ir](http://www.time.ir) website.

## Installation

```bash
npm i iranian-calendar-events
# or
yarn add iranian-calendar-events
```

## Usage

```js
import ice from 'iranian-calendar-events';

(async () => {
  const yearEvents = await ice({ year: 1396 }); // all events of the year
  const monthEvents = await ice({ year: 1396, month: 12 }); // all events of the month
  const dayEvents = await ice({ year: 1396, month: 12, day: 15 }); // all events of a day
  const dayEventsInAllMonths = await ice({ year: 1396, day: 15 }); // all events of a day number in all months
  // That's it! You can use them now!
})();
```

## Ideas or Issues

Create an issue and describe it. I'll check it ASAP!

## Contribution

You can fork the repository, improve or fix some part of it and then send the pull requests back if you want to see them here. I really appreciate that. :heart:

Remember to write a few tests for your code before sending pull requests.

## License

Licensed under the [MIT License](https://github.com/mamal72/iranian-calendar-events/blob/master/LICENSE).
