import { create } from 'zustand';
type Theme = 'light' | 'dark';
function initialTheme(): Theme { try { const saved = localStorage.getItem('skillflow-theme'); if (saved === 'dark' || saved === 'light') return saved; } catch { /* Use system preference. */ } return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
function apply(theme: Theme) { document.documentElement.classList.toggle('dark', theme === 'dark'); document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#141721' : '#f7f8fc'); }
const theme = initialTheme();
apply(theme);
export const useTheme = create<{ theme: Theme; setTheme: (theme: Theme) => void }>(set => ({ theme, setTheme: theme => { apply(theme); set({ theme }); try { localStorage.setItem('skillflow-theme', theme); } catch { /* Theme still works for this session. */ } } }));
