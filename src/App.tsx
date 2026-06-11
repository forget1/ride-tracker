import { useState, useEffect } from 'react';
import { showConfirmDialog } from 'vant';
import { Calendar } from './components/Calendar';
import { RecordList } from './components/RecordList';
import { RecordForm } from './components/RecordForm';
import { getRecords, addRecord, updateRecord, deleteRecord, getRecordsByDate, generateId } from './utils/storage';
import { getToday, parseDate } from './utils/date';
import type { RideRecord } from './types';
import './styles/app.scss';

function App() {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [records, setRecords] = useState<RideRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<RideRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RideRecord | null>(null);

  useEffect(() => {
    const allRecords = getRecords();
    setRecords(allRecords);
    setSelectedRecords(getRecordsByDate(currentDate));
  }, []);

  useEffect(() => {
    setSelectedRecords(getRecordsByDate(currentDate));
  }, [currentDate]);

  const handleDateSelect = (date: string) => {
    setCurrentDate(date);
  };

  const handleAddRecord = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEditRecord = (record: RideRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDeleteRecord = (id: string) => {
    showConfirmDialog({
      title: '提示',
      message: '确定要删除这条记录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      deleteRecord(id);
      const updatedRecords = getRecords();
      setRecords(updatedRecords);
      setSelectedRecords(getRecordsByDate(currentDate));
    }).catch(() => {
    });
  };

  const handleFormSubmit = (data: Omit<RideRecord, 'id' | 'date'>) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
    } else {
      addRecord({
        ...data,
        id: generateId(),
        date: currentDate,
      });
    }
    const updatedRecords = getRecords();
    setRecords(updatedRecords);
    setSelectedRecords(getRecordsByDate(currentDate));
    setShowForm(false);
    setEditingRecord(null);
  };

  const parsedDate = parseDate(currentDate);
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayOfWeek = weekDays[parsedDate.getDay()];

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🚴 骑行记录</h1>
        <div className="selected-date">
          <span className="date-main">
            {parsedDate.getMonth() + 1}月{parsedDate.getDate()}日
          </span>
          <span className="date-week">{dayOfWeek}</span>
        </div>
      </header>

      <main className="app-main">
        <Calendar
          currentDate={currentDate}
          onDateSelect={handleDateSelect}
          records={records}
        />

        <div className="records-section">
          <div className="section-header">
            <h2>当日记录</h2>
            <button className="add-btn" onClick={handleAddRecord}>
              + 添加记录
            </button>
          </div>
          <RecordList
            records={selectedRecords}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        </div>
      </main>

      {showForm && (
        <RecordForm
          date={currentDate}
          record={editingRecord}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
        />
      )}
    </div>
  );
}

export default App;