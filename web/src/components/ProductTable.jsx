import { formatPrice } from '../format.js';

export default function ProductTable({ products, onDelete }) {
  if (products.length === 0) {
    return <p className="muted">No products yet. Add your first one above.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col" className="num">Price</th>
            <th scope="col" className="num">In stock</th>
            <th scope="col"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const isLowStock = p.stock < (p.reorderLevel ?? 5);

            return (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td className="num">{formatPrice(p.price)}</td>
                <td className="num">
                  <span className="stock-cell">
                    <span>{p.stock}</span>
                    {isLowStock && <span className="badge">Low stock</span>}
                  </span>
                </td>
                <td className="actions">
                  <button type="button" className="link-button" onClick={() => onDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
