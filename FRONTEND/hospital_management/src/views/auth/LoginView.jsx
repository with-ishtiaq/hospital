import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/LoginPage.css';

const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useParams();
    const normalizedRole = (role || '').toLowerCase();
    const validRole = normalizedRole === 'doctor' || normalizedRole === 'patient' ? normalizedRole : null;

    // Persist last attempted role to help redirects and 401 handling
    useEffect(() => {
        if (validRole) {
            localStorage.setItem('lastRole', validRole);
        } else if (role) {
            // Invalid role provided in URL, clear and redirect to role select
            localStorage.removeItem('lastRole');
        }
    }, [role, validRole]);

    // If invalid role in URL, redirect to role select
    useEffect(() => {
        if (role && !validRole) {
            navigate('/role-select', { replace: true });
        }
    }, [role, validRole, navigate]);

    // Log state changes
    useEffect(() => {
        console.log('LoginView - Auth state changed:', { isAuthenticated, user, loading });
    }, [isAuthenticated, user, loading]);

    // Redirect if already logged in
    useEffect(() => {
        console.log('LoginView - Check if authenticated:', { isAuthenticated, user });
        if (isAuthenticated && user) {
            const targetPath = user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
            console.log('Redirecting to:', targetPath);
            navigate(targetPath);
        }
    }, [isAuthenticated, user, navigate]);

    // If already authenticated, redirect based on role
    useEffect(() => {
        // If user is logged in under a different role, force logout to switch role
        if (isAuthenticated && validRole && user?.role && user.role !== validRole) {
            logout();
            return;
        }
        if (isAuthenticated) {
            const r = user?.role || validRole;
            if (r === 'doctor') {
                navigate('/doctor/dashboard', { replace: true });
            } else if (r === 'patient') {
                navigate('/patient/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, user, validRole, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login form submitted:', { email, password, normalizedRole, validRole, routeRole: role });
        try {
            if (!validRole) {
                navigate('/role-select', { replace: true });
                return;
            }
            console.log('Calling login function...');
            const loggedInUser = await login(email, password, validRole);
            console.log('Login successful, user:', loggedInUser);
            // Prefer redirect to original destination if provided
            const target = location.state?.redirectUrl
                || (loggedInUser.role === 'doctor' ? '/doctor/dashboard'
                    : loggedInUser.role === 'patient' ? '/patient/dashboard' : '/');
            console.log('Redirecting to:', target);
            navigate(target, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            // Error is handled by the AuthContext
        }
    };

    return (
        <div className="login-page-container">
            {/* Video Background */}
            <video 
                className="video-background"
                autoPlay 
                muted 
                loop 
                playsInline
            >
                <source src="/ScreenRecording_07-18-2025 1-33-52 am_1.mp4" type="video/mp4" />
                {/* Fallback image if video fails to load */}
            </video>

            {/* Dark Overlay for better text readability */}
            <div className="video-overlay"></div>

            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <img src="/logo-removebg-preview.png" alt="MediLink Logo" className="logo-image" />
                        <h1>MediLink</h1>
                    </div>
                    <p>Welcome! Please enter your credentials to continue</p>
                </div>

                {/* Dev-only quick test button to force a login call */}
                <div style={{ marginBottom: 12 }}>
                    <button
                        type="button"
                        style={{ padding: '8px 12px', fontSize: 12 }}
                        onClick={async () => {
                            try {
                                console.log('[DEV] Quick test login starting...');
                                const testEmail = 'emily.carter@example.com';
                                const testPass = 'password123';
                                const testRole = 'doctor';
                                const u = await login(testEmail, testPass, testRole);
                                console.log('[DEV] Quick test login success:', u);
                                const go = u?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
                                console.log('[DEV] Navigating to:', go);
                                navigate(go, { replace: true });
                            } catch (err) {
                                console.error('[DEV] Quick test login failed:', err);
                            }
                        }}
                    >
                        DEV: Quick Test Doctor Login
                    </button>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={error ? 'error' : ''}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={error ? 'error' : ''}
                            required
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                        data-testid="login-submit"
                        onClick={(e) => { 
                            console.log('Login button clicked');
                            e.preventDefault(); 
                            handleLogin(e); 
                        }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>New to MediLink? Your account will be created automatically.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
