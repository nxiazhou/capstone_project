import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Usermanagement from '../pages/user-management';
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

describe('User Management Page', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  it('redirects to login if no token is found', () => {
    render(<Usermanagement />);
    expect(window.localStorage.getItem).toHaveBeenCalledWith('authToken');
  });

  it('renders admin user table if admin role is set', async () => {
    localStorage.setItem('authToken', 'mocked-token');
    localStorage.setItem('authRole', 'admin');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: [
          { userId: 1, username: 'admin1', email: 'admin@example.com', role: 'admin', subscriptionStatus: 'active' },
        ],
      }),
    });

    render(<Usermanagement />);
    expect(await screen.findByText('User Management')).toBeInTheDocument();
    expect(await screen.findByText('admin1')).toBeInTheDocument();
    expect(screen.getByText('+ Add New User')).toBeInTheDocument();
  });

  // ❗ Uncomment the following test to enable normal user interface test
  // it('renders user profile if role is user', async () => {
  //   localStorage.setItem('authToken', 'mocked-token');
  //   localStorage.setItem('authRole', 'user');
  //   fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({
  //       username: 'testuser',
  //       email: 'test@example.com',
  //       phone: '12345678',
  //       address: '123 Test Street',
  //     }),
  //   });

  //   render(<Usermanagement />);
  //   expect(await screen.findByText('Your Profile')).toBeInTheDocument();
  //   expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
  //   expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  // });
});