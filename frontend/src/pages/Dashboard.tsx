import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useLearningOverview } from '../hooks/useLearningOverview';
import { useUiStore } from '../store/ui.store';
import PathCard from '../components/dashboard/PathCard';
import CreatePathForm from '../components/dashboard/CreatePathForm';
import StatsOverview from '../components/dashboard/StatsOverview';
import AiPanel from '../components/dashboard/AiPanel';
import { ContinueLearning, ProgressOverview, RecentActivity, StreakCard } from '../components/dashboard/LearningOverview';
import { Button, PageHeading, ErrorState, PageLoading } from '../components/ui/Primitives';
export default function Dashboard() {
 const { data: session } = useSession(); const overview = useLearningOverview(); const stats = useDashboardStats(); const ui = useUiStore();
 const paths = overview.paths.data || []; const active = paths.filter(p => p.progress < 100); const focus = active[0] || paths[0];
 return <><PageHeading title={'Welcome back, ' + (session?.user.name.split(' ')[0] || 'Learner')} subtitle="A little focus today. A little closer to where you want to be." action={<Button onClick={() => ui.setCreateModalOpen(true)}><Plus size={16} />New learning path</Button>} />{ui.isCreateModalOpen && <CreatePathForm />}<div className="stack">{stats.isError ? <ErrorState message="Your statistics couldn’t be loaded." retry={() => void stats.refetch()} /> : <StatsOverview stats={stats.data} isLoading={stats.isLoading} />}{overview.error ? <ErrorState message="Some learning data couldn’t be loaded." retry={overview.retry} /> : null}{overview.loading ? <PageLoading /> : <div className="dashboard-grid"><div className="stack"><ContinueLearning paths={paths} chapters={overview.chapters} /><section><div className="section-head"><div><h2>Your learning paths</h2><p className="small muted" style={{ marginTop: 3 }}>Keep your next chapter within reach.</p></div><Link className="text-link" to="/paths">View all <ArrowRight size={14} /></Link></div><div className="path-grid">{(active.length ? active : paths).slice(0, 2).map(path => <PathCard key={path._id} path={path} />)}</div></section><ProgressOverview paths={paths} /><RecentActivity chapters={overview.chapters} paths={paths} /></div><div className="stack">{stats.data && <StreakCard streak={stats.data.learningStreak} />}{focus ? <AiPanel key={focus._id} pathId={focus._id} /> : <section className="card stack-sm"><span className="icon-box"><Sparkles size={20} /></span><h2>A plan built around your curiosity</h2><p className="small muted">Choose a topic. Let AI suggest a sequence of chapters.</p><Link className="btn-secondary" to="/ai-roadmap">Build a roadmap <ArrowRight size={14} /></Link></section>}<div className="card"><p className="eyebrow">Your learning, at your pace</p><p className="small muted" style={{ marginTop: 10 }}>Progress isn’t about doing everything at once. It’s about taking the next step.</p></div></div></div>}</div></>;
}
