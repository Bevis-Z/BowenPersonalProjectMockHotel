import { Modal, DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import React, { useState } from 'react';
// ... 其他必要的导入 ...

interface PublishModalProps {
  visible: boolean;
  onOk: (selectedDates: RangePickerProps['value']) => void;
  onCancel: () => void;
  currentHostId: number;
}

const PublishModal: React.FC<PublishModalProps> = ({ visible, onOk, onCancel, currentHostId }) => {
  const [selectedDates, setSelectedDates] = useState<RangePickerProps['value']>(null);
  console.log('currentHostId', currentHostId);
  const handleOk = () => {
    onOk(selectedDates);
    handlePublishRequest(currentHostId);
  };
  const handlePublishRequest = async (currentHostId:number) => {
    try {
      await fetch(`http://localhost:5005/listings/publish/${currentHostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ availability: selectedDates })
      });
      alert('Request sent successfully');
    } catch (error) {
      console.error('Failed to send publish request:', error);
      alert('Failed to send publish request.');
    }
  }
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
