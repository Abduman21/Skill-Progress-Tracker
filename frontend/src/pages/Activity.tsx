import { useLearningOverview } from '../hooks/useLearningOverview';
import { useDashboardStats } from '../hooks/useDashboardStats';
import StatsOverview from '../components/dashboard/StatsOverview';
import { ProgressOverview, RecentActivity } from '../components/dashboard/LearningOverview';
import { PageHeading, ErrorState, PageLoading } from '../components/ui/Primitives';
export default function Activity() { const data = useLearningOverview(); const stats = useDashboardStats(); return <><PageHeading title="Progress & activity" subtitle="Every completed chapter is a step forward." /><div className="stack">{stats.isError ? <ErrorState retry={() => void stats.refetch()} /> : <StatsOverview stats={stats.data} isLoading={stats.isLoading} />}{data.loading ? <PageLoading /> : data.error ? <ErrorState retry={data.retry} /> : <><ProgressOverview paths={data.paths.data || []} /><RecentActivity chapters={data.chapters} paths={data.paths.data || []} limit={30} /><p className="small muted">Activity shows up to 30 recent completions from your current chapters. Study duration is an estimate, not a time log.</p></>}</div></>; }
