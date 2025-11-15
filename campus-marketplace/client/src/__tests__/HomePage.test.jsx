import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from '../pages/HomePage';

describe('HomePage', () => {
  it('renders the welcome message', () => {
    render(<HomePage />);
    expect(screen.getByText('Welcome to Campus Marketplace!')).toBeInTheDocument();
  });
});
