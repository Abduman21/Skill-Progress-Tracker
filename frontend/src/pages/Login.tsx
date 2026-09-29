import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../lib/auth-client';
import { Layout } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signIn.email({
                email,
                password,
                callbackURL: window.location.origin + "/dashboard"
            }, {
                onSuccess: async () => {
                    await queryClient.cancelQueries();
                    queryClient.clear();
                    navigate('/dashboard');
                },
                onError: (ctx) => {
                    setError(ctx.error.message || 'Login failed');
                }
            });
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-card rounded-xl border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-2 mb-8 justify-center">
                <Layout className="text-primary w-8 h-8" />
                <h1 className="text-2xl font-bold">Welcome Back</h1>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[var(--background)] border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary mb-1">Password</label>
                    <input
                        type="password"
                        required
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[var(--background)] border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-[var(--primary-foreground)] bg-primary hover:bg-primary/90 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 mt-4"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-center text-secondary text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                    Create one
                </Link>
            </p>
        </div>
    );
}
