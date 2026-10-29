import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';

const products = [
  { id: 1, name: 'Claw hammer', category: 'Tools', price: 549, stock: 18 },
  { id: 2, name: 'Cordless drill', category: 'Power tools', price: 4299, stock: 3 },
];

afterEach(() => vi.restoreAllMocks());

describe('App', () => {
  it('shows products from the API', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200, json: async () => products });
    render(<App />);
    expect(await screen.findByText('Claw hammer')).toBeInTheDocument();
    expect(screen.getByText('Cordless drill')).toBeInTheDocument();
    expect(screen.getByText('2 products on the shelf')).toBeInTheDocument();
  });

  it('shows an error when the API is down', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load products');
  });
});
