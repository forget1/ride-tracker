import type { RideRecord } from '../types';
import { formatDuration, formatDistance, formatExpense } from '../utils/date';

interface RecordListProps {
  records: RideRecord[];
  onEdit: (record: RideRecord) => void;
  onDelete: (id: string) => void;
}

export const RecordList = ({ records, onEdit, onDelete }: RecordListProps) => {
  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🚴</div>
        <p>暂无骑行记录</p>
        <p className="empty-hint">点击下方按钮添加记录</p>
      </div>
    );
  }

  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
  const totalDistance = records.reduce((sum, r) => sum + r.distance, 0);
  const totalExpense = records.reduce((sum, r) => sum + r.expense, 0);

  return (
    <div className="record-list">
      <div className="summary-card">
        <div className="summary-item">
          <span className="summary-value">{formatDuration(totalDuration)}</span>
          <span className="summary-label">总时长</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{formatDistance(totalDistance)}</span>
          <span className="summary-label">总距离</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{formatExpense(totalExpense)}</span>
          <span className="summary-label">总花费</span>
        </div>
      </div>
      <div className="records-container">
        {records.map(record => (
          <div key={record.id} className="record-card">
            <div className="record-content">
              <div className="record-main">
                <div className="record-icon">🚴</div>
                <div className="record-info">
                  <div className="record-duration">{formatDuration(record.duration)}</div>
                  <div className="record-distance">{formatDistance(record.distance)}</div>
                </div>
              </div>
              <div className="record-expense">{formatExpense(record.expense)}</div>
            </div>
            {record.note && (
              <div className="record-note">{record.note}</div>
            )}
            <div className="record-actions">
              <button className="action-btn edit-btn" onClick={() => onEdit(record)}>编辑</button>
              <button className="action-btn delete-btn" onClick={() => onDelete(record.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};