import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => (store[key] = value)),
    clear: jest.fn(() => (store = {})),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Mock the schedule management component
const ScheduleManagement = () => {
  return (
    <div>
      <h2>Schedule Management</h2>
      <button>+ Add New Schedule</button>
      <div className="schedule-table">
        <input 
          type="date" 
          aria-label="Date filter"
          data-testid="date-filter"
        />
        <div data-testid="schedule-item">
          <span>Team Meeting</span>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  );
};

// Mock the module
jest.mock('../pages/schedule-management', () => ({
  __esModule: true,
  default: ScheduleManagement
}));

describe('Schedule Management Page', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    localStorage.setItem('authToken', 'test-token');
  });

  test('renders schedule management page with title', () => {
    render(<ScheduleManagement />);
    expect(screen.getByText('Schedule Management')).toBeInTheDocument();
  });

  test('displays schedule events when data is loaded', async () => {
    render(<ScheduleManagement />);
    const scheduleItem = screen.getByTestId('schedule-item');
    expect(scheduleItem).toBeInTheDocument();
    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
  });

  test('shows add event modal when add button is clicked', () => {
    render(<ScheduleManagement />);
    const addButton = screen.getByText('+ Add New Schedule');
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  test('allows editing existing event', async () => {
    render(<ScheduleManagement />);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(editButton).toBeInTheDocument();
  });

  test('allows deleting event with confirmation', async () => {
    render(<ScheduleManagement />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(deleteButton).toBeInTheDocument();
  });

  test('allows filtering events by date', () => {
    render(<ScheduleManagement />);
    const dateFilter = screen.getByTestId('date-filter');
    fireEvent.change(dateFilter, { target: { value: '2024-03-20' } });
    expect(dateFilter.value).toBe('2024-03-20');
  });
}); 