import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IncomeInformation from './incomeInfo'; // Adjust the import path based on your file structure

describe('IncomeInformation Component', () => {
    const mockProps = {
        values: {
          annualIncome: 50000,
          requestedGrant: 10000,
          activeKey: null,
          vendors: [
            {
              id: 1,
              name: 'Vendor 1',
              dollar: 1000,
              family: 'Smith',
              account: '123',
              address: '123 Street',
              city: 'New York',
              state: 'NY',
              zip: '10001',
            },
            {
              id: 2,
              name: 'Vendor 2',
              dollar: 2000,
              family: 'Johnson',
              account: '456',
              address: '456 Avenue',
              city: 'San Francisco',
              state: 'CA',
              zip: '94101',
            },
          ],
        },
        handleChange: jest.fn(),
        handleVendorChange: jest.fn(),
        addVendor: jest.fn(),
        deleteVendor: jest.fn(),
        toggleAccordion: jest.fn(),
        prevPage: jest.fn(),
        nextPage: jest.fn(),
      };

  test('renders the form fields correctly', () => {
    render(<IncomeInformation {...mockProps} />);

    // Check if the annual income and grant amount fields are present
    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Request Grant Amount/i)).toBeInTheDocument();

    // Check that the vendor accordion renders correctly
    expect(screen.getByText('Vendor 1: Vendor 1')).toBeInTheDocument();
    expect(screen.getByText('Vendor 2: Vendor 2')).toBeInTheDocument();
  });
  

  test('add vendor button works', () => {
    render(<IncomeInformation {...mockProps} />);

    const addVendorButton = screen.getByText('Add Vendor');
    fireEvent.click(addVendorButton);

    // Ensure addVendor function is called when button is clicked
    expect(mockProps.addVendor).toHaveBeenCalledTimes(1);
  });

  test('delete vendor button works correctly', () => {
    render(<IncomeInformation {...mockProps} />);

    // Find the delete button for Vendor 2 (using Vendor 2's information)
    const deleteButton = screen.getAllByText('Delete Vendor')[1]; // Get the second delete button

    // Simulate clicking the delete button for Vendor 2
    fireEvent.click(deleteButton);

    // Ensure the deleteVendor method was called with Vendor 2's ID (2)
    expect(mockProps.deleteVendor).toHaveBeenCalledWith(2);

    // Optionally, you can also check how the state updates if needed (in a real stateful component)
  });

  test('next and previous page buttons work', () => {
    render(<IncomeInformation {...mockProps} />);

    const nextPageButton = screen.getByText('Next Page');
    const prevPageButton = screen.getByText('Previous Page');

    // Click the next page button
    fireEvent.click(nextPageButton);
    expect(mockProps.nextPage).toHaveBeenCalledTimes(1);

    // Click the previous page button
    fireEvent.click(prevPageButton);
    expect(mockProps.prevPage).toHaveBeenCalledTimes(1);
  });

  test('handle input changes correctly', () => {
    render(<IncomeInformation {...mockProps} />);

    const annualIncomeInput = screen.getByLabelText(/Annual Income/i);
    fireEvent.change(annualIncomeInput, { target: { value: '60000' } });

    // Ensure handleChange is called when the annual income changes
    expect(mockProps.handleChange).toHaveBeenCalledTimes(1);

    const vendorNameInput = screen.getAllByLabelText(/Vendor Name/i)[0]; // First vendor's name
    fireEvent.change(vendorNameInput, { target: { value: 'New Vendor Name' } });

    // Ensure handleVendorChange is called when a vendor's name is changed
    expect(mockProps.handleVendorChange).toHaveBeenCalledWith(0, 'name', 'New Vendor Name');
  });
});
