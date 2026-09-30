import { useQueries } from '@tanstack/react-query';
import { useLearningPaths } from './useLearningPaths';
import { getChapters } from '../api/chapters';
export function useLearningOverview() {
 const paths = useLearningPaths();
 const queries = useQueries({ queries: (paths.data || []).map(path => ({ queryKey: ['chapters', path._id], queryFn: () => getChapters(path._id), staleTime: 60000 })) });
 const chapters = queries.flatMap(query => query.data || []);
 return { paths, chapters, loading: paths.isLoading || queries.some(q => q.isLoading), error: paths.isError || queries.some(q => q.isError), retry: () => { void paths.refetch(); queries.forEach(q => { if (q.isError) void q.refetch(); }); } };
}
