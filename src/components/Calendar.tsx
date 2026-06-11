import { useState, useEffect } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, parseDate } from '../utils/date';
import type { RideRecord } from '../types';

interface CalendarProps {
  currentDate: string;
  onDateSelect: (date: string) => void;
  records: RideRecord[];
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export const Calendar = ({ currentDate, onDateSelect, records }: CalendarProps) => {
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);

  useEffect(() => {
    const date = parseDate(currentDate);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  }, [currentDate]);

  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    onDateSelect(`${newYear}-${String(newMonth).padStart(2, '0')}-01`);
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    onDateSelect(`${newYear}-${String(newMonth).padStart(2, '0')}-01`);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const hasRecords = (day: number): boolean => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.some(r => r.date === dateStr);
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
  };

  const isSelected = (day: number): boolean => {
    const date = parseDate(currentDate);
    return year === date.getFullYear() && month === date.getMonth() + 1 && day === date.getDate();
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(dateStr);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const hasRecord = hasRecords(day);
      const isTodayDay = isToday(day);
      const isSelectedDay = isSelected(day);
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasRecord ? 'has-record' : ''} ${isTodayDay ? 'today' : ''} ${isSelectedDay ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
          {hasRecord && <span className="record-dot" />}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>‹</button>
        <div className="month-title">{year}年{month}月</div>
        <button className="nav-btn" onClick={handleNextMonth}>›</button>
      </div>
      <div className="weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="days-grid">
        {renderDays()}
      </div>
    </div>
  );
};