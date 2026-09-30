import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useSession, signOut } from '../../lib/auth-client';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useUiStore } from '../../store/ui.store';
import { useModalFocus } from '../../hooks/useModalFocus';
import AppSidebar from './AppSidebar';
import { navigation } from './navigation';
import AppHeader from './AppHeader';
function MobileDrawer({ close, name, onLogout, loggingOut }: { close: () => void; name: string; onLogout: () => void; loggingOut: boolean }) {
  const ref = useModalFocus(close);
  useEffect(() => { const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old; }; }, []);
  return <div className="drawer-backdrop" onClick={e => { if (e.currentTarget === e.target) close(); }}><div ref={ref} role="dialog" aria-modal="true" aria-label="Navigation" tabIndex={-1}><AppSidebar mobile name={name} onLogout={onLogout} loggingOut={loggingOut} onNavigate={close} /><button className="icon-button drawer-close" style={{ zIndex: 45 }} aria-label="Close navigation" onClick={close}><X size={20} /></button></div></div>;
}
export default function AppLayout() {
  const { data: session } = useSession(); const stats = useDashboardStats(); const queryClient = useQueryClient(); const navigate = useNavigate(); const location = useLocation();
  const [menu, setMenu] = useState(false); const [loggingOut, setLoggingOut] = useState(false); const close = useCallback(() => setMenu(false), []);
  const name = session?.user.name || 'Learner';
  const title = navigation.find(n => n.to === location.pathname)?.label || (location.pathname.startsWith('/path/') ? 'Learning Path' : 'Settings & Profile');
  useEffect(() => { document.title = title + ' · SkillFlow'; }, [title]);
  async function logout() { setLoggingOut(true); try { const result = await signOut(); if (result.error) throw result.error; await queryClient.cancelQueries(); queryClient.clear(); navigate('/login'); } catch { useUiStore.getState().setNotification({ type: 'error', message: 'Unable to sign out. Please try again.' }); } finally { setLoggingOut(false); } }
  return <><a href="#main-content" className="skip-link">Skip to content</a><AppSidebar name={name} onLogout={() => void logout()} loggingOut={loggingOut} />{menu && <MobileDrawer close={close} name={name} onLogout={() => void logout()} loggingOut={loggingOut} />}<div className="app-body" inert={menu || undefined}><AppHeader title={title} name={name} streak={stats.data?.learningStreak} onMenu={() => setMenu(true)} /><main id="main-content" tabIndex={-1} className="page-container"><Outlet /></main></div></>;
}
