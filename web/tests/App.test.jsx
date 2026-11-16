import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.jsx';

const products = [
  { id: 1, name: 'Claw hammer', category: 'Tools', price: 549, stock: 3 },
  { id: 2, name: 'Cordless drill', category: 'Power tools', price: 4299, stock: 2, reorderLevel: 3 },
  { id: 3, name: 'Tape measure', category: 'Tools', price: 199, stock: 8, reorderLevel: 4 },
];

afterEach(() => vi.restoreAllMocks());

describe('App', () => {
  it('shows products from the API with low-stock count and badges', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true, status: 200, json: async () => products });
    render(<App />);

    expect(await screen.findByText('Claw hammer')).toBeInTheDocument();
    expect(screen.getByText('Cordless drill')).toBeInTheDocument();
    expect(screen.getByText('Tape measure')).toBeInTheDocument();
    expect(screen.getByText('3 products on the shelf')).toBeInTheDocument();
    expect(screen.getByText('2 low on stock')).toBeInTheDocument();

    const lowStockBadges = screen.getAllByText('Low stock');
    expect(lowStockBadges).toHaveLength(2);
    expect(screen.getByText('Claw hammer').closest('tr')).toHaveTextContent('Low stock');
    expect(screen.getByText('Cordless drill').closest('tr')).toHaveTextContent('Low stock');
    expect(screen.getByText('Tape measure').closest('tr')).not.toHaveTextContent('Low stock');
  });

  it('shows an error when the API is down', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load products');
  });
});
