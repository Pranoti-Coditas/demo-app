import { useEffect, useState } from 'react';
import { api } from './api.js';
import ProductTable from './components/ProductTable.jsx';
import ProductForm from './components/ProductForm.jsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setProducts(await api.listProducts());
      setError('');
    } catch (err) {
      setError(`Could not load products: ${err.message}. Check that the API is running on port 3001.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(product) {
    const created = await api.createProduct(product);
    setProducts((current) => [...current, created]);
  }

  async function handleDelete(id) {
    await api.deleteProduct(id);
    setProducts((current) => current.filter((p) => p.id !== id));
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Store inventory</h1>
        <p className="muted">{products.length} products on the shelf</p>
      </header>

      {error && <p role="alert" className="error">{error}</p>}

      <section className="panel">
        <h2>Add a product</h2>
        <ProductForm onSubmit={handleCreate} />
      </section>

      <section className="panel">
        <h2>Products</h2>
        {loading ? <p className="muted">Loading products…</p> : <ProductTable products={products} onDelete={handleDelete} />}
      </section>
    </main>
  );
}
