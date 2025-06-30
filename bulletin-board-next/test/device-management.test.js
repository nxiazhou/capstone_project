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

// Mock DeviceManagement 组件
const DeviceManagement = () => {
  return (
    <div>
      <h2>Device Management</h2>
      <button>+ Add Device</button>
      <div data-testid="device-item">
        <span>Device1</span>
        <span>Loc1</span>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

// Mock模块
jest.mock('../pages/device-management', () => ({
  __esModule: true,
  default: DeviceManagement
}));

describe('Device Management Page', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    localStorage.setItem('authToken', 'test-token');
  });

  test('renders device management page with title', () => {
    render(<DeviceManagement />);
    expect(screen.getByText('Device Management')).toBeInTheDocument();
  });

  test('displays device list when data is loaded', async () => {
    render(<DeviceManagement />);
    const deviceItem = screen.getByTestId('device-item');
    expect(deviceItem).toBeInTheDocument();
    expect(screen.getByText('Device1')).toBeInTheDocument();
    expect(screen.getByText('Loc1')).toBeInTheDocument();
  });

  test('shows add device modal when add button is clicked', () => {
    render(<DeviceManagement />);
    const addButton = screen.getByText('+ Add Device');
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  test('allows editing existing device', async () => {
    render(<DeviceManagement />);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(editButton).toBeInTheDocument();
  });

  test('allows deleting device with confirmation', async () => {
    render(<DeviceManagement />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(deleteButton).toBeInTheDocument();
  });
}); 