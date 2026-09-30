import { useUiStore } from '../../store/ui.store';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Notification() {
  const { notification, setNotification } = useUiStore();
  if (!notification) return null;
  return <div role={notification.type === 'error' ? 'alert' : 'status'} className={'toast ' + notification.type}>{notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}<span className="grow">{notification.message}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setNotification(null)}><X size={17} /></button></div>;
}
