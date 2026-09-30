import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../lib/auth-client';
import AuthLayout from '../components/layout/AuthLayout';
import PasswordInput from '../components/ui/PasswordInput';

export default function Register() {
    const [name, setName] = useState('');
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
            await signUp.email({
                email,
                password,
                name,
                callbackURL: window.location.origin + "/dashboard"
            }, {
                onSuccess: async () => {
                    await queryClient.cancelQueries();
                    queryClient.clear();
                    navigate('/dashboard');
                },
                onError: (ctx) => {
                    setError(ctx.error.message || 'Registration failed');
                }
            });
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return <AuthLayout><div className="stack"><div><h1>Create your account</h1><p className="muted" style={{ marginTop: 8 }}>Your next chapter starts here.</p></div>{error && <div role="alert" className="form-error">{error}</div>}<form onSubmit={handleSubmit} className="stack" aria-busy={loading}><div className="form-field"><label htmlFor="name">Full name</label><input className="input-field" id="name" autoComplete="name" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></div><div className="form-field"><label htmlFor="email">Email address</label><input className="input-field" id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div><div className="form-field"><label htmlFor="password">Password</label><PasswordInput id="password" required autoComplete="new-password" minLength={8} maxLength={128} aria-describedby="password-hint" value={password} onChange={e => setPassword(e.target.value)} /><p id="password-hint" className="small muted">Use 8–128 characters.</p></div><button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button></form><p className="small muted">Already have an account? <Link className="text-link" to="/login">Sign in</Link></p></div></AuthLayout>;
}
