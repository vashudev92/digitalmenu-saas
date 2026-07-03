'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Star,
  Check,
  Search,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import ImageCropper from '@/components/image-cropper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, TextArea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isVeg: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
}

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Slide-over Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Menu Profiles
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Searchable Profile Dropdown States
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState('');

  // Load Profiles
  async function loadProfiles() {
    try {
      const res = await fetch('/api/menu-profiles');
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
        if (data.profiles && data.profiles.length > 0) {
          setSelectedProfileId(data.profiles[0].id);
          loadData(data.profiles[0].id);
        } else {
          loadData('');
        }
      } else {
        loadData('');
      }
    } catch {
      loadData('');
    } finally {
      setLoadingProfiles(false);
    }
  }

  // Load Items and Categories
  async function loadData(profileId?: string) {
    try {
      setLoading(true);
      const targetId = profileId !== undefined ? profileId : selectedProfileId;
      const itemsUrl = targetId ? `/api/items?menuProfileId=${targetId}` : '/api/items';
      const catsUrl = targetId ? `/api/categories?menuProfileId=${targetId}` : '/api/categories';
      
      const itemsRes = await fetch(itemsUrl);
      const catsRes = await fetch(catsUrl);
      
      if (!itemsRes.ok || !catsRes.ok) throw new Error('Failed to load menu listings');
      
      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();
      
      setItems(itemsData);
      setCategories(catsData.filter((c: any) => c.status)); // Only show active categories in forms
    } catch (err) {
      setError('Could not load menu items or categories.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  const openAddModal = () => {
    if (categories.length === 0) {
      alert('Please create and activate at least one Category before adding dishes!');
      return;
    }
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setIsVeg(true);
    setIsFeatured(false);
    setIsAvailable(true);
    setCategoryId(categories[0].id);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setPrice(item.price.toString());
    setImage(item.image || '');
    setIsVeg(item.isVeg);
    setIsFeatured(item.isFeatured);
    setIsAvailable(item.isAvailable);
    setCategoryId(item.categoryId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const isEdit = !!editingItem;
      const url = '/api/items';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? { id: editingItem.id, name, description, price: parseFloat(price), image, isVeg, isFeatured, isAvailable, categoryId }
        : { name, description, price: parseFloat(price), image, isVeg, isFeatured, isAvailable, categoryId, menuProfileId: selectedProfileId || undefined };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save menu item');
        setSaving(false);
        return;
      }

      setMessage(isEdit ? 'Menu item updated!' : 'Menu item created!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete item');
        return;
      }

      setMessage('Menu item deleted.');
      loadData();
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  // Toggle item availability status
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          isVeg: item.isVeg,
          isFeatured: item.isFeatured,
          isAvailable: !item.isAvailable,
          categoryId: item.categoryId
        }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i))
        );
      }
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  // Group items by category for visual display
  const itemsByCategory = categories.reduce((acc, cat) => {
    const catItems = items.filter((item) => item.categoryId === cat.id);
    acc[cat.id] = { name: cat.name, items: catItems };
    return acc;
  }, {} as { [key: string]: { name: string; items: MenuItem[] } });

  if (loadingProfiles) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4 text-left">
        <div>
          <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase block">Workspace / Catalogues</span>
          <h1 className="font-serif text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <UtensilsCrossed className="w-5.5 h-5.5 text-[#D4A437]" /> Dishes Directory
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Configure your culinary offerings, pricing presets, and visual photography cards.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          {profiles.length > 0 && (
            <div className="relative shrink-0 text-left" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setProfileSearch('');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-white/5 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#D4A437]/30 transition-all cursor-pointer select-none"
              >
                <span className="text-gray-500 uppercase font-bold text-[9px]">Profile:</span>
                <span className="text-[#D4A853] font-bold">
                  {profiles.find(p => p.id === selectedProfileId)?.name || 'Select Profile'}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-550 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#0D0D0F] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/80 z-50 p-2 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={profileSearch}
                      onChange={(e) => setProfileSearch(e.target.value)}
                      placeholder="Search profiles..."
                      className="w-full bg-[#111113] border border-white/[0.06] focus:border-[#D4A437] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition-all"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto divide-y divide-white/[0.04] scrollbar-thin">
                    {profiles
                      .filter(p => p.name.toLowerCase().includes(profileSearch.toLowerCase()))
                      .map((p) => {
                        const isSelected = p.id === selectedProfileId;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProfileId(p.id);
                              loadData(p.id);
                              setIsProfileDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#D4A437]/10 text-[#D4A437]'
                                : 'text-gray-400 hover:bg-white/[0.01] hover:text-white'
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A437]" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
          <Button
            onClick={openAddModal}
            size="sm"
            className="h-9 gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-black font-bold" /> Add Menu Item
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

      {/* Categories blocks lists */}
      {categories.length === 0 ? (
        <Card className="text-center py-16 text-gray-500 border-white/[0.04]">
          <UtensilsCrossed className="w-10 h-10 mx-auto text-gray-700 mb-2" />
          <p className="text-xs">Please create active Categories first to display dishes.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catGroup = itemsByCategory[cat.id] || { name: cat.name, items: [] };
            if (catGroup.items.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2">
                  <span className="text-[#D4A853] font-bold text-xs uppercase tracking-wider">{cat.name}</span>
                  <span className="text-[10px] text-gray-500">({catGroup.items.length} dishes)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catGroup.items.map((item) => (
                    <Card key={item.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-white/[0.04] hover:border-[#D4A853]/25 transition-all bg-zinc-900/10 relative overflow-hidden group">
                      {/* Left: Image & Info */}
                      <div className="flex gap-4 items-center overflow-hidden flex-1 w-full text-left">
                        <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <UtensilsCrossed className="w-5 h-5 text-gray-700" />
                          )}
                        </div>
                        <div className="overflow-hidden space-y-0.5 text-left flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-bold text-sm text-white truncate">{item.name}</h4>
                            <span
                              className={`w-3 h-3 border flex items-center justify-center rounded shrink-0 ${
                                item.isVeg ? 'border-green-600' : 'border-red-600'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-gray-400 truncate leading-relaxed">
                            {item.description || 'No culinary details provided.'}
                          </p>

                          <div className="flex items-center gap-3 pt-1">
                            <span className="text-xs font-bold text-white font-mono">${item.price.toFixed(2)}</span>
                            {item.isFeatured && (
                              <Badge variant="gold" className="text-[8px] px-1.5 py-0">Specials</Badge>
                            )}
                            {!item.isAvailable && (
                              <span className="text-[8px] bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase px-1.5 py-0.5 rounded">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-end border-t border-white/[0.03] sm:border-t-0 pt-2.5 sm:pt-0">
                        {/* Status Toggle */}
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            item.isAvailable
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15'
                              : 'border-white/5 bg-zinc-900/40 text-gray-500 hover:text-gray-400'
                          }`}
                          title={item.isAvailable ? 'Mark Out of Stock' : 'Mark In Stock'}
                        >
                          {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-gray-500 hover:text-[#D4A853] transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-gray-500 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
              className="relative w-full sm:max-w-lg bg-[#0D0D0F] border-l border-white/[0.06] shadow-2xl h-full flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    {editingItem ? 'Edit Dish Parameters' : 'Add New Culinary Dish'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} id="item-form" className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Dish Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Truffle Tagliatelle"
                    />

                    <Input
                      label="Price ($)"
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="28.00"
                    />

                    <Select
                      label="Menu Category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    />

                    <Select
                      label="Dietary Classification"
                      value={isVeg ? 'veg' : 'nonveg'}
                      onChange={(e) => setIsVeg(e.target.value === 'veg')}
                      options={[
                        { value: 'veg', label: 'Vegetarian (Green)' },
                        { value: 'nonveg', label: 'Non-Vegetarian (Red)' }
                      ]}
                    />
                  </div>

                  <TextArea
                    label="Dish Description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="San Marzano tomato sauce, fresh fior di latte mozzarella, organic basil..."
                  />

                  {/* Progressive image cropper tool */}
                  <div>
                    <ImageCropper
                      label="Dish Image (Square Layout)"
                      aspectRatio="square"
                      value={image}
                      onChange={(base64) => setImage(base64)}
                    />
                  </div>

                  {/* Action checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                    <label className="flex items-center gap-2.5 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-white/[0.08] text-[#D4A853] bg-zinc-950 focus:ring-[#D4A853]/25 accent-[#D4A853] cursor-pointer"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block">Feature Item</span>
                        <span className="text-[9px] text-gray-500 block">Render on homepage carousel specials.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-white/[0.08] text-[#D4A853] bg-zinc-950 focus:ring-[#D4A853]/25 accent-[#D4A853] cursor-pointer"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block">In Stock</span>
                        <span className="text-[9px] text-gray-500 block">Toggle active online guest availability.</span>
                      </div>
                    </label>
                  </div>
                </form>
              </div>

              {/* Form Action Buttons */}
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
                  form="item-form"
                  className="flex-1"
                  isLoading={saving}
                >
                  {editingItem ? 'Save Changes' : 'Create Dish'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
