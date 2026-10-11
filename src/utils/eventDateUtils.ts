import type { DistrictEvent, DayOfWeek } from '../types';

export interface ResolvedEventDate {
  dateObj: Date;
  isoDate: string; // YYYY-MM-DD
  formattedFull: string; // e.g. "Saturday, Oct 17, 2026"
  formattedDayDate: string; // e.g. "Sat, Oct 17"
  monthShort: string; // e.g. "OCT"
  dayNumber: string; // e.g. "17"
  dayOfWeek: string; // e.g. "Saturday"
  relativeBadge: string; // e.g. "Happening Today", "This Thursday", "Upcoming"
  isToday: boolean;
  isThisWeek: boolean;
}

const DAY_MAP: Record<DayOfWeek, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};

/**
 * Returns the Nth occurrence of a weekday in a given year and month (1-indexed month)
 * e.g. nthWeekdayOfMonth(2026, 10, 6, 3) = 3rd Saturday of Oct 2026
 */
function getNthWeekdayOfMonth(year: number, month1Indexed: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month1Indexed - 1, 1);
  let dayOffset = weekday - firstDay.getDay();
  if (dayOffset < 0) dayOffset += 7;
  const targetDate = 1 + dayOffset + (n - 1) * 7;
  return new Date(year, month1Indexed - 1, targetDate);
}

/**
 * Returns the last occurrence of a weekday in a given year and month
 */
function getLastWeekdayOfMonth(year: number, month1Indexed: number, weekday: number): Date {
  const lastDay = new Date(year, month1Indexed, 0); // last day of month
  let dayOffset = lastDay.getDay() - weekday;
  if (dayOffset < 0) dayOffset += 7;
  return new Date(year, month1Indexed - 1, lastDay.getDate() - dayOffset);
}

/**
 * Resolves the next upcoming exact calendar date for any event
 */
