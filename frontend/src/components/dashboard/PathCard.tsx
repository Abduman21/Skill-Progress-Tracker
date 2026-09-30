import type { LearningPath } from '../../types';
import { BookOpen, ArrowUpRight, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChapters } from '../../hooks/useChapters';
import { Badge, Progress, Skeleton } from '../ui/Primitives';
import { duration, dateLabel } from '../../lib/format';
export default function PathCard({ path }: { path: LearningPath }) {
 const chapters = useChapters(path._id);
 return <article className="card path-card"><div className="row spread"><div className="icon-box"><BookOpen size={20} /></div><Badge tone={path.progress === 100 ? 'success' : 'primary'}>{path.progress === 100 ? 'Completed' : path.skillLevel}</Badge></div><div><h3><Link to={'/path/' + path._id}>{path.name}</Link></h3><p className="muted line-clamp-2" style={{ marginTop: 7 }}>{path.description || 'Your next skill starts with one focused step.'}</p></div>{chapters.isLoading ? <Skeleton /> : chapters.data ? <div className="path-meta"><span><Check size={13} />{chapters.data.filter(c => c.isCompleted).length}/{chapters.data.length} chapters</span><span><Clock size={13} />{duration(chapters.data.reduce((sum, c) => sum + c.estimatedMinutes, 0))} estimated</span></div> : <button className="text-link" onClick={() => void chapters.refetch()}>Retry chapter details</button>}<div className="stack-sm"><div className="row spread small"><span className="muted">{path.progress === 0 ? 'Ready to start' : 'Your progress'}</span><strong>{path.progress}%</strong></div><Progress value={path.progress} label={path.name + ' progress'} /></div><div className="path-card-footer row spread"><span className="small muted">Updated {dateLabel(path.updatedAt)}</span><Link className="text-link" to={'/path/' + path._id}>{path.progress === 100 ? 'Review' : 'Continue'} <ArrowUpRight size={15} /></Link></div></article>;
}
