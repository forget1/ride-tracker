import { Calendar, Card, Button, Popup, Toast, Modal } from 'antd-mobile';
import { useAppState, useAppDispatch } from './store/context';
import { selectRecordsByDate, selectTotals } from './store/selectors';
import { generateId } from './utils/storage';
import { formatDuration, formatDistance, formatExpense } from './utils/date';
import type { RideRecord } from './types';
import RecordForm from './components/RecordForm';
import './styles/app.scss';

function App() {
  const { currentDate, records, showForm, editingRecord } = useAppState();
  const dispatch = useAppDispatch();

  const selectedRecords = selectRecordsByDate(records, currentDate);
  const totals = selectTotals(records, currentDate);

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      dispatch({ type: 'SET_DATE', payload: date.toISOString().split('T')[0] });
    }
  };

  const handleDeleteRecord = (id: string) => {
    Modal.confirm({
      content: '确定要删除这条记录吗？',
      confirmText: '确定',
      cancelText: '取消',
      onConfirm: () => {
        dispatch({ type: 'DELETE_RECORD', payload: id });
        Toast.show('删除成功');
      },
    });
  };

  const handleFormSubmit = (data: Omit<RideRecord, 'id' | 'date'>) => {
    if (editingRecord) {
      dispatch({ type: 'UPDATE_RECORD', payload: { id: editingRecord.id, data } });
      Toast.show('保存成功');
    } else {
      dispatch({ type: 'ADD_RECORD', payload: { ...data, id: generateId(), date: currentDate } });
      Toast.show('添加成功');
    }
    dispatch({ type: 'CLOSE_FORM' });
  };

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
            <Button color="primary" size="small" onClick={() => dispatch({ type: 'OPEN_FORM' })} className="add-btn">+ 添加记录</Button>
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
                <div className="summary-item"><span className="summary-value">{formatDuration(totals.duration)}</span><span className="summary-label">总时长</span></div>
                <div className="summary-item"><span className="summary-value">{formatDistance(totals.distance)}</span><span className="summary-label">总距离</span></div>
                <div className="summary-item"><span className="summary-value">{formatExpense(totals.expense)}</span><span className="summary-label">总花费</span></div>
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
                      <Button color="primary" size="small" onClick={() => dispatch({ type: 'OPEN_FORM', payload: record })} className="edit-btn">编辑</Button>
                      <Button size="small" onClick={() => handleDeleteRecord(record.id)} className="delete-btn">删除</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </main>

      <Popup visible={showForm} position="bottom" onClose={() => dispatch({ type: 'CLOSE_FORM' })}>
        <RecordForm date={currentDate} record={editingRecord} onSubmit={handleFormSubmit} onCancel={() => dispatch({ type: 'CLOSE_FORM' })} />
      </Popup>
    </div>
  );
}

export default App;
