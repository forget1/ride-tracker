import { useEffect } from 'react';
import { Form, Input, Button } from 'antd-mobile';
import type { RideRecord } from '../types';
import { parseDate } from '../utils/date';

interface RecordFormProps {
  date: string;
  record?: RideRecord | null;
  onSubmit: (record: Omit<RideRecord, 'id' | 'date'>) => void;
  onCancel: () => void;
}

const RecordForm = ({ date, record, onSubmit, onCancel }: RecordFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        duration: record.duration.toString(),
        distance: record.distance.toString(),
        expense: record.expense.toString(),
        note: record.note || '',
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleSubmit = (values: Record<string, any>) => {
    const durationNum = parseInt(values.duration) || 0;
    const distanceNum = parseFloat(values.distance) || 0;
    const expenseNum = parseFloat(values.expense) || 0;

    if (durationNum <= 0 && distanceNum <= 0 && expenseNum <= 0) {
      form.setFields([{ name: 'duration', errors: ['请至少填写一项内容'] }]);
      return;
    }

    onSubmit({
      duration: durationNum,
      distance: distanceNum,
      expense: expenseNum,
      note: values.note || undefined,
    });
  };

  const parsedDate = parseDate(date);
  const formattedDate = `${parsedDate.getMonth() + 1}月${parsedDate.getDate()}日`;

  return (
    <div className="form-content">
      <div className="form-header"><h3>{record ? '编辑记录' : '添加记录'}</h3></div>
      <div className="form-body">
        <div className="form-date"><span>📅</span><span>{formattedDate}</span></div>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="duration" label="骑行时长（分钟）" rules={[{ validator: (_, value) => { if (!value) return Promise.resolve(); const num = parseInt(value); if (isNaN(num)) return Promise.reject(new Error('请输入有效的数字')); if (num < 0) return Promise.reject(new Error('骑行时长不能为负数')); if (num > 1440) return Promise.reject(new Error('骑行时长不能超过24小时')); return Promise.resolve(); } }]}>
            <Input type="number" placeholder="请输入骑行时长" />
          </Form.Item>

          <Form.Item name="distance" label="骑行距离（公里）" rules={[{ validator: (_, value) => { if (!value) return Promise.resolve(); const num = parseFloat(value); if (isNaN(num)) return Promise.reject(new Error('请输入有效的数字')); if (num < 0) return Promise.reject(new Error('骑行距离不能为负数')); if (num > 1000) return Promise.reject(new Error('骑行距离不能超过1000公里')); return Promise.resolve(); } }]}>
            <Input type="number" placeholder="请输入骑行距离" step="0.1" />
          </Form.Item>

          <Form.Item name="expense" label="当日花费（元）" rules={[{ validator: (_, value) => { if (!value) return Promise.resolve(); const num = parseFloat(value); if (isNaN(num)) return Promise.reject(new Error('请输入有效的数字')); if (num < 0) return Promise.reject(new Error('花费金额不能为负数')); if (num > 99999) return Promise.reject(new Error('花费金额不能超过99999元')); return Promise.resolve(); } }]}>
            <Input type="number" placeholder="请输入花费金额" step="0.01" />
          </Form.Item>

          <Form.Item name="note" label="备注">
            <Input placeholder="添加备注（可选）" />
          </Form.Item>

          <div className="form-footer">
            <Button block onClick={onCancel} className="btn-secondary">取消</Button>
            <Button color="primary" block onClick={() => form.submit()} className="btn-primary">{record ? '保存' : '添加'}</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RecordForm;
