'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
  status: boolean;
}

// Icon mappings to helper icons
const iconMap: { [key: string]: React.ReactNode } = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Soup: <Soup className="w-4 h-4" />,
  UtensilsCrossed: <UtensilsCrossed className="w-4 h-4" />,
  IceCream: <IceCream className="w-4 h-4" />,
  Wine: <Wine className="w-4 h-4" />,
  Pizza: <Pizza className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
};

const iconOptions = ['Sparkles', 'Soup', 'UtensilsCrossed', 'Pizza', 'IceCream', 'Wine', 'Coffee', 'Utensils'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Slide drawer State
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
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sticky page header with breadcrumb feel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4 text-left">
        <div>
          <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">Workspace / Categories</span>
          <h1 className="font-serif text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-[#D4A437]" /> Menu Categories
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Organize items inside sections (e.g. Starters, Main Course, Drinks).</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          {profiles.length > 0 && (
            <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 rounded-xl px-3 py-2">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Profile:</span>
              <select
                value={selectedProfileId}
                onChange={(e) => {
                  setSelectedProfileId(e.target.value);
                  loadCategories(e.target.value);
                }}
                className="bg-transparent border-none text-xs text-[#D4A437] font-semibold focus:outline-none cursor-pointer"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-950 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button
            onClick={openAddModal}
            size="sm"
            className="h-9 gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-black font-bold" /> Add Category
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-4.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3 text-left">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3 text-left">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Dense List */}
      <Card className="border-white/[0.04] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4A437] mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-500 space-y-3">
            <Layers className="w-10 h-10 mx-auto text-gray-700" />
            <p className="text-xs">No categories created under this profile yet.</p>
            <Button variant="secondary" size="sm" onClick={openAddModal}>Add First Category</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.01] text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <th className="px-6 py-3">Category info</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Reorder</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {categories.map((cat, index) => (
                  <tr key={cat.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5 text-[#D4A853]">
                          {iconMap[cat.icon] || <Utensils className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{cat.name}</span>
                          <span className="text-[9px] text-gray-500 mt-0.5">Order: #{cat.sortOrder}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer select-none ${
                          cat.status
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15'
                            : 'bg-zinc-800/40 border-white/5 text-gray-400 hover:text-white hover:bg-zinc-800/60'
                        }`}
                      >
                        {cat.status ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {cat.status ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded bg-white/[0.02] border border-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.04] cursor-pointer"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === categories.length - 1}
                          className="p-1 rounded bg-white/[0.02] border border-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.04] cursor-pointer"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditModal(cat)}
                        className="h-8 gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-[#D4A853]" /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                        className="h-8 gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile-friendly list of cards */}
            <div className="md:hidden divide-y divide-white/[0.04] p-1">
              {categories.map((cat, index) => (
                <div key={cat.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-[#D4A853] shrink-0">
                        {iconMap[cat.icon] || <Utensils className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-bold text-white block truncate max-w-[150px]">{cat.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">Order: #{cat.sortOrder}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${cat.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-gray-400'}`}>
                      {cat.status ? 'Active' : 'Disabled'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-white/[0.03] pt-2.5">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === categories.length - 1}
                        className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    {/* Action triggers */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleStatus(cat)}
                        className="h-8 px-2 text-[10px]"
                      >
                        {cat.status ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                        {cat.status ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditModal(cat)}
                        className="h-8 px-2 text-[10px]"
                      >
                        <Edit2 className="w-3 h-3 text-[#D4A853] mr-1" /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                        className="h-8 px-2 text-[10px]"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* SLIDE-OVER DRAWER FOR CREATE / EDIT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end no-print">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Slide Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative w-full max-w-md bg-[#0D0D0F] border-l border-white/[0.06] shadow-2xl h-full flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    {editingCategory ? 'Edit Category Parameters' : 'Register New Menu Category'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} id="category-form" className="space-y-6 text-left">
                  <Input
                    label="Category Identifier Name"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Starters or Mocktails"
                  />

                  {/* Icon selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 select-none">
                      Category Icon style
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {iconOptions.map((opt) => {
                        const isIconSelected = catIcon === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setCatIcon(opt)}
                            className={`p-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                              isIconSelected
                                ? 'border-[#D4A853] bg-[#D4A853]/10 text-[#D4A853] shadow-md shadow-[#D4A853]/5'
                                : 'border-white/[0.06] bg-zinc-900/40 text-gray-500 hover:border-gray-700 hover:text-white'
                            }`}
                          >
                            {iconMap[opt]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status checkbox */}
                  <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.04] p-4.5 rounded-xl select-none">
                    <input
                      type="checkbox"
                      id="status"
                      checked={catStatus}
                      onChange={(e) => setCatStatus(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-white/[0.08] text-[#D4A853] bg-zinc-950 focus:ring-[#D4A853]/25 accent-[#D4A853] cursor-pointer"
                    />
                    <div className="text-left">
                      <label htmlFor="status" className="text-xs font-bold text-white block cursor-pointer">
                        Category Active Status
                      </label>
                      <span className="text-[10px] text-gray-500 block mt-0.5">Toggle guest accessibility visibility online.</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Form submit footer action */}
              <div className="border-t border-white/[0.04] pt-4 mt-6 flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  form="category-form"
                  className="flex-1"
                  isLoading={saving}
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
