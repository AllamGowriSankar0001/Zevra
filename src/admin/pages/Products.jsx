import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { adminFetch } from '../hooks/useAdminApi';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';

const EMPTY_PRODUCT = {
  name:'', slug:'', category:'', description:'', price:'', stock:'0',
  images:[{ url:'', alt:'', isPrimary:true }],
  colors:[{ name:'', hex:'' }],
  sizes:[], isActive:true,
};

function isValidImageUrl(value) {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function Products() {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [pagination,  setPagination]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [actionError, setActionError] = useState('');
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState('');
  const [status,      setStatus]      = useState('');
  const [page,        setPage]        = useState(1);
  const [view,        setView]        = useState('list'); // list | form | detail
  const [editing,     setEditing]     = useState(null);  // product or null
  const [form,        setForm]        = useState(EMPTY_PRODUCT);
  const [saving,      setSaving]      = useState(false);
  const [formError,   setFormError]   = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [customSize,  setCustomSize]  = useState('');
  const [newColor,    setNewColor]    = useState({ name: '', hex: '#000000' });
  const [confirm,     setConfirm]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page, limit:12 });
      if (search)   params.set('search',   search);
      if (category) params.set('category', category);
      if (status)   params.set('status',   status);
      const r = await adminFetch(`/products?${params}`);
      setProducts(r.data.products);
      setPagination(r.data.pagination);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, search, category, status]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    adminFetch('/categories')
      .then(response => setCategories(response.data.categories.filter(category => category.isActive)))
      .catch(requestError => setActionError(requestError.message));
  }, []);

  function openNew() {
    setEditing(null);
    setImagePreviewError(false);
    setForm({...EMPTY_PRODUCT, category: categories[0]?.slug || '', images:[{url:'',alt:'',isPrimary:true}], colors:[{name:'',hex:''}], sizes:[]});
    setFormError('');
    setCustomSize('');
    setNewColor({ name: '', hex: '#000000' });
    setView('form');
  }

  async function openEdit(id) {
    setFormError('');
    setActionError('');
    try {
      const r = await adminFetch(`/products/${id}`);
      const p = r.data.product;
      setEditing(p);
      setImagePreviewError(false);
      setForm({
        name: p.name, slug: p.slug, category: p.category,
        description: p.description, price: p.price,
        stock: p.stock ?? 0,
        images: p.images?.length ? p.images : [{url:'',alt:'',isPrimary:true}],
        colors: p.colors?.length ? p.colors : [{name:'',hex:''}],
        sizes: p.sizes || [],
        isActive: p.isActive,
      });
      setCustomSize('');
      setNewColor({ name: '', hex: '#000000' });
      setView('form');
    } catch(e) { setActionError(e.message); }
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    if (!form.slug.trim()) { setFormError('Slug is required.'); return; }
    if (!form.category) { setFormError('Choose a category.'); return; }
    if (form.price === '' || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) { setFormError('Enter a valid non-negative price.'); return; }
    if (form.stock === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) { setFormError('Enter a whole number of zero or more for initial stock.'); return; }
    const invalidImage = form.images.find(img => img.url?.trim() && !isValidImageUrl(img.url.trim()));
    if (invalidImage) {
      setFormError('All image URLs must be full http(s) URLs or site paths starting with / (for example, /images/product.jpg).');
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          .filter(image => image.url?.trim())
          .map((image, idx) => ({ ...image, url: image.url.trim(), isPrimary: idx === 0 })),
        colors: form.colors.filter(color => color.name?.trim() && color.hex?.trim())
          .map(color => ({ ...color, name: color.name.trim(), hex: color.hex.trim() })),
      };
      if (editing) {
        await adminFetch(`/products/${editing._id}`, { method:'PATCH', body });
      } else {
        await adminFetch('/products', { method:'POST', body });
      }
      setView('list'); load();
    } catch(e) {
      const details = e.errors?.map(error => `${error.field}: ${error.message}`).join(' ');
      setFormError(details ? `${e.message} ${details}` : e.message);
    }
    finally { setSaving(false); }
  }

  async function toggleStatus(product) {
    setConfirm({
      title: product.isActive ? 'Deactivate product?' : 'Activate product?',
      message: `${product.isActive ? 'Customers will no longer see' : 'Customers will see'} "${product.name}".`,
      onConfirm: async () => {
        setConfirm(null);
        setActionError('');
        try {
          await adminFetch(`/products/${product._id}/status`, { method:'PATCH', body:{ isActive:!product.isActive }});
          await load();
        } catch(e) { setActionError(e.message); }
      },
      danger: product.isActive,
    });
  }

  // ── Sizes toggle
  const categorySizeOptions = categories.find(option => option.slug === form.category)?.sizeOptions || [];
  const legacySizeOptionsByCategory = {
    shirts: ['XS','S','M','L','XL','XXL'],
    tshirts: ['XS','S','M','L','XL','XXL'],
    jeans: ['28','30','32','34','36'],
    trousers: ['28','30','32','34','36'],
  };
  const legacySizeOptions = legacySizeOptionsByCategory[form.category] || [];
  const sizeOptions = [...new Set([...legacySizeOptions, ...categorySizeOptions, ...form.sizes])];
  function toggleSize(sz) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(sz) ? f.sizes.filter(s => s !== sz) : [...f.sizes, sz],
    }));
  }
  function addCustomSize() {
    const size = customSize.trim();
    if (!size) return;
    setForm(current => current.sizes.includes(size) ? current : { ...current, sizes: [...current.sizes, size] });
    setCustomSize('');
  }
  function addProductColor() {
    const name = newColor.name.trim();
    const hex = newColor.hex.trim();
    if (!name || !/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    setForm(current => {
      const colors = current.colors.filter(color => color.name.trim() && color.hex.trim());
      if (colors.some(color => color.name.toLowerCase() === name.toLowerCase())) return current;
      return { ...current, colors: [...colors, { name, hex }] };
    });
    setNewColor({ name: '', hex: '#000000' });
  }

  if (view === 'form') return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">
            <button onClick={() => setView('list')} style={{ color:'#999', background:'none', border:'none', cursor:'pointer', padding:0 }}>Products</button>
            {' / '}{editing ? 'Edit' : 'New Product'}
          </div>
          <h1>{editing ? `Edit: ${editing.name}` : 'New Product'}</h1>
        </div>
        <button className="a-btn a-btn--secondary" onClick={() => setView('list')}>← Back</button>
      </div>
      {formError && <div className="admin-error" role="alert">{formError}</div>}
      <div className="admin-card product-form-card">
        <form className="admin-form product-form" onSubmit={handleSave}>
          <div className="admin-card__body">
            <section className="product-form__section" aria-labelledby="product-details-heading">
              <div className="product-form__section-heading">
                <h2 id="product-details-heading">Product details</h2>
                <p>Set the product name, store category and price.</p>
              </div>
            <div className="admin-form-row">
              <div className="admin-field">
                <label>Product Name *</label>
                <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} required />
              </div>
              <div className="admin-field">
                <label>Slug *</label>
                <input value={form.slug} onChange={e => setForm(f=>({...f,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')}))} required />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-field">
                <label>Category *</label>
                <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} required>
                  <option value="" disabled>Select category</option>
                  {categories.map(c => {
                    const parent = c.parent ? categories.find(p => p.slug === c.parent) : null;
                    return (
                      <option key={c.slug} value={c.slug}>
                        {parent ? `${parent.name} › ${c.name}` : c.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="admin-field">
                <label>Price (INR) *</label>
                <input type="number" min="0" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} required />
              </div>
              <div className="admin-field">
                <label>Initial stock</label>
                <input type="number" min="0" step="1" value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))} />
                <span className="admin-field__hint">This is the product’s stock quantity. Products with inventory variants use each variant’s stock instead.</span>
              </div>
            </div>
            <div className="admin-field">
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
            </div>
            </section>
            <section className="product-form__section" aria-labelledby="product-media-heading">
              <div className="product-form__section-heading">
                <h2 id="product-media-heading">Product Images</h2>
                <p>Add multiple product images (front, back, model view, details). First image is Primary.</p>
              </div>
              <div className="product-images-manager">
                {form.images.map((img, index) => (
                  <div key={index} className={`product-image-row${index === 0 ? ' product-image-row--primary' : ''}`}>
                    {img.url ? (
                      <img
                        src={img.url}
                        alt={`Preview ${index + 1}`}
                        className="product-image-row__thumb"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="product-image-row__thumb-placeholder">
                        #{index + 1}
                      </div>
                    )}
                    <div className="product-image-row__main">
                      <div className="product-image-row__input-wrap">
                        <input
                          value={img.url || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm((f) => {
                              const imgs = [...f.images];
                              imgs[index] = { ...imgs[index], url: val };
                              return { ...f, images: imgs };
                            });
                          }}
                          placeholder={`Image #${index + 1} URL (e.g. https://... or /images/...)`}
                        />
                        {index === 0 && <span className="product-image-row__badge">Primary</span>}
                      </div>
                    </div>
                    <div className="product-image-row__actions">
                      {index > 0 && (
                        <button
                          type="button"
                          className="a-btn a-btn--secondary a-btn--sm"
                          onClick={() => {
                            setForm((f) => {
                              const item = f.images[index];
                              const rest = f.images.filter((_, i) => i !== index);
                              return {
                                ...f,
                                images: [{ ...item, isPrimary: true }, ...rest.map((r) => ({ ...r, isPrimary: false }))],
                              };
                            });
                          }}
                          title="Set this image as primary display"
                        >
                          Make Primary
                        </button>
                      )}
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          className="a-btn a-btn--danger a-btn--sm"
                          onClick={() => {
                            setForm((f) => ({
                              ...f,
                              images: f.images.filter((_, i) => i !== index),
                            }));
                          }}
                          title="Remove this image"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="a-btn a-btn--secondary a-btn--sm"
                  style={{ alignSelf: 'flex-start', marginTop: '6px' }}
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      images: [...f.images, { url: '', alt: '', isPrimary: false }],
                    }));
                  }}
                >
                  <Plus size={14} style={{ marginRight: '4px' }} />
                  Add Another Image
                </button>
              </div>
            </section>
            <div className="product-form__options">
            <section className="product-form__section product-form__option-card" aria-labelledby="product-colours-heading">
              <div className="product-form__section-heading">
                <h2 id="product-colours-heading">Colours</h2>
                <p>Add the colours customers can choose.</p>
              </div>
            <div className="admin-field">
              {form.colors.filter(color => color.name.trim() && color.hex.trim()).map((color, index) => (
                <div className="product-color-row" key={`${color.name}-${index}`}>
                  <span className="product-color-swatch" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                  <span className="product-color-name">{color.name}</span>
                  <code>{color.hex}</code>
                  <button
                    className="a-btn a-btn--danger a-btn--sm"
                    type="button"
                    onClick={() => setForm(current => ({
                      ...current,
                      colors: current.colors.filter((_, colorIndex) => colorIndex !== index),
                    }))}
                    aria-label={`Remove ${color.name} colour`}
                  >
                    <Trash2 size={13} aria-hidden="true" /> Remove
                  </button>
                </div>
              ))}
              <div className="product-color-add">
                <input
                  value={newColor.name}
                  onChange={event => setNewColor(current => ({ ...current, name: event.target.value }))}
                  placeholder="Colour name (e.g. Forest Green)"
                  aria-label="New colour name"
                />
                <input
                  type="color"
                  value={newColor.hex}
                  onChange={event => setNewColor(current => ({ ...current, hex: event.target.value }))}
                  aria-label="New colour swatch"
                />
                <code>{newColor.hex}</code>
                <button className="a-btn a-btn--secondary a-btn--sm" type="button" onClick={addProductColor} disabled={!newColor.name.trim()}>
                  <Plus size={13} aria-hidden="true" /> Add colour
                </button>
              </div>
              <span className="admin-field__hint">Pick a swatch and enter a colour name. Use Add colour to include it.</span>
            </div>
            </section>
            <section className="product-form__section product-form__option-card" aria-labelledby="product-sizes-heading">
              <div className="product-form__section-heading">
                <h2 id="product-sizes-heading">Sizes</h2>
                <p>Select suggested sizes or add your own.</p>
              </div>
            <div className="admin-field">
              <div className="product-size-options">
                {sizeOptions.map(sz => (
                  <label className={`product-size-option${form.sizes.includes(sz) ? ' is-selected' : ''}`} key={sz}>
                    <input type="checkbox" checked={form.sizes.includes(sz)} onChange={() => toggleSize(sz)} />
                    {sz}
                  </label>
                ))}
              </div>
              {!sizeOptions.length && <p className="admin-field__hint">No suggested sizes for this category yet. Add a custom size below.</p>}
              <div className="product-custom-size">
                <input
                  aria-label="Custom size"
                  value={customSize}
                  onChange={event => setCustomSize(event.target.value)}
                  placeholder="Add a custom size (e.g. 3XL, One Size)"
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addCustomSize();
                    }
                  }}
                />
                <button className="a-btn a-btn--secondary a-btn--sm" type="button" onClick={addCustomSize} disabled={!customSize.trim()}>Add size</button>
              </div>
            </div>
            </section>
            </div>
            <section className="product-form__section product-form__status" aria-labelledby="product-visibility-heading">
              <div className="product-form__section-heading">
                <h2 id="product-visibility-heading">Store visibility</h2>
                <p>Inactive products are saved but hidden from customers.</p>
              </div>
            <div className="admin-field">
              <label>Active</label>
              <select value={form.isActive ? 'true':'false'} onChange={e => setForm(f=>({...f,isActive:e.target.value==='true'}))}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            </section>
          </div>
          <div className="product-form__actions">
            <button type="submit" className="a-btn a-btn--primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
            </button>
            <button type="button" className="a-btn a-btn--secondary" onClick={() => setView('list')}>Cancel</button>
          </div>
        </form>
      </div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Admin</div>
          <h1>Products</h1>
        </div>
        <button className="a-btn a-btn--primary" onClick={openNew}>+ New Product</button>
      </div>

      {actionError && <div className="admin-error" role="alert">{actionError}</div>}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input placeholder="Search products…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="admin-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map(c => {
            const parent = c.parent ? categories.find(p => p.slug === c.parent) : null;
            return (
              <option key={c.slug} value={c.slug}>
                {parent ? `${parent.name} › ${c.name}` : c.name}
              </option>
            );
          })}
        </select>
        <select className="admin-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="admin-card">
        {loading
          ? <div className="admin-loading">Loading products…</div>
          : error
            ? <div className="admin-error">{error}</div>
            : products.length === 0
              ? <div className="admin-empty"><p>No products found.</p></div>
              : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr>
                      <th>Product</th><th>Category</th><th>Price</th>
                      <th>Status</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              {p.images?.[0]?.url && (
                                <img src={p.images[0].url} alt={p.name} style={{ width:36, height:48, objectFit:'cover', borderRadius:3, background:'#EEE' }} />
                              )}
                              <div>
                                <div style={{ fontWeight:500 }}>{p.name}</div>
                                <div style={{ fontSize:11, color:'#999' }}>{p.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td>{categories.find(categoryOption => categoryOption.slug === p.category)?.name || p.category}</td>
                          <td>₹{(p.price||0).toLocaleString('en-IN')}</td>
                          <td><span className={`badge badge--${p.isActive?'active':'inactive'}`}>{p.isActive?'Active':'Inactive'}</span></td>
                          <td>
                            <div style={{ display:'flex', gap:6 }}>
                              <button className="a-btn a-btn--secondary a-btn--sm" onClick={() => openEdit(p._id)}>Edit</button>
                              <button
                                className={`a-btn a-btn--sm ${p.isActive ? 'a-btn--danger' : 'a-btn--secondary'}`}
                                onClick={() => toggleStatus(p)}
                              >
                                {p.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
        }
        <Pagination pagination={pagination} onPage={setPage} />
      </div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
