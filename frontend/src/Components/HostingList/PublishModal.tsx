import { Modal, DatePicker, message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface PublishModalProps {
  visible: boolean;
  onOk: (selectedDates: string[]) => void;
  onCancel: () => void;
  currentHostId: number;
}

// This is the PublishModal component that will be rendered when user clicks on the Publish button
const PublishModal: React.FC<PublishModalProps> = ({ visible, onOk, onCancel, currentHostId }) => {
  const [selectedDates, setSelectedDates] = useState<RangePickerProps['value']>(null);
  console.log('currentHostId', currentHostId);
  const handleOk = () => {
    if (selectedDates && selectedDates[0] && selectedDates[1]) {
      const allDates = enumerateDaysBetweenDates(selectedDates[0], selectedDates[1]);
      handlePublishRequest(currentHostId, allDates);
      onOk(allDates);
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
      message.success('Publish successfully');
    } catch (error) {
      message.error('Failed to publish.');
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
