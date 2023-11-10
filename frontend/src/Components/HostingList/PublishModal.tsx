import { Modal, DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
// ... 其他必要的导入 ...

interface PublishModalProps {
  visible: boolean;
  onOk: (selectedDates: string[]) => void; // 更改类型为 string[]
  onCancel: () => void;
  currentHostId: number;
}

const PublishModal: React.FC<PublishModalProps> = ({ visible, onOk, onCancel, currentHostId }) => {
  const [selectedDates, setSelectedDates] = useState<RangePickerProps['value']>(null);
  console.log('currentHostId', currentHostId);
  const handleOk = () => {
    if (selectedDates && selectedDates[0] && selectedDates[1]) {
      const allDates = enumerateDaysBetweenDates(selectedDates[0], selectedDates[1]);
      handlePublishRequest(currentHostId, allDates);
      onOk(allDates); // 调用 onOk 属性
    }
  };

  const handlePublishRequest = async (currentHostId: number, dates: string[]) => {
    try {
      await fetch(`http://localhost:5005/listings/publish/${currentHostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ availability: dates })
      });
      alert('Request sent successfully');
    } catch (error) {
      console.error('Failed to send publish request:', error);
      alert('Failed to send publish request.');
    }
  };
  return (
    <Modal title="Select Availability" open={visible} onOk={handleOk} onCancel={onCancel}>
      <DatePicker.RangePicker
        onChange={setSelectedDates}
        format="YYYY-MM-DD"
      />
    </Modal>
  );
};

export default PublishModal;

function enumerateDaysBetweenDates (startDate: Dayjs, endDate: Dayjs): string[] {
  const dates = [];
  let currentDate = dayjs(startDate);

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }

  return dates;
}
