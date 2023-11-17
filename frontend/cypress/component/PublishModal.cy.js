import React from 'react';
import { mount } from 'cypress/react';
import PublishModal from '../../src/Components/HostingList/PublishModal';

describe('PublishModal Component Tests', () => {
  it('renders the PublishModal and interacts with elements', () => {
    const mockOnOk = cy.stub();
    const mockOnCancel = cy.stub();

    // Mount the component
    mount(<PublishModal visible={true} onOk={mockOnOk} onCancel={mockOnCancel} currentHostId={123} />);

  });
});
