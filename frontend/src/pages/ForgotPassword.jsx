import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to reset password.');
            }
            setSuccess(data.message || 'Password updated successfully.');
            setEmail('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-[#1a1a1a] p-8 rounded-lg shadow-md border dark:border-white/5">
                <div className="flex flex-col items-center mb-10">
                    <img src="/shop-corner-final-logo.png" alt="Shop Corner" className="w-32 h-32 md:w-36 h-36 object-cover mb-4 rounded-xl shadow-md" />
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black tracking-tighter uppercase dark:text-white">SHOP<span className="text-shein-red">CORNER</span></span>
                        <span className="text-sm font-black tracking-[0.5em] text-shein-red mt-1">RWANDA</span>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-center mb-6 text-gray-500 dark:text-gray-400">Reset Password</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full border border-gray-300 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-300 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-black/20 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-shein-red text-white font-bold py-3 rounded hover:bg-gray-800 dark:hover:bg-red-600 transition shadow-lg disabled:opacity-60"
                    >
                        {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Remembered your password?{' '}
                    <Link to="/login" className="font-bold text-black dark:text-white border-b border-black dark:border-white">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

