'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// The base URL for events requests
const REQUEST_BASE_URL = 'http://www.time.ir/fa/event/list/0';

// Normalizes the input text
// replace Persian numeric chars with English ones
// removes the redundant chars like \n and whitespaces around
const normalize = text => {
  const sourceChars = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '\n'];
  const destinationChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ''];
  let result = text;
  sourceChars.forEach((item, index) => {
    result = result.replace(new RegExp(item, 'g'), destinationChars[index]);
  });
  return result.trim();
};

// Returns request URL for events requests
const getRequstUrl = ({ year, month, day }) => {
  let url = REQUEST_BASE_URL;
  if (year) {
    url = `${url}/${year}`;
  }
  if (month) {
    url = `${url}/${month}`;
  }
  if (day) {
    url = `${url}/${day}`;
  }
  return url;
};

exports.default = (() => {
  var _ref = _asyncToGenerator(function* ({ year, month, day }) {
    // We need year prop at least
    if (!year) {
      throw new Error('no year specified');
    }

    // If month is not present, we'll return all events of the year
    if (!month) {
      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      return Promise.all(months.map(function (m) {
        return getEvents({ year, month: m, day });
      }));
    }

    // Validate month number (1 >= month <= 12)
    if (month < 1 || month > 12) {
      throw new Error('invalid month number');
    }

    // Get events request URL
    const requestUrl = getRequstUrl({ year, month, day });

    // Send the request
    const response = yield (0, _nodeFetch2.default)(requestUrl);

    // It's failed if it's not a 200
    if (response.status !== 200) {
      throw new Error('error getting data from server', response.status);
    }

    // Get response text data (HTML) and parse it
    const data = yield response.text();
    const $ = _cheerio2.default.load(data);
    // Event items query selector
    const listItems = $('.list-unstyled li');
    const events = [];
    listItems.each(function (index, elem) {
      const event = {
        day: parseInt(normalize(elem.children[1].children[0].data.substring(0, 2)), 10),
        month,
        year,
        isHoliday: elem.attribs.class.trim() === 'eventHoliday',
        title: normalize(elem.children[2].data)
      };
      events.push(event);
    });
    return events;
  });

  function getEvents(_x) {
    return _ref.apply(this, arguments);
  }

  return getEvents;
})();