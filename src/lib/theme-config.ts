/**
 * Centralized Theme Configuration for DigitalMenu SaaS
 * =====================================================
 * Single source of truth for all 12 premium themes.
 * Used by: welcome page, menu client view, dashboard profile selector, QR standee canvas.
 *
 * To add a new theme:
 * 1. Add a new entry to the THEMES record below
 * 2. No database migration needed (theme is stored as a String)
 * 3. The new theme automatically appears in the dashboard selector
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

  // ---- Card Shape ----
  /** Border radius class for menu item cards */
  cardRadius: string;

  // ---- Price Badge ----
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
// 12 Premium Theme Definitions
// ---------------------------------------------------------------------------

export const THEMES: Record<string, ThemeDefinition> = {
  // ====== 1. LUXURY BLACK & GOLD ======
  LUXURY_DARK: {
    key: 'LUXURY_DARK',
    name: 'Luxury Black & Gold',
    description: 'Elegant gold highlights on deep black — classic fine dining',
    bg: 'bg-[#0A0A0A]',
    text: 'text-white',
    muted: 'text-gray-400',
    headerBg: 'bg-[#0A0A0A]/95',
    cardBg: 'bg-[#121212] border-[#D4A437]/20',
    inputBg: 'bg-[#121212] border-gray-900 focus:border-[#D4A437]',
    catActive: 'bg-[#D4A437] text-black border-[#D4A437]',
    catInactive: 'bg-[#121212] text-white border-gray-900',
    accentText: 'text-[#D4A437]',
    accentHex: '#D4A437',
    divider: 'border-gray-900',
    navBg: 'bg-[#121212]/90 border-[#D4A437]/15',
    primaryBtn: 'bg-gradient-to-r from-[#D4A437] to-[#B88E2F] hover:from-[#B88E2F] hover:to-[#A37B24] text-black font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#D4A437]/10 text-[#D4A437] border border-[#D4A437]/20',
    previewBg: '#0A0A0A',
    previewAccent: '#D4A437',
    previewText: '#FFFFFF',
  },

  // ====== 2. ELEGANT WHITE ======
  ELEGANT_LIGHT: {
    key: 'ELEGANT_LIGHT',
    name: 'Elegant White',
    description: 'Chic cream with warm brown accents — premium brunch vibes',
    bg: 'bg-[#F7F3EE]',
    text: 'text-[#1F1F1F]',
    muted: 'text-[#777777]',
    headerBg: 'bg-[#F7F3EE]/95',
    cardBg: 'bg-white border-[#D4A24C]/25 shadow-sm',
    inputBg: 'bg-white border-[#ece6df] focus:border-[#D4A24C]',
    catActive: 'bg-[#D4A24C] text-white border-[#D4A24C]',
    catInactive: 'bg-white text-gray-500 border-[#ece6df]',
    accentText: 'text-[#D4A24C]',
    accentHex: '#D4A24C',
    divider: 'border-[#ece6df]',
    navBg: 'bg-white/90 border-[#D4A24C]/15',
    primaryBtn: 'bg-gradient-to-r from-[#D4A24C] to-[#C2932E] hover:from-[#C2932E] hover:to-[#A37B24] text-white font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#D4A24C]/10 text-[#D4A24C] border border-[#D4A24C]/20',
    previewBg: '#F7F3EE',
    previewAccent: '#D4A24C',
    previewText: '#1F1F1F',
  },

  // ====== 3. MODERN RED ======
  MODERN_RED: {
    key: 'MODERN_RED',
    name: 'Modern Red',
    description: 'Dark charcoal with vibrant crimson — bold and contemporary',
    bg: 'bg-[#121212]',
    text: 'text-[#F5F5F5]',
    muted: 'text-[#888888]',
    headerBg: 'bg-[#121212]/95',
    cardBg: 'bg-[#1A1A1A] border-[#DC2626]/15',
    inputBg: 'bg-[#1A1A1A] border-[#333] focus:border-[#DC2626]',
    catActive: 'bg-[#DC2626] text-white border-[#DC2626]',
    catInactive: 'bg-[#1A1A1A] text-[#999] border-[#333]',
    accentText: 'text-[#EF4444]',
    accentHex: '#DC2626',
    divider: 'border-[#2A2A2A]',
    navBg: 'bg-[#1A1A1A]/90 border-[#DC2626]/15',
    primaryBtn: 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white font-bold',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#DC2626]/10 text-[#EF4444] border border-[#DC2626]/20',
    previewBg: '#121212',
    previewAccent: '#DC2626',
    previewText: '#F5F5F5',
  },

  // ====== 4. RUSTIC BROWN CAFE ======
  RUSTIC_CAFE: {
    key: 'RUSTIC_CAFE',
    name: 'Rustic Brown Cafe',
    description: 'Warm espresso tones with latte highlights — cozy cafe feel',
    bg: 'bg-[#1E1610]',
    text: 'text-[#F5F2EB]',
    muted: 'text-[#A08875]',
    headerBg: 'bg-[#1E1610]/95',
    cardBg: 'bg-[#291E16] border-[#A07855]/20',
    inputBg: 'bg-[#291E16] border-[#3B2B20] focus:border-[#A07855]',
    catActive: 'bg-[#A07855] text-[#F5F2EB] border-[#A07855]',
    catInactive: 'bg-[#291E16] text-[#A08875] border-[#3B2B20]',
    accentText: 'text-[#C49A6C]',
    accentHex: '#A07855',
    divider: 'border-[#3B2B20]',
    navBg: 'bg-[#291E16]/90 border-[#A07855]/15',
    primaryBtn: 'bg-gradient-to-r from-[#A07855] to-[#8B6544] hover:from-[#8B6544] hover:to-[#725437] text-white font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#A07855]/10 text-[#C49A6C] border border-[#A07855]/20',
    previewBg: '#1E1610',
    previewAccent: '#A07855',
    previewText: '#F5F2EB',
  },

  // ====== 5. OCEAN BLUE ======
  OCEAN_BLUE: {
    key: 'OCEAN_BLUE',
    name: 'Ocean Blue',
    description: 'Deep navy with aqua teal accents — coastal seafood dining',
    bg: 'bg-[#0B1426]',
    text: 'text-[#E8F0FE]',
    muted: 'text-[#6B8DB5]',
    headerBg: 'bg-[#0B1426]/95',
    cardBg: 'bg-[#0F1D35] border-[#0EA5E9]/15',
    inputBg: 'bg-[#0F1D35] border-[#1E3A5F] focus:border-[#0EA5E9]',
    catActive: 'bg-[#0EA5E9] text-white border-[#0EA5E9]',
    catInactive: 'bg-[#0F1D35] text-[#6B8DB5] border-[#1E3A5F]',
    accentText: 'text-[#38BDF8]',
    accentHex: '#0EA5E9',
    divider: 'border-[#1E3A5F]',
    navBg: 'bg-[#0F1D35]/90 border-[#0EA5E9]/15',
    primaryBtn: 'bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] text-white font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/20',
    previewBg: '#0B1426',
    previewAccent: '#0EA5E9',
    previewText: '#E8F0FE',
  },

  // ====== 6. GREEN NATURE ======
  GREEN_NATURE: {
    key: 'GREEN_NATURE',
    name: 'Green Nature',
    description: 'Forest dark with emerald sage accents — organic & healthy',
    bg: 'bg-[#0C1A0F]',
    text: 'text-[#E8F5E9]',
    muted: 'text-[#6B9B73]',
    headerBg: 'bg-[#0C1A0F]/95',
    cardBg: 'bg-[#122117] border-[#22C55E]/15',
    inputBg: 'bg-[#122117] border-[#1E3B24] focus:border-[#22C55E]',
    catActive: 'bg-[#22C55E] text-white border-[#22C55E]',
    catInactive: 'bg-[#122117] text-[#6B9B73] border-[#1E3B24]',
    accentText: 'text-[#4ADE80]',
    accentHex: '#22C55E',
    divider: 'border-[#1E3B24]',
    navBg: 'bg-[#122117]/90 border-[#22C55E]/15',
    primaryBtn: 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#22C55E]/10 text-[#4ADE80] border border-[#22C55E]/20',
    previewBg: '#0C1A0F',
    previewAccent: '#22C55E',
    previewText: '#E8F5E9',
  },

  // ====== 7. MINIMAL WHITE ======
  MINIMAL_WHITE: {
    key: 'MINIMAL_WHITE',
    name: 'Minimal White',
    description: 'Clean pure white with subtle gray — modern minimalism',
    bg: 'bg-[#FAFAFA]',
    text: 'text-[#1A1A1A]',
    muted: 'text-[#999999]',
    headerBg: 'bg-[#FAFAFA]/95',
    cardBg: 'bg-white border-[#E5E5E5] shadow-sm',
    inputBg: 'bg-white border-[#E5E5E5] focus:border-[#333333]',
    catActive: 'bg-[#1A1A1A] text-white border-[#1A1A1A]',
    catInactive: 'bg-white text-[#666] border-[#E5E5E5]',
    accentText: 'text-[#1A1A1A]',
    accentHex: '#1A1A1A',
    divider: 'border-[#EEEEEE]',
    navBg: 'bg-white/90 border-[#E5E5E5]',
    primaryBtn: 'bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#E5E5E5]',
    previewBg: '#FAFAFA',
    previewAccent: '#1A1A1A',
    previewText: '#1A1A1A',
  },

  // ====== 8. ROYAL PURPLE ======
  ROYAL_PURPLE: {
    key: 'ROYAL_PURPLE',
    name: 'Royal Purple',
    description: 'Deep indigo with violet lavender accents — regal ambiance',
    bg: 'bg-[#0E0B1A]',
    text: 'text-[#EDE9FE]',
    muted: 'text-[#8B7FB8]',
    headerBg: 'bg-[#0E0B1A]/95',
    cardBg: 'bg-[#161229] border-[#8B5CF6]/15',
    inputBg: 'bg-[#161229] border-[#2D2650] focus:border-[#8B5CF6]',
    catActive: 'bg-[#8B5CF6] text-white border-[#8B5CF6]',
    catInactive: 'bg-[#161229] text-[#8B7FB8] border-[#2D2650]',
    accentText: 'text-[#A78BFA]',
    accentHex: '#8B5CF6',
    divider: 'border-[#2D2650]',
    navBg: 'bg-[#161229]/90 border-[#8B5CF6]/15',
    primaryBtn: 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#8B5CF6]/10 text-[#A78BFA] border border-[#8B5CF6]/20',
    previewBg: '#0E0B1A',
    previewAccent: '#8B5CF6',
    previewText: '#EDE9FE',
  },

  // ====== 9. PREMIUM DARK ======
  PREMIUM_DARK: {
    key: 'PREMIUM_DARK',
    name: 'Premium Dark',
    description: 'Slate dark with silver platinum accents — upscale lounge',
    bg: 'bg-[#111118]',
    text: 'text-[#E4E4ED]',
    muted: 'text-[#70708C]',
    headerBg: 'bg-[#111118]/95',
    cardBg: 'bg-[#1A1A25] border-[#C0C0D0]/10',
    inputBg: 'bg-[#1A1A25] border-[#2A2A3A] focus:border-[#A0A0B8]',
    catActive: 'bg-[#C0C0D0] text-[#111118] border-[#C0C0D0]',
    catInactive: 'bg-[#1A1A25] text-[#70708C] border-[#2A2A3A]',
    accentText: 'text-[#C0C0D0]',
    accentHex: '#C0C0D0',
    divider: 'border-[#2A2A3A]',
    navBg: 'bg-[#1A1A25]/90 border-[#C0C0D0]/10',
    primaryBtn: 'bg-gradient-to-r from-[#C0C0D0] to-[#A0A0B8] hover:from-[#A0A0B8] hover:to-[#8888A0] text-[#111118] font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#C0C0D0]/10 text-[#C0C0D0] border border-[#C0C0D0]/15',
    previewBg: '#111118',
    previewAccent: '#C0C0D0',
    previewText: '#E4E4ED',
  },

  // ====== 10. TRADITIONAL INDIAN ======
  TRADITIONAL_INDIAN: {
    key: 'TRADITIONAL_INDIAN',
    name: 'Traditional Indian',
    description: 'Burgundy maroon with saffron turmeric gold — desi heritage',
    bg: 'bg-[#1A0A0A]',
    text: 'text-[#FFF5E6]',
    muted: 'text-[#B8866E]',
    headerBg: 'bg-[#1A0A0A]/95',
    cardBg: 'bg-[#241010] border-[#E8973F]/15',
    inputBg: 'bg-[#241010] border-[#3B1C1C] focus:border-[#E8973F]',
    catActive: 'bg-[#E8973F] text-[#1A0A0A] border-[#E8973F]',
    catInactive: 'bg-[#241010] text-[#B8866E] border-[#3B1C1C]',
    accentText: 'text-[#F0AD4E]',
    accentHex: '#E8973F',
    divider: 'border-[#3B1C1C]',
    navBg: 'bg-[#241010]/90 border-[#E8973F]/15',
    primaryBtn: 'bg-gradient-to-r from-[#E8973F] to-[#D4822A] hover:from-[#D4822A] hover:to-[#B86E1F] text-[#1A0A0A] font-bold',
    cardRadius: 'rounded-2xl',
    priceBadge: 'bg-[#E8973F]/10 text-[#F0AD4E] border border-[#E8973F]/20',
    previewBg: '#1A0A0A',
    previewAccent: '#E8973F',
    previewText: '#FFF5E6',
  },

  // ====== 11. CLASSIC SIMPLE ======
  CLASSIC_SIMPLE: {
    key: 'CLASSIC_SIMPLE',
    name: 'Classic Simple',
    description: 'Off-white with muted charcoal — timeless and understated',
    bg: 'bg-[#F5F5F0]',
    text: 'text-[#2D2D2D]',
    muted: 'text-[#8C8C8C]',
    headerBg: 'bg-[#F5F5F0]/95',
    cardBg: 'bg-white border-[#D1D1C7] shadow-sm',
    inputBg: 'bg-white border-[#D1D1C7] focus:border-[#555]',
    catActive: 'bg-[#555555] text-white border-[#555555]',
    catInactive: 'bg-white text-[#777] border-[#D1D1C7]',
    accentText: 'text-[#555555]',
    accentHex: '#555555',
    divider: 'border-[#E0E0DB]',
    navBg: 'bg-white/90 border-[#D1D1C7]',
    primaryBtn: 'bg-[#555555] hover:bg-[#444444] text-white font-bold',
    cardRadius: 'rounded-xl',
    priceBadge: 'bg-[#555]/8 text-[#555] border border-[#D1D1C7]',
    previewBg: '#F5F5F0',
    previewAccent: '#555555',
    previewText: '#2D2D2D',
  },

  // ====== 12. MINIMALISTIC ======
  MINIMALISTIC: {
    key: 'MINIMALISTIC',
    name: 'Minimalistic',
    description: 'Near-white with thin accent lines — ultra clean & modern',
    bg: 'bg-white',
    text: 'text-[#111111]',
    muted: 'text-[#AAAAAA]',
    headerBg: 'bg-white/95',
    cardBg: 'bg-[#FAFAFA] border-[#EEEEEE]',
    inputBg: 'bg-[#FAFAFA] border-[#EEEEEE] focus:border-[#111111]',
    catActive: 'bg-[#111111] text-white border-[#111111]',
    catInactive: 'bg-[#FAFAFA] text-[#888] border-[#EEEEEE]',
    accentText: 'text-[#111111]',
    accentHex: '#111111',
    divider: 'border-[#F0F0F0]',
    navBg: 'bg-[#FAFAFA]/90 border-[#EEEEEE]',
    primaryBtn: 'bg-[#111111] hover:bg-[#222222] text-white font-medium',
    cardRadius: 'rounded-lg',
    priceBadge: 'bg-[#111]/5 text-[#111] border border-[#EEE]',
    previewBg: '#FFFFFF',
    previewAccent: '#111111',
    previewText: '#111111',
  },
};