export function resolveEventDate(event: DistrictEvent, referenceDate: Date = new Date()): ResolvedEventDate {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const curYear = today.getFullYear();
  const curMonth = today.getMonth() + 1; // 1-12

  let exactTarget: Date | null = null;

  // 1. If explicit exactDate is provided (e.g. "2026-10-29")
  if (event.exactDate && /^\d{4}-\d{2}-\d{2}$/.test(event.exactDate)) {
    const [y, m, d] = event.exactDate.split('-').map(Number);
    const parsed = new Date(y, m - 1, d);
    if (!isNaN(parsed.getTime())) {
      exactTarget = parsed;
    }
  }

  // 2. If weekly recurring (e.g. recurringDay: "Friday")
  if (!exactTarget && event.recurringDay) {
    const targetWeekday = DAY_MAP[event.recurringDay];
    if (targetWeekday !== undefined) {
      const curWeekday = today.getDay();
      let diff = targetWeekday - curWeekday;
      if (diff < 0) diff += 7;
      exactTarget = new Date(today);
      exactTarget.setDate(today.getDate() + diff);
    }
  }

  // 3. Pattern match date string heuristics
  if (!exactTarget) {
    const dStr = event.date.toLowerCase();

    // Specific famous Old Towne annual festivals
    if (dStr.includes('halloween') || dStr.includes('treats in the streets')) {
      // Thursday before Halloween (Oct 31)
      const oct31Weekday = new Date(curYear, 9, 31).getDay(); // 0 is Sun, 6 is Sat
      let diff = oct31Weekday - 4; // 4 is Thursday
      if (diff <= 0) diff += 7;
      const thursDate = 31 - diff;
      let target = new Date(curYear, 9, thursDate);
      if (target < today) target = new Date(curYear + 1, 9, thursDate);
      exactTarget = target;
    } else if (dStr.includes('tree lighting') || dStr.includes('first sunday of december')) {
      let target = getNthWeekdayOfMonth(curYear, 12, 0, 1);
      if (target < today) target = getNthWeekdayOfMonth(curYear + 1, 12, 0, 1);
      exactTarget = target;
    } else if (dStr.includes('labor day') || dStr.includes('street fair')) {
      // Labor Day is first Monday in September; weekend starts Friday prior
      let firstMon = getNthWeekdayOfMonth(curYear, 9, 1, 1);
      let friPrior = new Date(firstMon);
      friPrior.setDate(firstMon.getDate() - 3);
      if (friPrior < today) {
        firstMon = getNthWeekdayOfMonth(curYear + 1, 9, 1, 1);
        friPrior = new Date(firstMon);
        friPrior.setDate(firstMon.getDate() - 3);
      }
      exactTarget = friPrior;
    } else if (dStr.includes('summer twilight') || dStr.includes('june - august')) {
      // Next summer season kickoff
      let target = new Date(curYear, 5, 2); // June 2
      if (target < today) target = new Date(curYear + 1, 5, 2);
      exactTarget = target;
    } else if (dStr.includes('third saturday')) {
      let target = getNthWeekdayOfMonth(curYear, curMonth, 6, 3);
      if (target < today) {
        target = getNthWeekdayOfMonth(curYear, curMonth + 1, 6, 3);
      }
      exactTarget = target;
    } else if (dStr.includes('first saturday')) {
      let target = getNthWeekdayOfMonth(curYear, curMonth, 6, 1);
      if (target < today) {
        target = getNthWeekdayOfMonth(curYear, curMonth + 1, 6, 1);
      }
      exactTarget = target;
    } else if (dStr.includes('second saturday')) {
      let target = getNthWeekdayOfMonth(curYear, curMonth, 6, 2);
      if (target < today) {
        target = getNthWeekdayOfMonth(curYear, curMonth + 1, 6, 2);
      }
      exactTarget = target;
    } else if (dStr.includes('first sunday')) {
      let target = getNthWeekdayOfMonth(curYear, curMonth, 0, 1);
      if (target < today) {
        target = getNthWeekdayOfMonth(curYear, curMonth + 1, 0, 1);
      }
      exactTarget = target;
    } else if (dStr.includes('second thursday')) {
      let target = getNthWeekdayOfMonth(curYear, curMonth, 4, 2);
      if (target < today) {
        target = getNthWeekdayOfMonth(curYear, curMonth + 1, 4, 2);
      }
      exactTarget = target;
    } else if (dStr.includes('third thursday')) {
      let target = getNthWeekdayOfMonth(curYear, curMonth, 4, 3);
      if (target < today) {
        target = getNthWeekdayOfMonth(curYear, curMonth + 1, 4, 3);
      }
      exactTarget = target;
    } else if (dStr.includes('last thursday')) {
      let target = getLastWeekdayOfMonth(curYear, curMonth, 4);
      if (target < today) {
        target = getLastWeekdayOfMonth(curYear, curMonth + 1, 4);
      }
      exactTarget = target;
    } else if (dStr.includes('second wednesday')) {
      let target = getNthWeekdayOfMonth(curYear, curMonth, 3, 2);
      if (target < today) {
        target = getNthWeekdayOfMonth(curYear, curMonth + 1, 3, 2);
      }
      exactTarget = target;
    } else if (dStr.includes('last wednesday')) {
      let target = getLastWeekdayOfMonth(curYear, curMonth, 3);
      if (target < today) {
        target = getLastWeekdayOfMonth(curYear, curMonth + 1, 3);
      }
      exactTarget = target;
    }
  }

  // Fallback to today if nothing matched
  if (!exactTarget) {
    exactTarget = new Date(today);
  }

  exactTarget.setHours(0, 0, 0, 0);

  // Formatting helpers
  const diffDays = Math.round((exactTarget.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isToday = diffDays === 0;
  const isThisWeek = diffDays >= 0 && diffDays <= 6;

  let relativeBadge = 'Upcoming';
  if (isToday) {
    relativeBadge = 'Happening Today';
  } else if (diffDays === 1) {
    relativeBadge = 'Tomorrow';
  } else if (diffDays > 1 && diffDays <= 6) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    relativeBadge = `This ${dayNames[exactTarget.getDay()]}`;
  } else if (diffDays > 6 && diffDays <= 14) {
    relativeBadge = 'Next Week';
  }

  const yearStr = exactTarget.getFullYear();
  const monthStr = String(exactTarget.getMonth() + 1).padStart(2, '0');
  const dayStr = String(exactTarget.getDate()).padStart(2, '0');
  const isoDate = `${yearStr}-${monthStr}-${dayStr}`;

  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthShort = monthNamesShort[exactTarget.getMonth()].toUpperCase();
  const dayNumber = String(exactTarget.getDate());

  const fullWeekday = exactTarget.toLocaleDateString('en-US', { weekday: 'long' });
  const shortWeekday = exactTarget.toLocaleDateString('en-US', { weekday: 'short' });
  const monthLong = exactTarget.toLocaleDateString('en-US', { month: 'short' });

  const formattedFull = `${fullWeekday}, ${monthLong} ${exactTarget.getDate()}, ${yearStr}`;
  const formattedDayDate = `${shortWeekday}, ${monthLong} ${exactTarget.getDate()}`;

  return {
    dateObj: exactTarget,
    isoDate,
    formattedFull,
    formattedDayDate,
    monthShort,
    dayNumber,
    dayOfWeek: fullWeekday,
    relativeBadge,
    isToday,
    isThisWeek
  };
}
