const Axios = require('axios').default;
const express = require('express');
const app = express();

const isNumber = a => !isNaN(Number(a));
const isSize = obj => !!obj && isNumber(obj.width) && isNumber(obj.length) && isNumber(obj.height);
const cubicWeight = ({ width, length, height }) => (width / 100) * (length / 100) * (height / 100) * 250;
const itemFilter = ({ size, category }) => category === 'Air Conditioners' && isSize(size);

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

  const countItem = item => ({ counter, sum } = { counter: counter + 1, sum: sum + item });

  let { data } = await Axios.get(initial);

  while (data.next) {
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
