const today = moment().format('YYYY-MM-DD');

const fullMoonDays = ['2020-03-09', '2020-04-08', '2020-05-07', '2020-06-05', '2020-07-05', '2020-08-03', '2020-09-02', '2020-10-01', '2020-10-31', '2020-11-30', '2020-12-30'];
const newMoonDays = ['2020-02-23', '2020-03-24', '2020-04-23', '2020-05-22', '2020-06-21', '2020-07-20', '2020-08-19', '2020-09-17', '2020-10-16', '2020-11-15', '2020-12-14'];

const nextFull = fullMoonDays.find(el => moment(el, 'YYYY-MM-DD').format('YYYY-MM-DD') >= today);
const nextNew = newMoonDays.find(el => moment(el, 'YYYY-MM-DD').format('YYYY-MM-DD') >= today);

const diff = moment(nextFull).diff(today, 'days');
const diffNew = moment(nextNew).diff(today, 'days');

const type = diff < diffNew ? "Full Moon" : 'New Moon';
const diffText = Math.min(diff, diffNew) > 1 ? `${Math.min(diff, diffNew)} days` : Math.min(diff, diffNew) === 1 ? `1 day` : '';

let className = '';
if (diff < diffNew) {
  className = diffNew > 0 ? `moon-full-${diff}` : 'moon-full';
} else {
  className = diffNew > 0 ? `moon-new-${diffNew}` : 'moon-new';

}
//className = 'moon-full-6'
const MOON = document.getElementById("moon");
const TYPE = document.getElementById("type");
const COUNT = document.getElementById("count");
MOON.classList.add(className);
TYPE.innerHTML = type;
COUNT.innerHTML = diffText;