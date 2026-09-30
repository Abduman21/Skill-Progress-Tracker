import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ title, description, onClose, children, wide = false, busy = false }: { title: string; description?: string; onClose: () => void; children: ReactNode; wide?: boolean; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(<dialog ref={ref} aria-labelledby={id} aria-describedby={description ? id + '-description' : undefined} className="native-modal" onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} onClick={e => { if (e.target === e.currentTarget && !busy) onClose(); }}>
    <div className={'modal-panel ' + (wide ? 'wide' : '')}>
      <header className="modal-header"><div><h2 id={id}>{title}</h2>{description && <p id={id + '-description'}>{description}</p>}</div><button className="icon-button" aria-label="Close dialog" disabled={busy} onClick={onClose}><X size={20} /></button></header>
      <div className="modal-body">{children}</div>
    </div>
  </dialog>, document.body);
}
