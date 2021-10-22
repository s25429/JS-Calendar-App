import { months } from './utils/month_list_en.mjs';
import { weekdays } from './utils/weekday_list_en.mjs';

class Calendar {
  constructor() {
    this.main = new Date();

    this.full_year =  null;
    this.month =      null;
    this.day =        null;
    this._weekday =   null;

    this.is_same_year =   null;
    this.is_same_month =  null;

    this._first_weekday = null;
    this._last_weekday =  null;
    this.last_day =       null;
    this.prev_last_day =  null;

    this.domels_days =      null;
    this.domels_months =    null;
    this.domels_weekdays =  null;

    this.today = this.setTodayDate();
  }


  // Main method

  render() {
    this.full_year =  this.main.getFullYear();
    this.month =      this.main.getMonth();
    this.day =        this.main.getDate();
    this.weekday =    this.main.getDay();

    this.is_same_year =   this.full_year === this.today.full_year;
    this.is_same_month =  this.month === this.today.month;

    this.first_weekday =  new Date(this.full_year, this.month, 1).getDay();
    this.last_weekday =   new Date(this.full_year, this.month + 1, 0).getDay();
    this.last_day =       new Date(this.full_year, this.month + 1, 0).getDate();
    this.prev_last_day =  new Date(this.full_year, this.month, 0).getDate();

    this.domels_days =      this.generateDays();
    this.domels_months =    this.generateMonths();
    this.domels_weekdays =  this.generateWeekdays();
  }


  // Other methods

  setTodayDate() {
    // i: Should be run only once in constructor!
    // i: Sets today's date for reference on the left side

    let full_year = this.main.getFullYear();
    let month =     this.main.getMonth();
    let day =       this.main.getDate();
    let weekday =   this.main.getDay() - 1 !== -1 
                      ? this.main.getDay() - 1 
                      : 6
    // ^ This needs value checking because I use format where Sunday is last and JS's Sunday has value of 0 by default.

    let ordinal = '';
    switch (day.toString().slice(-1)) {
      case '1': ordinal = 'st'; break;
      case '2': ordinal = 'nd'; break;
      case '3': ordinal = 'rd'; break;
      default:  ordinal = 'th'; break;
    }

    return {
      day:        day,
      weekday:    weekdays.full[weekday],
      month:      month,
      full_year:  full_year,
      date_full:  `${day}${ordinal} of ${months.full[month]} ${full_year}`,
    }
  }

  setYearClickEvents(btns, callback) {
    // i: Adds functionality to step whole years by pressing arrows

    for (const btn of btns) {
      btn.addEventListener('click', (e) => {
        this.stepYear(e);
        callback();
      });
    }
  }

  generateMonths() {
    // i: Creates month elements with keys to reference their values

    let months_dom = '';

    months.short.forEach((val, idx) => {
      months_dom += `<div key=${idx}>${val}</div>`;
    });

    return months_dom;
  }

  setMonthClickEvents(parent, callback) {
    // i: Adds functionality to step per month by pressing specific months

    for (const child of parent.children) {
      child.addEventListener('click', (e) => {
        this.stepMonth(e);
        callback();
      });
    }
  }

  setSelClassList(parent) {
    // i: Sets 'sel' class for selected month in Calendar App

    for (const child of parent.children) {
      if (child.classList.contains('sel'))
        child.classList.remove('sel');
      
      if (child.attributes.key.value === this.month.toString())
        child.classList.add('sel');
    }
  }

  generateWeekdays() {
    // i: Creates weekday elements

    let weekdays_dom = '';

    weekdays.short.forEach(val => {
      weekdays_dom += `<div>${val}</div>`;
    });

    return weekdays_dom;
  }

  generateDays() {
    // i: Creates days for the calendar, always 7 * 6 days

    let days = '';
    let remains_days = 7 * 6; // All the spots to fill

    for (let i = this.prev_last_day - this.first_weekday + 1; i <= this.prev_last_day; i++) {
      days += `<div class="prev-day">${i}</div>`;
      remains_days--;
    }

    for (let i = 1; i <= this.last_day; i++) {
      days += `<div class="curr-day">${i}</div>`;
      remains_days--;
    }

    for (let i = 1; i <= remains_days; i++) {
      days += `<div class="next-day">${i}</div>`;
    }

    return days;
  }

  setDayClickEvent(parent, callback) {
    // i: Adds functionality to step months by clicking days in prev/next months. For now only shows alert for current month's days

    for (const child of parent.children) {
      if (child.classList.contains('prev-day')) {
        child.addEventListener('click', () => {
          this.main.setMonth(this.month - 1);
          callback();
        });
      } else if (child.classList.contains('next-day')) {
        child.addEventListener('click', () => {
          this.main.setMonth(this.month + 1);
          callback();
        });
      } else if (child.classList.contains('curr-day')) {
        child.addEventListener('click', (e) => {
          alert('Pressed ' + e.target.textContent);
        });
      }
    }
  }

  setTodayClassName(parent) {
    // i: Sets class 'today' to current day by checking if it's current year, month or one month back/forth

    if (this.full_year !== this.today.full_year) return;

    let class_name = '';
    if (this.month === this.today.month) 
      class_name = 'curr-day';
    else if (this.month === this.today.month + 1)
      class_name = 'prev-day';
    else if (this.month === this.today.month - 1)
      class_name = 'next-day';
    else
      return;

    for (const child of parent.children) {
      if (!child.classList.contains(class_name)) continue;

      if (child.textContent === this.today.day.toString()) {
        child.classList.add('today');
        return;
      }
    }
  }


  // Event functions

  stepMonth(e) {
    // i: Steps to desired month based on key attribute from month list

    let num = parseInt(e.target.attributes.key.value);
    let step = -(this.month - num);

    this.main.setMonth(this.month + step);
  }

  stepYear(e) {
    // i: Steps whole year - 12 months, duh

    let step = 0;
    if (e.target.classList.contains('next-year'))
      step = 1;
    else if (e.target.classList.contains('prev-year'))
      step = -1;

    this.main.setMonth(this.month + step * 12);
  }


  // Getters and Setters

  get weekday() { return this._weekday; }

  set weekday(value) {
    if (--value === -1) this._weekday = 6;
    else              this._weekday = value;
  }

  get first_weekday() { return this._first_weekday; }

  set first_weekday(value) {
    if (--value === -1) this._first_weekday = 6;
    else                this._first_weekday = value;
  }

  get last_weekday() { return this._last_weekday; }

  set last_weekday(value) {
    if (--value === -1) this._last_weekday = 6;
    else                this._last_weekday = value;
  }
}

export default Calendar;