const Axios = require('axios').default;
const express = require('express');
const app = express();

const isNumber = a => !isNaN(Number(a));
// I haven't seen any examples of "corrputed" data, but checking for the values just in case
// Would actually make sense to add checks for 0 values too, how should those be handled
const isSize = obj => !!obj && isNumber(obj.width) && isNumber(obj.length) && isNumber(obj.height);
// Seeing as each item has it's own value, the constant (250) seems like it should be coming from the item too
const cubicWeight = ({ width, length, height }) => (width / 100) * (length / 100) * (height / 100) * 250;
const itemFilter = ({ size, category }) => category === 'Air Conditioners' && isSize(size);

// Environment variables for deployment.
const domain = process.env.DOMAIN || '';
const initial = process.env.INITIAL || '';
const port = process.env.PORT || 5000;

async function main() {
  if (!domain || !initial) {
    return 'Error: Missing domain and initial page.';
  }
  Axios.defaults.baseURL = domain;

  let counter = 0,
    sum = 0;

  // I was thinking of making this a pure function originally
  // But decided against it, as mutation keeps it simple (vs reducing over the items).
  const countItem = item => ({ counter, sum } = { counter: counter + 1, sum: sum + item });

  let { data } = await Axios.get(initial);

  // Repeat until the next in the object is falsy. Assume no network errors ever happen.
  while (data.next) {
    // This could be done with .filter().forEach(), but this way we can loop only once over these new items
    // Instead, just short circuit for filters and keep it in as one line.
    data.objects.forEach(v => itemFilter(v) && countItem(cubicWeight(v.size)));
    data = (await Axios.get(data.next)).data;
  }
  const average = sum / counter;
  console.log(`Average weight: ${average}`);
  return average;
}

// For runs from the console
main();

app.get('/', async (_, res) => res.send({ response: await main() }));
app.listen(port, () => console.log(`listening on ${port}`));
