'use client';

import { useState, useEffect, useRef } from 'react';
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
  Slash,
  Search,
  ChevronDown
} from 'lucide-react';
import ImageCropper from '@/components/image-cropper';

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

  // Modal State
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
        ? { id: editingItem.id, name, description, price, image, isVeg, isFeatured, isAvailable, categoryId }
        : { name, description, price, image, isVeg, isFeatured, isAvailable, categoryId, menuProfileId: selectedProfileId || undefined };

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

  // Group items by category for visual display
  const itemsByCategory = categories.reduce((acc, cat) => {
    const catItems = items.filter((item) => item.categoryId === cat.id);
    acc[cat.id] = { name: cat.name, items: catItems };
    return acc;
  }, {} as { [key: string]: { name: string; items: MenuItem[] } });

  if (loadingProfiles) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4A437]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-[#D4A437]" /> Menu Items
          </h1>
          <p className="text-gray-400 text-sm mt-1">Configure your food offerings, pricing, details and images.</p>
        </div>
        <div className="flex items-center gap-3">
          {profiles.length > 0 && (
            <div className="relative shrink-0 text-left" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setProfileSearch('');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-900 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#D4A437]/30 transition-all cursor-pointer select-none"
              >
                <span className="text-gray-500 uppercase font-bold text-[10px]">Profile:</span>
                <span className="text-[#D4A437] font-bold">
                  {profiles.find(p => p.id === selectedProfileId)?.name || 'Select Profile'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-505 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-black border border-gray-800 rounded-2xl shadow-2xl shadow-black/90 z-50 p-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={profileSearch}
                      onChange={(e) => setProfileSearch(e.target.value)}
                      placeholder="Search profiles..."
                      className="w-full bg-gray-950 border border-gray-800 focus:border-[#D4A437] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Options List */}
                  <div className="max-h-40 overflow-y-auto divide-y divide-gray-900/60 scrollbar-thin">
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
                                : 'text-gray-400 hover:bg-gray-950 hover:text-white'
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A437]" />}
                          </button>
                        );
                      })}
                    {profiles.filter(p => p.name.toLowerCase().includes(profileSearch.toLowerCase())).length === 0 && (
                      <p className="text-center text-[10px] text-gray-600 py-3">No profiles found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-sm shadow-[0_0_15px_rgba(212,164,55,0.2)] hover:shadow-[0_0_20px_rgba(212,164,55,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
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

      {/* Categories sections */}
      {categories.length === 0 ? (
        <div className="glass text-center py-16 text-gray-500 rounded-3xl">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-gray-700 mb-4" />
          <p className="text-sm">Please create active Categories first to display dishes.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => {
            const catGroup = itemsByCategory[cat.id] || { name: cat.name, items: [] };
            if (catGroup.items.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-4">
                <h2 className="font-serif text-2xl font-bold border-b border-gray-900 pb-2 text-[#D4A437]">
                  {cat.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {catGroup.items.map((item) => (
                    <div key={item.id} className="glass p-5 rounded-2xl flex gap-4 items-center justify-between hover:border-[#D4A437]/25 transition-all">
                      {/* Left: Image & Info */}
                      <div className="flex gap-4 items-center overflow-hidden">
                        <div className="w-20 h-20 rounded-xl bg-gray-950 border border-gray-900 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                          ) : (
                            <UtensilsCrossed className="w-6 h-6 text-gray-700" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-white truncate">{item.name}</h4>
                            {/* Veg/Non-Veg Tag */}
                            <span
                              className={`w-3.5 h-3.5 border flex items-center justify-center rounded shrink-0 ${
                                item.isVeg ? 'border-green-600' : 'border-red-600'
                              }`}
                              title={item.isVeg ? 'Veg' : 'Non-Veg'}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-1">{item.description || 'No description provided.'}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-bold text-white">${item.price.toFixed(2)}</span>
                            {item.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#D4A437]/10 border border-[#D4A437]/25 text-[9px] font-bold text-[#D4A437]">
                                <Star className="w-2.5 h-2.5 fill-[#D4A437]" /> Featured
                              </span>
                            )}
                            {!item.isAvailable && (
                              <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/25 text-[9px] font-bold text-red-400">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg bg-gray-950 border border-gray-900 text-gray-400 hover:text-[#D4A437] transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-gray-950 border border-gray-900 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-gold rounded-3xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold mb-6">
              {editingItem ? 'Edit Dish Details' : 'Add New Dish'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Truffle Tagliatelle"
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="28.00"
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Menu Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Dietary Classification
                  </label>
                  <select
                    value={isVeg ? 'veg' : 'nonveg'}
                    onChange={(e) => setIsVeg(e.target.value === 'veg')}
                    className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Dish Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="San Marzano tomato sauce, fresh fior di latte mozzarella, organic basil..."
                  className="w-full bg-[#0d0d0d] border border-gray-800 focus:border-[#D4A437] focus:ring-1 focus:ring-[#D4A437] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all resize-none"
                />
              </div>

              <div>
                <ImageCropper
                  label="Dish Image (Square)"
                  aspectRatio="square"
                  value={image}
                  onChange={(base64) => setImage(base64)}
                />
              </div>

              {/* Status checklist options */}
              <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-900 pt-4">
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-gray-800 text-[#D4A437] bg-black focus:ring-[#D4A437]"
                  />
                  <span className="text-xs text-gray-300">Feature this Item (Highlight in specials)</span>
                </label>

                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-gray-800 text-[#D4A437] bg-black focus:ring-[#D4A437]"
                  />
                  <span className="text-xs text-gray-300">Mark as Available (Currently in stock)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold text-base transition-all duration-300 shadow-[0_0_15px_rgba(212,164,55,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving Dish...
                  </>
                ) : (
                  <>
                    {editingItem ? 'Save Changes' : 'Add Item'}
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
