import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useAiRecommendation } from '../../hooks/useAiRecommendation';
import { Button, InlineLoader, Badge, ErrorState } from '../ui/Primitives';
export default function AiPanel({ pathId }: { pathId: string }) {
 const advice = useAiRecommendation();
 return <section className="card stack-sm"><div className="row"><div className="icon-box"><Sparkles size={19} /></div><div><h2>Your next best step</h2><p className="small muted">A little direction from AI</p></div></div>{advice.isPending ? <InlineLoader>Reviewing your chapters…</InlineLoader> : advice.isError ? <ErrorState message="Advice is unavailable right now." retry={() => advice.mutate(pathId)} /> : advice.data ? <><Badge tone="primary">{advice.data.strategy === 'fallback' ? 'Next incomplete chapter' : 'Suggested focus'}</Badge><h3>{advice.data.nextChapterTitle}</h3><p className="small muted">{advice.data.reason}</p></> : <p className="small muted">Find a useful next chapter based on your learning path and progress.</p>}<Button variant="secondary" disabled={advice.isPending} onClick={() => advice.mutate(pathId)}>{advice.data ? 'Refresh suggestion' : 'Get a recommendation'}<ArrowUpRight size={15} /></Button></section>;
}
