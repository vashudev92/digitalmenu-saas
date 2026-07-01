/**
 * Centralized Theme Configuration for DigitalMenu SaaS
 * =====================================================
 * Single source of truth for the 8 premium visual layouts.
 * Used by: customer welcome page, menu client view, dashboard profile selector.
 */

// ---------------------------------------------------------------------------
// Theme Definition Interface
// ---------------------------------------------------------------------------

export interface ThemeDefinition {
  /** Unique key stored in DB */
  key: string;
  /** Human-readable name */
  name: string;
  /** One-line description for the dashboard selector */
  description: string;

  /** Layout Mode defining layout components */
  layoutMode: 'luxury' | 'elegant' | 'modern' | 'dark' | 'japanese' | 'bistro' | 'contemporary' | 'indian';

  // ---- Customer Menu View Styles ----
  /** Main page background */
  bg: string;
  /** Primary text color */
  text: string;
  /** Muted/secondary text */
  muted: string;
  /** Sticky header background */
  headerBg: string;
  /** Menu item card background + border */
  cardBg: string;
  /** Search input styling */
  inputBg: string;
  /** Active category tab */
  catActive: string;
  /** Inactive category tab */
  catInactive: string;
  /** Accent text (prices, highlights) */
  accentText: string;
  /** Raw hex accent color for canvas/dynamic use (no Tailwind prefix) */
  accentHex: string;
  /** Section divider border */
  divider: string;
  /** Bottom navigation bar */
  navBg: string;

  // ---- Welcome Page Styles ----
  /** Primary CTA button (View Menu) */
  primaryBtn: string;

  // ---- Price & Card Customization ----
  /** Border radius class for menu item cards */
  cardRadius: string;
  /** Price badge styling */
  priceBadge: string;

  // ---- Dashboard Preview Colors (raw CSS values) ----
  /** Preview background color (CSS value) */
  previewBg: string;
  /** Preview accent color (CSS value) */
  previewAccent: string;
  /** Preview text color (CSS value) */
  previewText: string;
}

// ---------------------------------------------------------------------------
// 8 Premium Theme Definitions (Each represents a unique visual website layout)
// ---------------------------------------------------------------------------

