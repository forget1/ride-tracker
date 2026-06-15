import { useState, useEffect } from 'react';
import { Calendar, Card, Button, Popup, Toast, Modal } from 'antd-mobile';
import { addRecord, updateRecord, deleteRecord, getRecordsByDate, generateId } from './utils/storage';
import { getToday, formatDuration, formatDistance, formatExpense } from './utils/date';
import type { RideRecord } from './types';
import RecordForm from './components/RecordForm';
import './styles/app.scss';

function App() {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [selectedRecords, setSelectedRecords] = useState<RideRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RideRecord | null>(null);

  useEffect(() => {
    setSelectedRecords(getRecordsByDate(currentDate));
  }, [currentDate]);

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setCurrentDate(date.toISOString().split('T')[0]);
    }
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
    Modal.confirm({
      content: '确定要删除这条记录吗？',
      confirmText: '确定',
      cancelText: '取消',
      onConfirm: () => {
        deleteRecord(id);
        setSelectedRecords(getRecordsByDate(currentDate));
        Toast.show('删除成功');
      },
    });
  };

  const handleFormSubmit = (data: Omit<RideRecord, 'id' | 'date'>) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
      Toast.show('保存成功');
    } else {
      addRecord({ ...data, id: generateId(), date: currentDate });
      Toast.show('添加成功');
    }
    setSelectedRecords(getRecordsByDate(currentDate));
    setShowForm(false);
    setEditingRecord(null);
  };

  const totalDuration = selectedRecords.reduce((sum, r) => sum + r.duration, 0);
  const totalDistance = selectedRecords.reduce((sum, r) => sum + r.distance, 0);
  const totalExpense = selectedRecords.reduce((sum, r) => sum + r.expense, 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🚴 骑行记录</h1>
        <div className="selected-date">
          <span className="date-main">{new Date(currentDate).getMonth() + 1}月{new Date(currentDate).getDate()}日</span>
          <span className="date-week">{['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date(currentDate).getDay()]}</span>
        </div>
      </header>

      <main className="app-main">
        <Card className="calendar-card">
          <Calendar selectionMode="single" defaultValue={new Date(currentDate)} onChange={handleDateSelect} />
        </Card>

        <Card className="records-card">
          <div className="section-header">
            <h2>当日记录</h2>
            <Button color="primary" size="small" onClick={handleAddRecord} className="add-btn">+ 添加记录</Button>
          </div>

          {selectedRecords.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🚴</span>
              <p>暂无骑行记录</p>
              <p className="empty-hint">点击上方按钮添加记录</p>
            </div>
          ) : (
            <>
              <div className="summary-card">
                <div className="summary-item"><span className="summary-value">{formatDuration(totalDuration)}</span><span className="summary-label">总时长</span></div>
                <div className="summary-item"><span className="summary-value">{formatDistance(totalDistance)}</span><span className="summary-label">总距离</span></div>
                <div className="summary-item"><span className="summary-value">{formatExpense(totalExpense)}</span><span className="summary-label">总花费</span></div>
              </div>

              <div className="records-container">
                {selectedRecords.map(record => (
                  <Card key={record.id} className="record-card">
                    <div className="record-content">
                      <div className="record-main">
                        <span className="record-icon">🚴</span>
                        <div className="record-info">
                          <div className="record-duration">{formatDuration(record.duration)}</div>
                          <div className="record-distance">{formatDistance(record.distance)}</div>
                        </div>
                      </div>
                      <div className="record-expense">{formatExpense(record.expense)}</div>
                    </div>
                    {record.note && <div className="record-note">{record.note}</div>}
                    <div className="record-actions">
                      <Button color="primary" size="small" onClick={() => handleEditRecord(record)} className="edit-btn">编辑</Button>
                      <Button size="small" onClick={() => handleDeleteRecord(record.id)} className="delete-btn">删除</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </main>

      <Popup visible={showForm} position="bottom" onClose={() => { setShowForm(false); setEditingRecord(null); }}>
        <RecordForm date={currentDate} record={editingRecord} onSubmit={handleFormSubmit} onCancel={() => { setShowForm(false); setEditingRecord(null); }} />
      </Popup>
    </div>
  );
}

export default App;
