import fetch from 'node-fetch';
import cheerio from 'cheerio';
import FormData from 'form-data';

// The URL to use for posting forms
const REQUEST_URL = 'http://www.time.ir/';

// Simply, normalizes the input text
// replace Persian numeric chars with English ones
// removes the redundant chars like \n and whitespaces around
const normalize = (text) => {
  const sourceChars = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '\n'];
  const destinationChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ''];
  let result = text;
  sourceChars.forEach((item, index) => {
    result = result.replace(new RegExp(item, 'g'), destinationChars[index]);
  });
  return result.trim();
};

export default async function getEvents({ year, month }) {
  // We need year prop at least
  if (!year) {
    throw new Error('no year specified');
  }

  // If month is not present, we'll return all events of the year
  if (!month) {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return Promise.all(months.map(m => getEvents({ year, month: m })));
  }

  // Validate month number (1 >= month <= 12)
  if (month < 1 || month > 12) {
    throw new Error('invalid month number');
  }

  // Create a form to send as request body
  const form = new FormData();
  form.append('responsive', 'true');
  form.append('year', year);
  form.append('month', month);

  // Send the request with POST method
  const response = await fetch(REQUEST_URL, {
    method: 'POST',
    body: form,
  });

  // It's failed if it's not a 200
  if (response.status !== 200) {
    throw new Error('error getting data from server', response.status);
  }

  // Get response text data (HTML) and parse it
  const data = await response.text();
  const $ = cheerio.load(data);
  // Event items query selector
  const listItems = $('.list-unstyled li');
  const events = [];
  listItems.each((index, elem) => {
    const event = {
      day: parseInt(normalize(elem.children[1].children[0].data.substring(0, 2)), 10),
      month,
      year,
      isHoliday: elem.attribs.class === 'eventHoliday',
      title: normalize(elem.children[2].data),
    };
    events.push(event);
  });
  return events;
}
