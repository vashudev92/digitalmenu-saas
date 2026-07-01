'use client';

import { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Soup,
  UtensilsCrossed,
  IceCream,
  Wine,
  Pizza,
  Coffee,
  Utensils
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
  status: boolean;
}

// Icon mappings to helper icons
const iconMap: { [key: string]: React.ReactNode } = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Soup: <Soup className="w-5 h-5" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  IceCream: <IceCream className="w-5 h-5" />,
  Wine: <Wine className="w-5 h-5" />,
  Pizza: <Pizza className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
};

const iconOptions = ['Sparkles', 'Soup', 'UtensilsCrossed', 'Pizza', 'IceCream', 'Wine', 'Coffee', 'Utensils'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('Utensils');
  const [catStatus, setCatStatus] = useState(true);

  // Menu Profiles
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Load Profiles
  async function loadProfiles() {
    try {
      const res = await fetch('/api/menu-profiles');
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
        if (data.profiles && data.profiles.length > 0) {
          setSelectedProfileId(data.profiles[0].id);
          loadCategories(data.profiles[0].id);
        } else {
          loadCategories('');
        }
      } else {
        loadCategories('');
      }
    } catch {
      loadCategories('');
    } finally {
      setLoadingProfiles(false);
    }
  }

  // Load Categories
  async function loadCategories(profileId?: string) {
    try {
      setLoading(true);
      const targetId = profileId !== undefined ? profileId : selectedProfileId;
      const url = targetId ? `/api/categories?menuProfileId=${targetId}` : '/api/categories';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError('Could not load categories.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatIcon('Utensils');
    setCatStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatIcon(cat.icon);
    setCatStatus(cat.status);
    setIsModalOpen(true);
  };

  // Submit create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const isEdit = !!editingCategory;
      const url = '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? { id: editingCategory.id, name: catName, icon: catIcon, status: catStatus }
        : { name: catName, icon: catIcon, status: catStatus, sortOrder: categories.length + 1, menuProfileId: selectedProfileId || undefined };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save category');
        setSaving(false);
        return;
      }

      setMessage(isEdit ? 'Category updated!' : 'Category created!');
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? Deleting this category will delete all items inside it.')) return;

    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete category');
        return;
      }

      setMessage('Category deleted successfully.');
      loadCategories();
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  // Toggle category status
  const handleToggleStatus = async (cat: Category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          status: !cat.status,
          sortOrder: cat.sortOrder,
        }),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, status: !c.status } : c))
        );
      }
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  // Reordering categories
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedList = [...categories];
    
    // Swap
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[targetIndex];
    reorderedList[targetIndex] = temp;

    // Recalculate sortOrders
    const updatedList = reorderedList.map((cat, idx) => ({
      ...cat,
      sortOrder: idx + 1,
    }));

    setCategories(updatedList);

    // Save orders in database
    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reorder: true,
          categories: updatedList.map((c) => ({ id: c.id, sortOrder: c.sortOrder })),
        }),
      });
    } catch (err) {
      setError('Failed to save reordered list.');
    }
  };

  if (loadingProfiles) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
            <Layers className="w-8 h-8 text-[#D4A437]" /> Menu Categories
          </h1>
          <p className="text-gray-400 text-sm mt-1">Organize your menu card (e.g. Starters, Main Course, Desserts).</p>
        </div>
        <div className="flex items-center gap-3">
          {profiles.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-950 border border-gray-900 rounded-xl px-3 py-2">
              <span className="text-xs text-gray-500 font-semibold uppercase">Profile:</span>
              <select
                value={selectedProfileId}
                onChange={(e) => {
                  setSelectedProfileId(e.target.value);
                  loadCategories(e.target.value);
                }}
                className="bg-transparent border-none text-xs text-[#D4A437] font-semibold focus:outline-none cursor-pointer"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-black text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-sm shadow-[0_0_15px_rgba(212,164,55,0.2)] hover:shadow-[0_0_20px_rgba(212,164,55,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Category List */}
      <div className="glass rounded-3xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Layers className="w-12 h-12 mx-auto text-gray-700 mb-4" />
            <p className="text-sm">No categories created yet. Click 'Add Category' above to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-900/60">
            {categories.map((cat, index) => (
              <div key={cat.id} className="p-5 flex items-center justify-between bg-gray-950/20 hover:bg-[#D4A437]/2 transition-all">
                {/* Left side: Icon & Title */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gray-950 border border-gray-900 text-[#D4A437]">
                    {iconMap[cat.icon] || <Utensils className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{cat.name}</h4>
                    <span className="text-[10px] text-gray-500 font-semibold">
                      Position: {cat.sortOrder}
                    </span>
                  </div>
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center gap-2">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      cat.status
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15'
                        : 'border-gray-800 bg-gray-950 text-gray-500 hover:text-gray-400'
                    }`}
                    title={cat.status ? 'Deactivate Category' : 'Activate Category'}
                  >
                    {cat.status ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Reorder actions */}
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-2 rounded-lg bg-gray-950 border border-gray-900 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === categories.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-2 rounded-lg bg-gray-950 border border-gray-900 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Edit/Delete actions */}
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-lg bg-gray-950 border border-gray-900 text-gray-400 hover:text-[#D4A437] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg bg-gray-950 border border-gray-900 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-gold rounded-3xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold mb-6">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Starters"
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Icon grid picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Select Icon
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {iconOptions.map((opt) => {
                    const isIconSelected = catIcon === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setCatIcon(opt)}
                        className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          isIconSelected
                            ? 'border-[#D4A437] bg-[#D4A437]/10 text-[#D4A437]'
                            : 'border-gray-800 bg-[#0d0d0d] text-gray-400 hover:border-gray-700 hover:text-white'
                        }`}
                      >
                        {iconMap[opt]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="status"
                  checked={catStatus}
                  onChange={(e) => setCatStatus(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-800 text-[#D4A437] bg-black focus:ring-[#D4A437] focus:ring-opacity-25"
                />
                <label htmlFor="status" className="text-sm text-gray-300 select-none cursor-pointer">
                  Activate this category (Make it visible to customers)
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-base transition-all duration-300 shadow-[0_0_15px_rgba(212,164,55,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