// ---------------------------------------------------------------------------
// Legacy Theme Key Mapping (backward compatibility)
// ---------------------------------------------------------------------------

const LEGACY_THEME_MAP: Record<string, string> = {
  CAFE_THEME: 'RUSTIC_CAFE',
  MODERN_THEME: 'MINIMAL_WHITE',
};

// ---------------------------------------------------------------------------
// Helper: Get Theme by Key (with fallback)
// ---------------------------------------------------------------------------

/**
 * Returns the theme definition for the given key.
 * Handles legacy key mapping and falls back to LUXURY_DARK if not found.
 */
export function getTheme(key: string | null | undefined): ThemeDefinition {
  if (!key) return THEMES.LUXURY_DARK;
  // Check direct match
  if (THEMES[key]) return THEMES[key];
  // Check legacy mapping
  const mapped = LEGACY_THEME_MAP[key];
  if (mapped && THEMES[mapped]) return THEMES[mapped];
  // Fallback
  return THEMES.LUXURY_DARK;
}

// ---------------------------------------------------------------------------
// Theme List for Dashboard Selector
// ---------------------------------------------------------------------------

/**
 * Ordered list of all themes for the dashboard selector UI.
 */
export const THEME_LIST = Object.values(THEMES);

// ---------------------------------------------------------------------------
// Google Font Options (10 restaurant-friendly fonts)
// ---------------------------------------------------------------------------

export interface FontOption {
  /** Font family name (as in Google Fonts) */
  family: string;
  /** Category for grouping */
  category: 'serif' | 'sans-serif';
  /** Short description */
  description: string;
  /** Google Fonts URL parameter value */
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
