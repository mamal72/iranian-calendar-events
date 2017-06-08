import test from 'ava';

import ice from '../';

test('day events', async (t) => {
  const events = await ice({ year: 1396, month: 1, day: 1 });
  const expectedHoliday = {
    day: 1,
    month: 1,
    year: 1396,
    isHoliday: true,
    title: 'جشن نوروز/جشن سال نو',
  };
  t.is(events.length, 1);
  t.deepEqual(events[0], expectedHoliday);
});

test('day events of all months', async (t) => {
  const events = await ice({ year: 1396, day: 1 });
  const expectedHoliday = {
    day: 1,
    month: 1,
    year: 1396,
    isHoliday: true,
    title: 'جشن نوروز/جشن سال نو',
  };
  t.is(events.length, 12);
  t.deepEqual(events[0][0], expectedHoliday);
});

test('month events', async (t) => {
  const events = await ice({ year: 1396, month: 1 });
  const expectedHoliday = {
    day: 1,
    month: 1,
    year: 1396,
    isHoliday: true,
    title: 'جشن نوروز/جشن سال نو',
  };
  t.is(events.length, 20);
  t.deepEqual(events[0], expectedHoliday);
});

test('year events', async (t) => {
  const months = await ice({ year: 1396 });
  const expectedHoliday = {
    day: 1,
    month: 1,
    year: 1396,
    isHoliday: true,
    title: 'جشن نوروز/جشن سال نو',
  };
  t.is(months.length, 12);
  t.deepEqual(months[0][0], expectedHoliday);
});

test('no year error', async (t) => {
  try {
    await ice({ month: 10 });
  } catch (e) {
    t.is(e.toString(), 'Error: no year specified');
  }
});

test('invalid month error', async (t) => {
  try {
    await ice({ year: 1395, month: 13 });
  } catch (e) {
    t.is(e.toString(), 'Error: invalid month number');
  }

  try {
    await ice({ year: 1395, month: 0 });
  } catch (e) {
    t.is(e.toString(), 'Error: invalid month number');
  }
});
