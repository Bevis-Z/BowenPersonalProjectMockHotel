import React from 'react';
import LiquidChart from '../../src/Components/BookingDetails/LiquidChart';
import { mount } from 'cypress/react';

describe('LiquidChart Component Tests', () => {
  it('renders the LiquidChart', () => {
    // Mount the component with the required props
    mount(<LiquidChart value={50} max={100} />);

    // Check if the component is rendered
    cy.get('.liquid-chart-container').should('exist');
  });
  it('renders correctly with different props', () => {
    const testCases = [
      { value: 20, max: 100 },
      { value: 75, max: 200 },
      // Add more cases as needed
    ];

    testCases.forEach(({ value, max }) => {
      mount(<LiquidChart value={value} max={max} />);
      cy.get('.liquid-chart-container').should('exist');
    });
  });
});
