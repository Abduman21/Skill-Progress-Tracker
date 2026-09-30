import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../lib/auth-client';
import AuthLayout from '../components/layout/AuthLayout';
import PasswordInput from '../components/ui/PasswordInput';

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

    return <AuthLayout><div className="stack"><div><h1>Welcome back</h1><p className="muted" style={{ marginTop: 8 }}>Pick up where you left off.</p></div>{error && <div role="alert" className="form-error">{error}</div>}<form onSubmit={handleSubmit} className="stack" aria-busy={loading}><div className="form-field"><label htmlFor="email">Email address</label><input className="input-field" id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div><div className="form-field"><label htmlFor="password">Password</label><PasswordInput id="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></div><button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form><p className="small muted">New here? <Link className="text-link" to="/register">Create an account</Link></p></div></AuthLayout>;
}
