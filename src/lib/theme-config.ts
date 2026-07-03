/**
 * Centralized Premium Themes Configuration for DigitalMenu SaaS
 * =============================================================
 * Single source of truth for the 6 premium visual layouts.
 * Used by: customer welcome page, menu client view, dashboard selector, admin library.
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

  /** Layout Mode defining layout components structure */
  layoutMode: 'luxury' | 'cafe' | 'japanese' | 'bistro' | 'indian' | 'beach';

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
// 6 Premium Theme Definitions (Each represents a unique visual website layout)
// ---------------------------------------------------------------------------

export const THEMES: Record<string, ThemeDefinition> = {
  // ====== 1. LUXURY FINE DINING (Gold on Black) ======
  LUXURY_DARK: {
    key: 'LUXURY_DARK',
    name: 'Luxury Fine Dining',
    description: 'Gold highlights on deep black, elegant serif headings and thin double gold borders',
    layoutMode: 'luxury',
    bg: 'bg-[#050505]',
    text: 'text-white',
    muted: 'text-[#A3A3A3]',
    headerBg: 'bg-[#050505]/95',
    cardBg: 'bg-[#0E0E0E] border-[#D4A437]/20 hover:border-[#D4A437]/50 shadow-[0_4px_30px_rgba(0,0,0,0.8)]',
    inputBg: 'bg-[#0E0E0E] border-gray-900 focus:border-[#D4A437]',
    catActive: 'bg-[#D4A437] text-black border-[#D4A437] font-serif',
    catInactive: 'bg-[#0E0E0E] text-white border-gray-900 hover:border-gray-800',
    accentText: 'text-[#D4A437]',
    accentHex: '#D4A437',
    divider: 'border-[#D4A437]/15',
    navBg: 'bg-[#0E0E0E]/90 border-[#D4A437]/15',
    primaryBtn: 'bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold tracking-wider rounded-none uppercase',
    cardRadius: 'rounded-none',
    priceBadge: 'bg-[#D4A437]/10 text-[#D4A437] border border-[#D4A437]/20 px-2 py-0.5 text-[9px] uppercase tracking-widest font-serif',
    previewBg: '#050505',
    previewAccent: '#D4A437',
    previewText: '#FFFFFF',
  },

  // ====== 2. MODERN CAFE (Warm Coffee Tones) ======
  MODERN_CAFE: {
    key: 'MODERN_CAFE',
    name: 'Modern Cafe',
    description: 'Coffee colors, rounded cards, friendly typography, warm illustrations',
    layoutMode: 'cafe',
    bg: 'bg-[#FAF6F0]',
    text: 'text-[#3E2723]',
    muted: 'text-[#5D4037]',
    headerBg: 'bg-[#FAF6F0]/95',
    cardBg: 'bg-white border-[#EFEBE9] hover:border-[#BCAAA4] shadow-[0_8px_20px_rgba(141,110,99,0.06)]',
    inputBg: 'bg-[#F5EEEE] border-[#EFEBE9] focus:border-[#8D6E63]',
    catActive: 'bg-[#5D4037] text-white border-[#5D4037]',
    catInactive: 'bg-white text-[#5D4037] border-[#EFEBE9] hover:bg-[#F5EEEE]',
    accentText: 'text-[#5D4037]',
    accentHex: '#5D4037',
    divider: 'border-[#EFEBE9]',
    navBg: 'bg-white/95 border-[#EFEBE9]',
    primaryBtn: 'bg-[#5D4037] hover:bg-[#4E342E] text-white font-medium rounded-full',
    cardRadius: 'rounded-3xl',
    priceBadge: 'bg-[#8D6E63]/15 text-[#5D4037] px-2 py-1 rounded-full text-[9px] font-bold',
    previewBg: '#FAF6F0',
    previewAccent: '#5D4037',
    previewText: '#3E2723',
  },

  // ====== 3. JAPANESE MINIMAL (Stark Zen Space) ======
  MINIMAL_JAPANESE: {
    key: 'MINIMAL_JAPANESE',
    name: 'Japanese Minimal',
    description: 'Lots of whitespace, minimal layout, borderless simple cards, thin typography',
    layoutMode: 'japanese',
    bg: 'bg-[#FCFAF2]',
    text: 'text-[#1F1F24]',
    muted: 'text-[#55534E]',
    headerBg: 'bg-[#FCFAF2]/95',
    cardBg: 'bg-[#FCFAF2] border-b border-[#E6E2D8] hover:bg-white/40 transition-colors',
    inputBg: 'bg-white border-[#E6E2D8] focus:border-[#1F1F24]',
    catActive: 'border-b-2 border-[#1F1F24] text-[#1F1F24] font-medium rounded-none',
    catInactive: 'text-[#55534E] hover:text-[#1F1F24]',
    accentText: 'text-[#1F1F24] font-medium',
    accentHex: '#1F1F24',
    divider: 'border-[#E6E2D8]',
    navBg: 'bg-[#FCFAF2]/90 border-t border-[#E6E2D8]',
    primaryBtn: 'bg-[#1F1F24] hover:bg-[#2D2D35] text-white font-normal rounded-none tracking-widest uppercase',
    cardRadius: 'rounded-none',
    priceBadge: 'text-[#1F1F24] font-mono font-medium',
    previewBg: '#FCFAF2',
    previewAccent: '#1F1F24',
    previewText: '#1F1F24',
  },

  // ====== 4. ITALIAN BISTRO (Warm Beige & Wine Red) ======
  ITALIAN_BISTRO: {
    key: 'ITALIAN_BISTRO',
    name: 'Italian Bistro',
    description: 'Warm beige backdrop, deep wine red highlights, rustic card frames',
    layoutMode: 'bistro',
    bg: 'bg-[#FFFDF9]',
    text: 'text-[#2C1D11]',
    muted: 'text-[#5C4D3A]',
    headerBg: 'bg-[#FFFDF9]/95',
    cardBg: 'bg-white border-2 border-[#EAE1D2] hover:border-[#800020] transition-colors',
    inputBg: 'bg-white border-[#EAE1D2] focus:border-[#800020]',
    catActive: 'bg-[#800020] text-white border-[#800020] font-serif',
    catInactive: 'bg-white text-[#5C4D3A] border-[#EAE1D2] hover:bg-[#FFFDF9]',
    accentText: 'text-[#800020]',
    accentHex: '#800020',
    divider: 'border-[#EAE1D2]',
    navBg: 'bg-white/95 border-t border-[#EAE1D2]',
    primaryBtn: 'bg-[#800020] hover:bg-[#600018] text-white font-serif font-bold rounded-lg',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#800020]/5 text-[#800020] border border-[#800020]/20 px-2 py-0.5 rounded text-[10px] font-serif italic',
    previewBg: '#FFFDF9',
    previewAccent: '#800020',
    previewText: '#2C1D11',
  },

  // ====== 5. TRADITIONAL INDIAN (Maroon & Gold) ======
  TRADITIONAL_INDIAN: {
    key: 'TRADITIONAL_INDIAN',
    name: 'Traditional Indian',
    description: 'Rich maroon backdrop, saffron gold highlights, decorative headings',
    layoutMode: 'indian',
    bg: 'bg-[#1C0505]',
    text: 'text-[#FFE4C4]',
    muted: 'text-[#D4AF37]',
    headerBg: 'bg-[#1C0505]/95',
    cardBg: 'bg-[#2E0F0F] border-2 border-[#E8973F]/20 hover:border-[#E8973F]/60',
    inputBg: 'bg-[#2E0F0F] border-[#3F1C1C] focus:border-[#E8973F]',
    catActive: 'bg-[#E8973F] text-black border-[#E8973F] font-semibold',
    catInactive: 'bg-[#2E0F0F] text-[#FFE4C4] border-[#3F1C1C] hover:border-gray-800',
    accentText: 'text-[#E8973F]',
    accentHex: '#E8973F',
    divider: 'border-[#E8973F]/20',
    navBg: 'bg-[#2E0F0F]/90 border-t border-[#E8973F]/20',
    primaryBtn: 'bg-gradient-to-r from-[#E8973F] to-[#D4822A] hover:from-[#D4822A] hover:to-[#B86E1F] text-black font-bold rounded-xl uppercase tracking-wider',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#E8973F]/15 text-[#E8973F] border border-[#E8973F]/30 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider',
    previewBg: '#1C0505',
    previewAccent: '#E8973F',
    previewText: '#FFE4C4',
  },

  // ====== 6. BEACH RESTAURANT (Breezy Sand & Ocean Teal) ======
  BEACH_RESTAURANT: {
    key: 'BEACH_RESTAURANT',
    name: 'Beach Restaurant',
    description: 'Ocean teal & sand colors, relaxed spacing, photo-first layouts',
    layoutMode: 'beach',
    bg: 'bg-[#F2ECE4]',
    text: 'text-[#004D40]',
    muted: 'text-[#005B4F]',
    headerBg: 'bg-[#F2ECE4]/95',
    cardBg: 'bg-white border-[#E0D5C8] hover:border-[#00897B] hover:shadow-lg transition-all',
    inputBg: 'bg-white border-[#E0D5C8] focus:border-[#00897B]',
    catActive: 'bg-[#00897B] text-white border-[#00897B]',
    catInactive: 'bg-white text-[#005B4F] border-[#E0D5C8] hover:bg-[#F2ECE4]',
    accentText: 'text-[#00897B]',
    accentHex: '#00897B',
    divider: 'border-[#E0D5C8]',
    navBg: 'bg-white/90 border-t border-[#E0D5C8]',
    primaryBtn: 'bg-gradient-to-r from-[#00897B] to-[#00695C] hover:from-[#00695C] hover:to-[#004D40] text-white font-semibold rounded-2xl',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#00897B]/10 text-[#00897B] border border-[#00897B]/15 px-2 py-0.5 rounded-md text-[9px] font-semibold',
    previewBg: '#F2ECE4',
    previewAccent: '#00897B',
    previewText: '#004D40',
  },
};

