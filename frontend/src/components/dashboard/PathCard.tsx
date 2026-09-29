import type { LearningPath } from '../../types';
import { BookOpen, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PathCardProps {
    path: LearningPath;
}

export default function PathCard({ path }: PathCardProps) {

    return (
        <Link
            to={`/path/${path._id}`}
            className="block group bg-[var(--card)] border border-[var(--border)] p-6 rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[var(--primary)]/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${path.skillLevel === 'beginner' ? 'bg-green-500/10 text-green-500' :
                    path.skillLevel === 'intermediate' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-purple-500/10 text-purple-500'
                    }`}>
                    {path.skillLevel}
                </span>
            </div>

            <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {path.name}
            </h3>

            {path.description && (
                <p className="text-[var(--muted-foreground)] text-sm mb-6 line-clamp-2">
                    {path.description}
                </p>
            )}

            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-[var(--muted-foreground)] flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Progress
                    </span>
                    <span className="text-[var(--foreground)]">{path.progress}%</span>
                </div>

                <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--primary)] transition-all duration-1000 ease-out"
                        style={{ width: `${path.progress}%` }}
                    />
                </div>
            </div>
        </Link>
    );
}
