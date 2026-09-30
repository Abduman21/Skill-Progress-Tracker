import { BookCheck, Route, TrendingUp, Flame, Clock } from 'lucide-react';
import type { DashboardStats } from '../../api/dashboard';
import { Skeleton } from '../ui/Primitives';
import { duration } from '../../lib/format';
export default function StatsOverview({ stats, isLoading }: { stats?: DashboardStats; isLoading: boolean }) {
 if (isLoading || !stats) return <div className="metrics" role="status" aria-label="Loading statistics">{Array.from({ length: 5 }, (_, i) => <div className="card stat-card" key={i}><Skeleton height={100} /></div>)}</div>;
 const values = [
 { label: 'Active paths', value: stats.totalPaths - stats.completedPaths, context: stats.totalPaths + ' paths in your library', Icon: Route },
 { label: 'Chapters completed', value: stats.completedChapters, context: 'of ' + stats.totalChapters + ' chapters', Icon: BookCheck },
 { label: 'Overall progress', value: stats.overallProgress + '%', context: 'Across your learning paths', Icon: TrendingUp },
 { label: 'Current streak', value: stats.learningStreak + ' days', context: 'Keep showing up', Icon: Flame },
 { label: 'Estimated study', value: duration(stats.totalEstimatedMinutes), context: 'Planned, not measured time', Icon: Clock }];
 return <div className="metrics">{values.map(({ label, value, context, Icon }) => <div className="card stat-card" key={label}><div className="row spread"><span className="stat-label">{label}</span><span className="icon-box"><Icon size={15} /></span></div><strong>{value}</strong><span className="small muted" style={{ fontSize: 10 }}>{context}</span></div>)}</div>;
}