export const THEMES: Record<string, ThemeDefinition> = {
  // ====== 1. LUXURY FINE DINING (Gold on Black) ======
  LUXURY_DARK: {
    key: 'LUXURY_DARK',
    name: 'Luxury Fine Dining',
    description: 'Gold highlights on deep black, elegant serif headings and thin gold borders',
    layoutMode: 'luxury',
    bg: 'bg-[#0A0A0A]',
    text: 'text-white',
    muted: 'text-[#8c8c8c]',
    headerBg: 'bg-[#0A0A0A]/95',
    cardBg: 'bg-[#121212] border-[#D4A437]/20 hover:border-[#D4A437]/50',
    inputBg: 'bg-[#121212] border-gray-900 focus:border-[#D4A437]',
    catActive: 'bg-[#D4A437] text-black border-[#D4A437]',
    catInactive: 'bg-[#121212] text-white border-gray-900 hover:border-gray-800',
    accentText: 'text-[#D4A437]',
    accentHex: '#D4A437',
    divider: 'border-[#D4A437]/10',
    navBg: 'bg-[#121212]/90 border-[#D4A437]/15',
    primaryBtn: 'bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold tracking-wider',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#D4A437]/10 text-[#D4A437] border border-[#D4A437]/20',
    previewBg: '#0A0A0A',
    previewAccent: '#D4A437',
    previewText: '#FFFFFF',
  },

  // ====== 2. ELEGANT WHITE (Clean Serif Light Mode) ======
  ELEGANT_LIGHT: {
    key: 'ELEGANT_LIGHT',
    name: 'Elegant White',
    description: 'Chic cream & warm tan tones, round imagery, minimal layout, soft drop shadows',
    layoutMode: 'elegant',
    bg: 'bg-[#F7F5F0]',
    text: 'text-[#2D241E]',
    muted: 'text-[#7D6B5F]',
    headerBg: 'bg-[#F7F5F0]/95',
    cardBg: 'bg-white border-[#E6DEC9] hover:border-[#C4B79A] shadow-sm',
    inputBg: 'bg-white border-[#E6DEC9] focus:border-[#A68F7B]',
    catActive: 'bg-[#8C6D53] text-white border-[#8C6D53]',
    catInactive: 'bg-white text-[#7D6B5F] border-[#E6DEC9] hover:bg-gray-50',
    accentText: 'text-[#8C6D53]',
    accentHex: '#8C6D53',
    divider: 'border-[#E6DEC9]',
    navBg: 'bg-white/90 border-t border-[#E6DEC9]',
    primaryBtn: 'bg-[#8C6D53] hover:bg-[#70553E] text-white font-semibold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#8C6D53]/10 text-[#8C6D53] border border-[#8C6D53]/20',
    previewBg: '#F7F5F0',
    previewAccent: '#8C6D53',
    previewText: '#2D241E',
  },

  // ====== 3. MODERN CAFE (Sans-Serif 2-Column Grid) ======
  MODERN_CAFE: {
    key: 'MODERN_CAFE',
    name: 'Modern Cafe',
    description: 'Poppins fonts, 2-column grid layout, outline pill category selectors, header banners',
    layoutMode: 'modern',
    bg: 'bg-white',
    text: 'text-[#1A1A1A]',
    muted: 'text-[#6B7280]',
    headerBg: 'bg-white/95',
    cardBg: 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#10B981] hover:shadow-md transition-all',
    inputBg: 'bg-[#F3F4F6] border-[#E5E7EB] focus:bg-white focus:border-[#10B981]',
    catActive: 'bg-[#10B981] text-white border-[#10B981]',
    catInactive: 'bg-white text-[#4B5563] border-[#D1D5DB] hover:bg-gray-50',
    accentText: 'text-[#10B981]',
    accentHex: '#10B981',
    divider: 'border-[#E5E7EB]',
    navBg: 'bg-[#F9FAFB]/90 border-t border-[#E5E7EB]',
    primaryBtn: 'bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-xl',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/15',
    previewBg: '#FFFFFF',
    previewAccent: '#10B981',
    previewText: '#1A1A1A',
  },

  // ====== 4. DARK PREMIUM (Slate Glow Mode) ======
  DARK_PREMIUM: {
    key: 'DARK_PREMIUM',
    name: 'Dark Premium',
    description: 'Charcoal backdrop with cyan glowing active borders and slate glassmorphism',
    layoutMode: 'dark',
    bg: 'bg-[#0F172A]',
    text: 'text-[#F1F5F9]',
    muted: 'text-[#94A3B8]',
    headerBg: 'bg-[#0F172A]/95',
    cardBg: 'bg-[#1E293B]/80 border-[#334155] hover:border-[#38BDF8] hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]',
    inputBg: 'bg-[#1E293B] border-[#334155] focus:border-[#38BDF8]',
    catActive: 'bg-[#38BDF8] text-slate-900 border-[#38BDF8]',
    catInactive: 'bg-[#1E293B] text-[#94A3B8] border-[#334155] hover:border-[#475569]',
    accentText: 'text-[#38BDF8]',
    accentHex: '#38BDF8',
    divider: 'border-[#334155]',
    navBg: 'bg-[#1E293B]/90 border-t border-[#334155]',
    primaryBtn: 'bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-900 font-bold',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20',
    previewBg: '#0F172A',
    previewAccent: '#38BDF8',
    previewText: '#F1F5F9',
  },

  // ====== 5. MINIMAL JAPANESE (Ultra-clean Text Mode) ======
  MINIMAL_JAPANESE: {
    key: 'MINIMAL_JAPANESE',
    name: 'Minimal Japanese',
    description: 'Pure Zen whitespace, vertical/minimal text tabs, borderless cards, square images',
    layoutMode: 'japanese',
    bg: 'bg-[#FCFAF2]',
    text: 'text-[#1F1F24]',
    muted: 'text-[#8E8B82]',
    headerBg: 'bg-[#FCFAF2]/95',
    cardBg: 'bg-[#FCFAF2] border-b border-[#E6E2D8] hover:bg-white/50 transition-colors',
    inputBg: 'bg-white border-[#E6E2D8] focus:border-[#1F1F24]',
    catActive: 'border-b-2 border-[#1F1F24] text-[#1F1F24] font-bold',
    catInactive: 'text-[#8E8B82] hover:text-[#1F1F24]',
    accentText: 'text-[#1F1F24] font-bold',
    accentHex: '#1F1F24',
    divider: 'border-[#E6E2D8]',
    navBg: 'bg-[#FCFAF2]/90 border-t border-[#E6E2D8]',
    primaryBtn: 'bg-[#1F1F24] hover:bg-[#2D2D35] text-white font-medium rounded-none tracking-widest',
    cardRadius: 'rounded-none',
    priceBadge: 'text-[#1F1F24] font-mono border-none bg-transparent px-0 font-bold',
    previewBg: '#FCFAF2',
    previewAccent: '#1F1F24',
    previewText: '#1F1F24',
  },

  // ====== 6. ITALIAN BISTRO (Warm Rustic Cafe) ======
  ITALIAN_BISTRO: {
    key: 'ITALIAN_BISTRO',
    name: 'Italian Bistro',
    description: 'Terracotta & sage tones, card layouts with soft shadows, custom category bistro icons',
    layoutMode: 'bistro',
    bg: 'bg-[#FAF6F0]',
    text: 'text-[#4A2F22]',
    muted: 'text-[#8B7466]',
    headerBg: 'bg-[#FAF6F0]/95',
    cardBg: 'bg-white border-[#EADFCB] hover:shadow-md transition-shadow',
    inputBg: 'bg-white border-[#EADFCB] focus:border-[#A25232]',
    catActive: 'bg-[#A25232] text-white border-[#A25232]',
    catInactive: 'bg-white text-[#8B7466] border-[#EADFCB] hover:bg-[#FAF6F0]',
    accentText: 'text-[#A25232]',
    accentHex: '#A25232',
    divider: 'border-[#EADFCB]',
    navBg: 'bg-white/95 border-t border-[#EADFCB]',
    primaryBtn: 'bg-[#A25232] hover:bg-[#834026] text-white font-serif font-bold rounded-lg',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#A25232]/10 text-[#A25232] border border-[#A25232]/15',
    previewBg: '#FAF6F0',
    previewAccent: '#A25232',
    previewText: '#4A2F22',
  },

  // ====== 7. CONTEMPORARY (High-Contrast Bold Layout) ======
  CONTEMPORARY_REST: {
    key: 'CONTEMPORARY_REST',
    name: 'Contemporary',
    description: 'Bold text blocks, full-width display images, high contrast active highlights',
    layoutMode: 'contemporary',
    bg: 'bg-[#F3F4F6]',
    text: 'text-[#111827]',
    muted: 'text-[#6B7280]',
    headerBg: 'bg-[#F3F4F6]/95',
    cardBg: 'bg-white border border-[#E5E7EB] hover:border-black hover:shadow-xl transition-all',
    inputBg: 'bg-white border-[#D1D5DB] focus:border-black',
    catActive: 'bg-black text-white border-black',
    catInactive: 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-gray-50',
    accentText: 'text-black font-extrabold',
    accentHex: '#000000',
    divider: 'border-[#E5E7EB]',
    navBg: 'bg-white/90 border-t border-[#E5E7EB]',
    primaryBtn: 'bg-black hover:bg-gray-900 text-white font-extrabold rounded-none uppercase tracking-wider',
    cardRadius: 'rounded-none',
    priceBadge: 'bg-black text-white px-2.5 py-1 text-xs font-black uppercase',
    previewBg: '#F3F4F6',
    previewAccent: '#000000',
    previewText: '#111827',
  },

  // ====== 8. TRADITIONAL INDIAN (Maroon & Saffron Gold) ======
  TRADITIONAL_INDIAN: {
    key: 'TRADITIONAL_INDIAN',
    name: 'Traditional Indian',
    description: 'Rich maroon and saffron gold colorways, ornate patterned headers, decorative fonts',
    layoutMode: 'indian',
    bg: 'bg-[#1A0505]',
    text: 'text-[#FFF2E0]',
    muted: 'text-[#B89B80]',
    headerBg: 'bg-[#1A0505]/95',
    cardBg: 'bg-[#2A0F0F] border-[#E8973F]/20 hover:border-[#E8973F]/60',
    inputBg: 'bg-[#2A0F0F] border-[#3B1C1C] focus:border-[#E8973F]',
    catActive: 'bg-[#E8973F] text-black border-[#E8973F]',
    catInactive: 'bg-[#2A0F0F] text-[#FFF2E0] border-[#3B1C1C] hover:border-gray-800',
    accentText: 'text-[#E8973F]',
    accentHex: '#E8973F',
    divider: 'border-[#E8973F]/15',
    navBg: 'bg-[#2A0F0F]/90 border-t border-[#E8973F]/20',
    primaryBtn: 'bg-[#E8973F] hover:bg-[#D4822A] text-black font-bold rounded-lg',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#E8973F]/10 text-[#E8973F] border border-[#E8973F]/20',
    previewBg: '#1A0505',
    previewAccent: '#E8973F',
    previewText: '#FFF2E0',
  },
};

