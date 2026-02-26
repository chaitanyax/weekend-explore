import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { setUser } from '@/features/auth/authSlice';

const AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Kiki',
];

const HOBBY_OPTIONS = ['Hiking', 'Photography', 'Music', 'Cooking', 'Travel', 'Gaming', 'Fitness', 'Art'];

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'Other',
        avatarUrl: AVATARS[0],
        hobbies: [] as string[],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleHobby = (hobby: string) => {
        setFormData(prev => ({
            ...prev,
            hobbies: prev.hobbies.includes(hobby)
                ? prev.hobbies.filter(h => h !== hobby)
                : [...prev.hobbies, hobby]
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    age: formData.age ? parseInt(formData.age) : undefined
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            localStorage.setItem('me_jwt', data.token);
            dispatch(setUser({ ...data.user, token: data.token }));
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 animate-fade-in">
            <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-grad-primary p-8 text-white text-center">
                    <h1 className="text-3xl font-black mb-2">Join the Adventure</h1>
                    <p className="text-indigo-100 italic">Create your profile and start exploring the weekend</p>
                </div>

                <form onSubmit={onSubmit} className="p-8 sm:p-12 space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Avatar Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-wider text-center">
                            Choose Your Explorer Avatar
                        </label>
                        <div className="flex flex-wrap justify-center gap-4">
                            {AVATARS.map((url) => (
                                <button
                                    key={url}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, avatarUrl: url })}
                                    className={`w-16 h-16 rounded-full border-4 transition-all overflow-hidden ${formData.avatarUrl === url ? 'border-indigo-500 scale-110 shadow-lg' : 'border-slate-100 grayscale hover:grayscale-0'
                                        }`}
                                >
                                    <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <input
                                required
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Age</label>
                            <input
                                type="number"
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="25"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Gender</label>
                            <select
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all appearance-none"
                                value={formData.gender}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Non-binary</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* Hobbies */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">
                            Your Hobbies & Interests
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {HOBBY_OPTIONS.map((hobby) => (
                                <button
                                    key={hobby}
                                    type="button"
                                    onClick={() => toggleHobby(hobby)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${formData.hobbies.includes(hobby)
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                        }`}
                                >
                                    {hobby}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 hover:shadow-indigo-500/10 transition-all transform active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Explorer Profile...' : 'Complete Registration'}
                    </button>

                    <p className="text-center text-slate-500 font-medium">
                        Already have an account? <Link to="/signin" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