// ---------------------------------------------------------------------------
// Legacy Theme Key Mapping (backward compatibility)
// ---------------------------------------------------------------------------

const LEGACY_THEME_MAP: Record<string, string> = {
  CAFE_THEME: 'MODERN_CAFE',
  MODERN_THEME: 'MINIMAL_JAPANESE',
  MODERN_RED: 'ITALIAN_BISTRO',
  RUSTIC_CAFE: 'MODERN_CAFE',
  OCEAN_BLUE: 'BEACH_RESTAURANT',
  GREEN_NATURE: 'MODERN_CAFE',
  MINIMAL_WHITE: 'MINIMAL_JAPANESE',
  ROYAL_PURPLE: 'TRADITIONAL_INDIAN',
  PREMIUM_DARK: 'LUXURY_DARK',
  CLASSIC_SIMPLE: 'ITALIAN_BISTRO',
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

export function getContrastColor(hexColor: string | null | undefined): { color: string } {
  if (!hexColor || typeof hexColor !== 'string') return { color: '#FFFFFF' };
  
  const cleanHex = hexColor.trim().replace('#', '');
  if (cleanHex.length !== 6 && cleanHex.length !== 3) {
    return { color: '#FFFFFF' };
  }
  
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    r = parseInt(cleanHex.substring(0, 1) + cleanHex.substring(0, 1), 16);
    g = parseInt(cleanHex.substring(1, 2) + cleanHex.substring(1, 2), 16);
    b = parseInt(cleanHex.substring(2, 3) + cleanHex.substring(2, 3), 16);
  }
  
  // Calculate brightness (YIQ formula)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return { color: yiq >= 135 ? '#000000' : '#FFFFFF' };
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