// ---------------------------------------------------------------------------
// Legacy Theme Key Mapping (backward compatibility)
// ---------------------------------------------------------------------------

const LEGACY_THEME_MAP: Record<string, string> = {
  CAFE_THEME: 'MODERN_CAFE',
  MODERN_THEME: 'MINIMAL_JAPANESE',
  MODERN_RED: 'CONTEMPORARY_REST',
  RUSTIC_CAFE: 'ITALIAN_BISTRO',
  OCEAN_BLUE: 'DARK_PREMIUM',
  GREEN_NATURE: 'MODERN_CAFE',
  MINIMAL_WHITE: 'MINIMAL_JAPANESE',
  ROYAL_PURPLE: 'DARK_PREMIUM',
  PREMIUM_DARK: 'DARK_PREMIUM',
  CLASSIC_SIMPLE: 'ELEGANT_LIGHT',
  MINIMALISTIC: 'MINIMAL_JAPANESE',
};

// ---------------------------------------------------------------------------
// Helper: Get Theme by Key (with fallback)
// ---------------------------------------------------------------------------

export function getTheme(key: string | null | undefined): ThemeDefinition {
  if (!key) return THEMES.LUXURY_DARK;
  if (THEMES[key]) return THEMES[key];
  const mapped = LEGACY_THEME_MAP[key];
  if (mapped && THEMES[mapped]) return THEMES[mapped];
  return THEMES.LUXURY_DARK;
}

