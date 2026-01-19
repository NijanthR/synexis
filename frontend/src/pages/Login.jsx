import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error || 'Login failed.');
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen app-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl component-surface border component-border rounded-2xl p-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="text-sm text-gray-400 mt-2">
            Access your Synexis workspace.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Username or email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-white placeholder-gray-400"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-white placeholder-gray-400"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-600 disabled:text-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
