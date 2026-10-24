import { useCallback, useEffect, useState } from 'react';
import { Layers3, Package, Plus, Pencil, Trash2, GitFork, FolderTree } from 'lucide-react';
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
      const payload = {
        name: form.name,
        description: form.description,
        parent: form.parent ? form.parent.trim().toLowerCase() : null,
        sizeOptions: parseSizeOptions(form.sizeOptionsInput || ''),
        imageUrl: form.imageUrl,
      };

      if (form.id) {
        await adminFetch(`/categories/${form.id}`, {
          method: 'PATCH',
          body: payload,
        });
      } else {
        await adminFetch('/categories', {
          method: 'POST',
          body: { ...payload, slug: form.slug },
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
    const subcats = categories.filter(c => c.parent === category.slug);
    if (subcats.length > 0) {
      setError(`Cannot delete "${category.name}" because it has ${subcats.length} subcategories (${subcats.map(s => s.name).join(', ')}). Reassign or delete those subcategories first.`);
      return;
    }

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

  // Potential parent categories (categories that don't have parents themselves, or not currently editing)
  const potentialParents = categories.filter(c => (!form?.id || (c.id !== form.id && c.slug !== form.slug)) && !c.parent);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Admin</div>
          <h1>Categories & Subcategories</h1>
        </div>
        <button className="a-btn a-btn--primary" onClick={() => {
          setImagePreviewError(false);
          setForm({ id: '', name: '', slug: '', description: '', parent: '', sizeOptionsInput: '', imageUrl: '' });
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

            <div className="admin-form-row">
              <div className="admin-field">
                <label htmlFor="category-parent">Parent Category (Optional)</label>
                <select
                  id="category-parent"
                  value={form.parent || ''}
                  onChange={event => setForm(current => ({ ...current, parent: event.target.value }))}
                >
                  <option value="">None (Top-Level Category)</option>
                  {potentialParents.map(parentOption => (
                    <option key={parentOption.slug} value={parentOption.slug}>
                      {parentOption.name}
                    </option>
                  ))}
                </select>
                <span className="admin-field__hint">
                  To set this as a subcategory, select a parent category (e.g. choose "Topwear" to make this a subcategory under Topwear).
                </span>
              </div>
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
              <span className="admin-field__hint">Direct high-resolution image URL or site path starting with /. Displayed tastefully on the category page.</span>
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
          {categories.map(category => {
            const parentCat = categories.find(c => c.slug === category.parent);
            const subcats = categories.filter(c => c.parent === category.slug);

            return (
              <article className={`admin-card admin-category-card${category.parent ? ' admin-category-card--sub' : ''}`} key={category.id}>
                <div className="admin-category-card__top">
                  <span className="admin-category-card__icon">
                    {category.parent ? <GitFork size={18} aria-hidden="true" /> : <FolderTree size={18} aria-hidden="true" />}
                  </span>
                  <code>{category.slug}</code>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 6px' }}>
                  <h2 style={{ margin: 0 }}>{category.name}</h2>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  {category.parent ? (
                    <span className="admin-badge admin-badge--neutral" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      Subcategory of <strong>{parentCat?.name || category.parent}</strong>
                    </span>
                  ) : (
                    <span className="admin-badge admin-badge--active" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      Main Category {subcats.length > 0 && `(${subcats.length} subcategories)`}
                    </span>
                  )}
                </div>

                <p>{category.description || 'Product collection'}</p>

                {subcats.length > 0 && (
                  <div style={{ margin: '8px 0', fontSize: '12px', color: 'var(--a-text-2)' }}>
                    <strong>Subcategories: </strong>
                    {subcats.map(s => s.name).join(', ')}
                  </div>
                )}

                <div className="admin-category-card__count">
                  <Package size={16} aria-hidden="true" />
                  <strong>{category.count}</strong>
                  <span>{category.count === 1 ? 'product' : 'products'}</span>
                </div>
                {(category.sizeOptions || []).length > 0 && (
                  <p className="admin-category-sizes">Sizes: {category.sizeOptions.join(', ')}</p>
                )}
                {category.imageUrl && <p className="admin-category-sizes">Banner image configured</p>}

                <div className="admin-category-card__actions">
                  <button className="a-btn a-btn--secondary a-btn--sm" onClick={() => {
                    setImagePreviewError(false);
                    setForm({
                      id: category.id,
                      name: category.name,
                      slug: category.slug,
                      description: category.description || '',
                      parent: category.parent || '',
                      sizeOptionsInput: (category.sizeOptions || []).join(', '),
                      imageUrl: category.imageUrl || '',
                    });
                  }}>
                    <Pencil size={13} aria-hidden="true" /> Edit
                  </button>
                  <button className="a-btn a-btn--danger a-btn--sm" onClick={() => deleteCategory(category)}>
                    <Trash2 size={13} aria-hidden="true" /> Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="admin-category-note">
        <strong>About Categories & Subcategories</strong>
        <span>
          You can create main parent categories (such as <strong>Topwear</strong> and <strong>Bottomwear</strong>) and set individual items (such as <strong>Shirts</strong>, <strong>T-Shirts</strong>, <strong>Jeans</strong>, and <strong>Trousers</strong>) as subcategories under them.
        </span>
      </div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
