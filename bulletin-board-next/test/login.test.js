import React from 'react'; // ✅ 必须引入 React，否则 JSX 无法识别
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/login';  // 根据你的路径调整
import '@testing-library/jest-dom';

// ✅ mock useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Login Page', () => {
  test('renders login form with inputs and button', () => {
    render(<Login />);

    expect(screen.getByPlaceholderText('Username *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password *')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('shows error if username is empty', () => {
    render(<Login />);

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(screen.getByText('Please enter username')).toBeInTheDocument();
  });

  test('shows error if password is empty', () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username *'), {
      target: { value: 'admin' },
    });

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(screen.getByText('Please enter password')).toBeInTheDocument();
  });

  test('sign up button toggles signup modal', () => {
    render(<Login />);

    const signUpButton = screen.getByText('Sign up');
    fireEvent.click(signUpButton);

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('forgot password button toggles forgot modal', () => {
    render(<Login />);

    const forgotButton = screen.getByText('Forgot password?');
    fireEvent.click(forgotButton);

    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });
});