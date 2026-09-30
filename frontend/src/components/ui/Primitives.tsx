import { AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' }) {
  return <button type="button" className={'btn-' + variant + ' ' + className} {...props} />;
}
export function Badge({ children, tone = '' }: { children: ReactNode; tone?: '' | 'primary' | 'success' | 'warning' | 'danger' }) {
  return <span className={'badge badge-' + tone}>{children}</span>;
}
export function Progress({ value, label = 'Progress' }: { value: number; label?: string }) {
  const percent = Math.min(100, Math.max(0, value || 0));
  return <div className={'progress-track ' + (percent === 100 ? 'success' : '')} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="progress-fill" style={{ width: percent + '%' }} /></div>;
}
export function Avatar({ name }: { name: string }) { return <span className="avatar" aria-hidden="true">{name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}</span>; }
export function Skeleton({ height = 20 }: { height?: number }) { return <div className="skeleton" style={{ height }} aria-hidden="true" />; }
export function PageLoading() { return <div className="page-loading" role="status" aria-label="Loading page"><Skeleton height={36} /><Skeleton height={120} /><Skeleton height={220} /><span className="sr-only">Loading your learning workspace…</span></div>; }
export function InlineLoader({ children = 'Loading…' }: { children?: ReactNode }) { return <span className="inline-loader" role="status"><Loader2 size={16} className="spin" />{children}</span>; }
export function EmptyState({ title, description, action, icon }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) { return <div className="empty-state"><div className="icon-box">{icon || <BookOpen size={21} />}</div><h3>{title}</h3><p>{description}</p>{action}</div>; }
export function ErrorState({ message = 'We couldn’t load this information.', retry }: { message?: string; retry?: () => void }) { return <div className="error-state" role="alert"><AlertCircle size={20} /><p className="grow">{message}</p>{retry && <Button variant="secondary" onClick={retry}>Try again</Button>}</div>; }
export function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) { return <div className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>; }
