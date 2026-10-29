import { useState } from 'react';

const EMPTY = { name: '', category: '', price: '', stock: '' };

export default function ProductForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setForm(EMPTY);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input value={form.name} onChange={update('name')} required />
      </label>
      <label>
        Category
        <input value={form.category} onChange={update('category')} />
      </label>
      <label>
        Price (₹)
        <input type="number" value={form.price} onChange={update('price')} required />
      </label>
      <label>
        Stock
        <input type="number" value={form.stock} onChange={update('stock')} required />
      </label>
      <button type="submit" disabled={saving}>{saving ? 'Adding…' : 'Add product'}</button>
      {error && <p role="alert" className="error form-error">{error}</p>}
    </form>
  );
}
