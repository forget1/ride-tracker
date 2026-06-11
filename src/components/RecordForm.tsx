import { useState, useEffect } from 'react';
import { showToast } from 'vant';
import type { RideRecord } from '../types';
import { parseDate } from '../utils/date';

interface RecordFormProps {
  date: string;
  record?: RideRecord | null;
  onSubmit: (record: Omit<RideRecord, 'id' | 'date'>) => void;
  onCancel: () => void;
}

export const RecordForm = ({ date, record, onSubmit, onCancel }: RecordFormProps) => {
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [expense, setExpense] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (record) {
      setDuration(record.duration.toString());
      setDistance(record.distance.toString());
      setExpense(record.expense.toString());
      setNote(record.note || '');
    } else {
      setDuration('');
      setDistance('');
      setExpense('');
      setNote('');
    }
  }, [record]);

  const handleSubmit = () => {
    const durationNum = parseInt(duration) || 0;
    const distanceNum = parseFloat(distance) || 0;
    const expenseNum = parseFloat(expense) || 0;

    if (durationNum <= 0 && distanceNum <= 0 && expenseNum <= 0) {
      showToast({
        message: '请至少填写一项内容',
        position: 'top',
      });
      return;
    }

    if (durationNum < 0) {
      showToast({
        message: '骑行时长不能为负数',
        position: 'top',
      });
      return;
    }

    if (distanceNum < 0) {
      showToast({
        message: '骑行距离不能为负数',
        position: 'top',
      });
      return;
    }

    if (expenseNum < 0) {
      showToast({
        message: '花费金额不能为负数',
        position: 'top',
      });
      return;
    }

    onSubmit({
      duration: durationNum,
      distance: distanceNum,
      expense: expenseNum,
      note: note || undefined,
    });
  };

  const parsedDate = parseDate(date);
  const formattedDate = `${parsedDate.getMonth() + 1}月${parsedDate.getDate()}日`;

  return (
    <div className="popup-overlay" onClick={onCancel}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="form-modal">
          <div className="form-header">
            <h3>{record ? '编辑记录' : '添加记录'}</h3>
            <button className="close-btn" onClick={onCancel}>×</button>
          </div>
          <div className="form-body">
            <div className="form-date">
              <span>📅</span>
              <span>{formattedDate}</span>
            </div>
            <div className="form-group">
              <label className="form-label">骑行时长（分钟）</label>
              <input
                type="number"
                className="form-input"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="输入骑行时长"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">骑行距离（公里）</label>
              <input
                type="number"
                className="form-input"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                placeholder="输入骑行距离"
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">当日花费（元）</label>
              <input
                type="number"
                className="form-input"
                value={expense}
                onChange={e => setExpense(e.target.value)}
                placeholder="输入花费金额"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label className="form-label">备注</label>
              <textarea
                className="form-textarea"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="添加备注（可选）"
                rows={3}
              />
            </div>
          </div>
          <div className="form-footer">
            <button className="btn btn-secondary" onClick={onCancel}>取消</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {record ? '保存' : '添加'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};