// ---------------------------------------------------------------------------
// Theme List for Dashboard Selector
// ---------------------------------------------------------------------------

export const THEME_LIST = Object.values(THEMES);

// ---------------------------------------------------------------------------
// Google Font Options (10 restaurant-friendly fonts)
// ---------------------------------------------------------------------------

export interface FontOption {
  family: string;
  category: 'serif' | 'sans-serif';
  description: string;
  googleParam: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    family: 'Playfair Display',
    category: 'serif',
    description: 'Elegant serif — ideal for luxury headings',
    googleParam: 'Playfair+Display:wght@400;600;700',
  },
  {
    family: 'Inter',
    category: 'sans-serif',
    description: 'Modern sans-serif — clean and highly readable',
    googleParam: 'Inter:wght@400;500;600;700',
  },
  {
    family: 'Poppins',
    category: 'sans-serif',
    description: 'Geometric sans-serif — friendly and approachable',
    googleParam: 'Poppins:wght@400;500;600;700',
  },
  {
    family: 'Lora',
    category: 'serif',
    description: 'Contemporary serif — balances elegance with warmth',
    googleParam: 'Lora:wght@400;500;600;700',
  },
  {
    family: 'Merriweather',
    category: 'serif',
    description: 'Classic editorial serif — excellent for body text',
    googleParam: 'Merriweather:wght@400;700',
  },
  {
    family: 'Nunito',
    category: 'sans-serif',
    description: 'Rounded sans-serif — soft and casual dining feel',
    googleParam: 'Nunito:wght@400;600;700',
  },
  {
    family: 'Raleway',
    category: 'sans-serif',
    description: 'Elegant thin sans-serif — sophisticated and airy',
    googleParam: 'Raleway:wght@400;500;600;700',
  },
  {
    family: 'Montserrat',
    category: 'sans-serif',
    description: 'Bold geometric sans-serif — strong brand presence',
    googleParam: 'Montserrat:wght@400;500;600;700',
  },
  {
    family: 'DM Sans',
    category: 'sans-serif',
    description: 'Low-contrast sans-serif — compact and professional',
    googleParam: 'DM+Sans:wght@400;500;600;700',
  },
  {
    family: 'Libre Baskerville',
    category: 'serif',
    description: 'Traditional book serif — classic fine-dining menus',
    googleParam: 'Libre+Baskerville:wght@400;700',
  },
];

// ---------------------------------------------------------------------------
// Color Presets for Custom Branding
// ---------------------------------------------------------------------------

export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Gold Classic',       primary: '#D4A437', secondary: '#B88E2F', accent: '#F5D76E' },
  { name: 'Ruby Red',           primary: '#DC2626', secondary: '#991B1B', accent: '#FCA5A5' },
  { name: 'Ocean Teal',         primary: '#0EA5E9', secondary: '#0369A1', accent: '#7DD3FC' },
  { name: 'Emerald Green',      primary: '#22C55E', secondary: '#15803D', accent: '#86EFAC' },
  { name: 'Royal Violet',       primary: '#8B5CF6', secondary: '#6D28D9', accent: '#C4B5FD' },
  { name: 'Sunset Orange',      primary: '#F97316', secondary: '#C2410C', accent: '#FDBA74' },
  { name: 'Rose Pink',          primary: '#EC4899', secondary: '#BE185D', accent: '#F9A8D4' },
  { name: 'Slate Silver',       primary: '#94A3B8', secondary: '#64748B', accent: '#CBD5E1' },
  { name: 'Saffron Indian',     primary: '#E8973F', secondary: '#D4822A', accent: '#FCD34D' },
  { name: 'Midnight Black',     primary: '#1A1A1A', secondary: '#333333', accent: '#666666' },
];
