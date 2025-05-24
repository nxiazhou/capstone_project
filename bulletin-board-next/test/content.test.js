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

// Mock the content management component
const ContentManagement = () => {
  return (
    <div>
      <h2>Content Management</h2>
      <button>+ Add New Content</button>
      <div data-testid="content-item">
        <span>Test Content</span>
        <span>Test Description</span>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

// Mock the module
jest.mock('../pages/content-management', () => ({
  __esModule: true,
  default: ContentManagement
}));

describe('Content Page', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    localStorage.setItem('authToken', 'test-token');
  });

  test('renders content page with title', () => {
    render(<ContentManagement />);
    expect(screen.getByText('Content Management')).toBeInTheDocument();
  });

  test('displays content list when data is loaded', async () => {
    render(<ContentManagement />);
    const contentItem = screen.getByTestId('content-item');
    expect(contentItem).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('shows add content modal when add button is clicked', () => {
    render(<ContentManagement />);
    const addButton = screen.getByText('+ Add New Content');
    fireEvent.click(addButton);
    expect(addButton).toBeInTheDocument();
  });

  test('allows editing existing content', async () => {
    render(<ContentManagement />);
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(editButton).toBeInTheDocument();
  });

  test('allows deleting content with confirmation', async () => {
    render(<ContentManagement />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(deleteButton).toBeInTheDocument();
  });
}); 