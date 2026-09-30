import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { useLearningPath } from '../hooks/useLearningPaths';
import { useChapters } from '../hooks/useChapters';
import ChapterItem from '../components/chapters/ChapterItem';
import AddChapterForm from '../components/chapters/AddChapterForm';
import AiPanel from '../components/dashboard/AiPanel';
import { Badge, Progress, EmptyState, ErrorState, PageLoading } from '../components/ui/Primitives';
import { duration } from '../lib/format';
export default function PathDetails() {
 const { id = '' } = useParams(); const [params] = useSearchParams(); const path = useLearningPath(id); const chapters = useChapters(id);
 if (path.isLoading || chapters.isLoading) return <PageLoading />;
 if (path.isError || chapters.isError) return <ErrorState message="This learning path couldn’t be loaded." retry={() => { void path.refetch(); void chapters.refetch(); }} />;
 if (!path.data) return <EmptyState title="Path not found" description="This path may have been removed." action={<Link to="/paths" className="btn-primary">Back to paths</Link>} />;
 const p = path.data; const items = chapters.data || []; const completed = items.filter(c => c.isCompleted).length; const next = items.find(c => !c.isCompleted);
 return <><Link className="text-link" style={{ marginBottom: 22 }} to="/paths"><ArrowLeft size={15} />All learning paths</Link><section className="card path-summary stack"><div className="row wrap"><Badge tone="primary">{p.skillLevel}</Badge><Badge tone={p.progress === 100 ? 'success' : ''}>{p.progress === 100 ? 'Completed' : p.progress ? 'In progress' : 'Not started'}</Badge></div><div><h1>{p.name}</h1><p className="muted" style={{ marginTop: 10 }}>{p.description || 'A focused path toward your next learning goal.'}</p></div><div className="row spread wrap"><div className="path-meta"><span><BookOpen size={15} />{completed} of {items.length} chapters complete</span><span><Clock size={15} />{duration(items.reduce((sum,c) => sum + c.estimatedMinutes,0))} estimated study</span></div><strong>{p.progress}%</strong></div><Progress value={p.progress} label="Path completion" /></section><div className="two-columns"><div><div className="section-head"><h2>Your learning roadmap</h2><span className="small muted">{items.length} chapters</span></div><div className="timeline">{items.length ? items.map((chapter,index) => <ChapterItem key={chapter._id + (params.get('chapter') || '')} chapter={chapter} index={index} current={chapter._id === next?._id} initiallyOpen={params.get('chapter') === chapter._id} />) : <div className="card"><EmptyState title="A fresh path, ready for your ideas" description="Add your first chapter below to start building your roadmap." /></div>}</div><AddChapterForm pathId={id} /></div><div className="stack"><AiPanel key={id} pathId={id} /><section className="card stack-sm"><h3>Make it stick</h3><p className="small muted">Read, take notes, then put what you’ve learned into practice. Open any chapter to find resources and a practical challenge.</p><p className="small muted">Complete a chapter to unlock its assessment.</p></section></div></div></>;
}
