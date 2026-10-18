import { useCallback, useEffect, useState } from 'react';
import { Layers3, Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { adminFetch } from '../hooks/useAdminApi';
import ConfirmDialog from '../components/ConfirmDialog';

function isValidImageUrl(value) {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [saving,     setSaving]     = useState(false);
  const [form,       setForm]       = useState(null);
  const [confirm,    setConfirm]    = useState(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  function parseSizeOptions(value) {
    return [...new Set(value.split(',').map(size => size.trim()).filter(Boolean))];
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminFetch('/categories');
      setCategories(response.data.categories);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveCategory(event) {
    event.preventDefault();
    if (form.imageUrl?.trim() && !isValidImageUrl(form.imageUrl.trim())) {
      setError('Enter a full http(s) image URL or a site path starting with / (for example, /images/category.jpg).');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (form.id) {
        await adminFetch(`/categories/${form.id}`, {
          method: 'PATCH',
          body: { name: form.name, description: form.description, sizeOptions: parseSizeOptions(form.sizeOptionsInput || ''), imageUrl: form.imageUrl },
        });
      } else {
        await adminFetch('/categories', {
          method: 'POST',
          body: { name: form.name, slug: form.slug, description: form.description, sizeOptions: parseSizeOptions(form.sizeOptionsInput || ''), imageUrl: form.imageUrl },
        });
      }
      setForm(null);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function deleteCategory(category) {
    setConfirm({
      title: `Delete ${category.name}?`,
      message: category.count > 0
        ? 'This category still has products. Move or remove those products before deleting it.'
        : 'This category will be removed from the store and product forms.',
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        setError('');
        try {
          await adminFetch(`/categories/${category.id}`, { method: 'DELETE' });
          await load();
        } catch (requestError) {
          setError(requestError.message);
        }
      },
    });
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Admin</div>
          <h1>Categories</h1>
        </div>
        <button className="a-btn a-btn--primary" onClick={() => {
          setImagePreviewError(false);
          setForm({ id: '', name: '', slug: '', description: '', sizeOptionsInput: '', imageUrl: '' });
        }}>
          <Plus size={16} aria-hidden="true" /> Add Category
        </button>
      </div>

      {error && <div className="admin-error" role="alert">{error}</div>}

      {form && (
        <div className="admin-card admin-category-form-card">
          <div className="admin-card__header">
            <span className="admin-card__title">{form.id ? 'Edit Category' : 'Add Category'}</span>
          </div>
          <form className="admin-form admin-category-form" onSubmit={saveCategory}>
            <div className="admin-form-row">
              <div className="admin-field">
                <label htmlFor="category-name">Category name *</label>
                <input id="category-name" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} required />
              </div>
              {!form.id && <div className="admin-field">
                <label htmlFor="category-slug">URL slug *</label>
                <input id="category-slug" value={form.slug} onChange={event => setForm(current => ({ ...current, slug: event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))} required />
              </div>}
            </div>
            <div className="admin-field">
              <label htmlFor="category-description">Description</label>
              <textarea id="category-description" rows={2} value={form.description} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="admin-field">
              <label htmlFor="category-image-url">Category page banner image URL</label>
              <input
                id="category-image-url"
                type="text"
                inputMode="url"
                value={form.imageUrl || ''}
                onChange={event => {
                  setImagePreviewError(false);
                  setForm(current => ({ ...current, imageUrl: event.target.value }));
                }}
                placeholder="https://example.com/category-banner.jpg or /images/category.jpg"
              />
              <span className="admin-field__hint">Use a direct image URL (http/https) or a site path beginning with /. Shown as the hero image on this category’s website page.</span>
              {form.imageUrl && !imagePreviewError && (
                <div className="product-image-preview">
                  <img src={form.imageUrl} alt="Category banner preview" onError={() => setImagePreviewError(true)} />
                  <span>Category banner preview</span>
                </div>
              )}
              {form.imageUrl && imagePreviewError && <p className="admin-error" role="alert">This image URL could not be loaded. Use a direct image URL and check that the host allows it to be displayed here.</p>}
            </div>
            <div className="admin-field">
              <label htmlFor="category-sizes">Available size options</label>
              <input
                id="category-sizes"
                value={form.sizeOptionsInput ?? (form.sizeOptions || []).join(', ')}
                onChange={event => setForm(current => ({ ...current, sizeOptionsInput: event.target.value }))}
                placeholder="XS, S, M, L, XL"
              />
              <span className="admin-field__hint">Separate options with commas. Product forms will use these as suggestions; you can still add product-specific sizes.</span>
            </div>
            <div className="admin-category-form__actions">
              <button className="a-btn a-btn--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Category'}</button>
              <button className="a-btn a-btn--secondary" type="button" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-card"><div className="admin-loading">Loading categories…</div></div>
      ) : (
        <div className="admin-category-grid">
          {categories.map(category => (
            <article className="admin-card admin-category-card" key={category.id}>
              <div className="admin-category-card__top">
                <span className="admin-category-card__icon"><Layers3 size={19} aria-hidden="true" /></span>
                <code>{category.slug}</code>
              </div>
              <h2>{category.name}</h2>
              <p>{category.description || 'Product collection'}</p>
              <div className="admin-category-card__count">
                <Package size={16} aria-hidden="true" />
                <strong>{category.count}</strong>
                <span>{category.count === 1 ? 'product' : 'products'}</span>
              </div>
              {(category.sizeOptions || []).length > 0 && (
                <p className="admin-category-sizes">Sizes: {category.sizeOptions.join(', ')}</p>
              )}
              {category.imageUrl && <p className="admin-category-sizes">Category banner image set</p>}
              <div className="admin-category-card__actions">
                <button className="a-btn a-btn--secondary a-btn--sm" onClick={() => {
                  setImagePreviewError(false);
                  setForm({ id: category.id, name: category.name, slug: category.slug, description: category.description || '', sizeOptionsInput: (category.sizeOptions || []).join(', '), imageUrl: category.imageUrl || '' });
                }}>
                  <Pencil size={13} aria-hidden="true" /> Edit
                </button>
                <button className="a-btn a-btn--danger a-btn--sm" onClick={() => deleteCategory(category)}>
                  <Trash2 size={13} aria-hidden="true" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="admin-category-note">
        <strong>About categories</strong>
        <span>Categories with assigned products cannot be deleted until those products are moved or removed.</span>
      </div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
