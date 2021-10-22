import Calendar from './app.js';


const date = document.querySelector('.calendar-container .left .date');
const years = document.querySelector('.calendar-container .right .years');
const months = document.querySelector('.calendar-container .right .months');
const weekdays = document.querySelector('.calendar-container .right .weekdays');
const days = document.querySelector('.calendar-container .right .days');


let cal = new Calendar();
renderAll();


function renderAll() {
  cal.render();
  renderLeft();
  renderRight();
}

function renderLeft() {
  date.querySelector('.day').textContent =        cal.today.day;
  date.querySelector('.weekday').textContent =    cal.today.weekday;
  date.querySelector('.date-full').textContent =  cal.today.date_full;
}

function renderRight() {
  // Changing years
  years.querySelector('.year').textContent = cal.full_year;
  cal.setYearClickEvents(years.querySelectorAll('.fas'), reRenderCalendar);

  // Changing months
  months.innerHTML = cal.domels_months;
  cal.setSelClassList(months);
  cal.setMonthClickEvents(months, reRenderCalendar);

  // Weekday list
  weekdays.innerHTML = cal.domels_weekdays;

  // Days
  days.innerHTML = cal.domels_days;
  cal.setTodayClassName(days);
  cal.setDayClickEvent(days, reRenderCalendar);
}

function reRenderCalendar() {
  // Re-rendering does not include Left side and does not render things that don't need re-rendering.
  cal.render();

  years.querySelector('.year').textContent = cal.full_year;

  cal.setSelClassList(months);

  days.innerHTML = cal.domels_days;
  cal.setTodayClassName(days);
  cal.setDayClickEvent(days, reRenderCalendar);
}