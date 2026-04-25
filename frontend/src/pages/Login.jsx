import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Activity, Zap, Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const GYM_IMAGE_URL =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85&auto=format&fit=crop';

const Login = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData]     = useState({ email: '', password: '' });
  const [showPass,  setShowPass]    = useState(false);
  const [error,     setError]       = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [mounted,   setMounted]     = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  // Entrance animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    // Simulate slight network delay for realism
    await new Promise(r => setTimeout(r, 800));
    const result = login(formData.email, formData.password);
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin:   { email: 'admin@fitcore.com',   password: 'admin123'   },
      manager: { email: 'manager@fitcore.com', password: 'manager123' },
    };
    setFormData(creds[role]);
    setError('');
  };

  return (
    <div style={styles.root}>
      {/* ── Background image with layered overlays ── */}
      <div style={styles.bgWrap}>
        <img src={GYM_IMAGE_URL} alt="gym" style={styles.bgImg} />
        {/* Deep dark gradient so text is always readable */}
        <div style={styles.bgOverlay1} />
        {/* Red brand accent glow bottom-left */}
        <div style={styles.bgGlow} />
        {/* Subtle noise grain for depth */}
        <div style={styles.bgGrain} />
      </div>

      {/* ── Main two-column layout ── */}
      <div style={styles.layout}>

        {/* LEFT: brand hero copy */}
        <div style={{
          ...styles.hero,
          transform: mounted ? 'translateX(0)' : 'translateX(-40px)',
          opacity:   mounted ? 1 : 0,
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* Logo */}
          <div style={styles.logoRow}>
            <div style={styles.logoBox}>
              <Activity size={26} color="#fff" />
            </div>
            <span style={styles.logoText}>FitCore</span>
          </div>

          <div style={styles.tagline}>MANAGEMENT SUITE</div>

          <h1 style={styles.heroHeading}>
            Elevate Your<br />
            <span style={styles.heroAccent}>Gym Empire.</span>
          </h1>

          <p style={styles.heroSub}>
            One powerful dashboard to manage members, trainers, classes,<br />
            payments, and attendance — all in real time.
          </p>

        </div>

        {/* RIGHT: glass card login form */}
        <div style={{
          ...styles.cardWrap,
          transform: mounted ? 'translateY(0)'  : 'translateY(30px)',
          opacity:   mounted ? 1 : 0,
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
        }}>
          <div style={styles.card}>
            {/* Card header */}
            <div style={styles.cardHeader}>
              <div style={styles.cardLogoSmall}>
                <Activity size={20} color="#fff" />
              </div>
              <div>
                <h2 style={styles.cardTitle}>Welcome back</h2>
                <p style={styles.cardSub}>Sign in to your admin account</p>
              </div>
            </div>

            {/* Demo credential buttons */}
            {/* <div style={styles.demoRow}>
              <span style={styles.demoLabel}>Quick fill:</span>
              <button type="button" style={styles.demoBtn} onClick={() => fillDemo('admin')}>
                Admin
              </button>
              <button type="button" style={styles.demoBtn} onClick={() => fillDemo('manager')}>
                Manager
              </button>
            </div> */}

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Email */}
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Email address</label>
                <div style={styles.inputWrap}>
                  <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@fitcore.com"
                    style={styles.input}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrap}>
                  <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{ ...styles.input, paddingRight: '3rem' }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    style={styles.eyeBtn}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Row: remember + forgot */}
              <div style={styles.rememberRow}>
                <label style={styles.checkLabel}>
                  <input type="checkbox" style={styles.checkbox} />
                  Remember me
                </label>
                <button type="button" style={styles.forgotBtn}>Forgot password?</button>
              </div>

              {/* Error */}
              {error && (
                <div style={styles.errorBox}>
                  <svg style={{ flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.submitBtn,
                  opacity: isLoading ? 0.75 : 1,
                  cursor:  isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <span style={styles.spinnerRow}>
                    <span style={styles.spinner} />
                    Signing in…
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* Footer hint */}
            <p style={styles.cardFooter}>
              Default credentials:&nbsp;
              <span style={styles.cred}>admin@fitcore.com</span> / <span style={styles.cred}>admin123</span>
            </p>
          </div>

          {/* Below-card brand strip */}
          <div style={styles.strip}>
            <Activity size={14} color="rgba(255,255,255,0.5)" />
            <span style={styles.stripText}>FitCore © 2025 · Gym Management Suite</span>
          </div>
        </div>
      </div>

      {/* Keyframe injections */}
      <style>{`
        @keyframes floatUp {
          0%  { transform: translateY(8px);  opacity: 0; }
          100%{ transform: translateY(0px);  opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0%  { background-position: -400px 0; }
          100%{ background-position:  400px 0; }
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { outline: none; border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.2); }
        .demo-btn:hover { background: rgba(239,68,68,0.25) !important; }
      `}</style>
    </div>
  );
};

const styles = {
  root: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  /* Background */
  bgWrap: { position: 'absolute', inset: 0, zIndex: 0 },
  bgImg: {
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center',
    filter: 'brightness(0.45) saturate(0.8)',
  },
  bgOverlay1: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(120deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(10,0,0,0.75) 100%)',
  },
  bgGlow: {
    position: 'absolute', bottom: '-10%', left: '-5%',
    width: '55%', height: '60%',
    background: 'radial-gradient(ellipse, rgba(239,68,68,0.18) 0%, transparent 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  bgGrain: {
    position: 'absolute', inset: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
    opacity: 0.5,
    pointerEvents: 'none',
  },

  /* Floating badges */
  floatBadge: {
    position: 'absolute',
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 100,
    padding: '8px 16px',
    zIndex: 2,
    animation: 'floatUp 0.9s cubic-bezier(0.16,1,0.3,1) both',
    transition: 'opacity 0.9s',
  },
  floatText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 },

  /* Layout */
  layout: {
    position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 60,
    width: '100%', maxWidth: 1160,
    padding: '40px 24px',
    flexWrap: 'wrap',
  },

  /* Hero (left) */
  hero: {
    flex: '1 1 400px', maxWidth: 500,
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  logoBox: {
    width: 48, height: 48,
    background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
    borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(239,68,68,0.45)',
  },
  logoText: { fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
  tagline: {
    fontSize: 11, fontWeight: 700, letterSpacing: 4,
    color: '#ef4444', textTransform: 'uppercase',
  },
  heroHeading: {
    fontSize: 'clamp(36px, 5vw, 58px)',
    fontWeight: 900, lineHeight: 1.1,
    color: '#fff', margin: 0,
    letterSpacing: '-1.5px',
  },
  heroAccent: {
    background: 'linear-gradient(90deg, #ef4444, #f97316)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: 16, lineHeight: 1.7,
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
  },
  pillRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  pill: {
    padding: '6px 14px', borderRadius: 100,
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5', fontSize: 13, fontWeight: 500,
  },

  /* Card (right) */
  cardWrap: {
    flex: '0 0 420px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  card: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 24,
    padding: '36px 32px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08)',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 },
  cardLogoSmall: {
    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
    background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(239,68,68,0.4)',
  },
  cardTitle: { fontSize: 22, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.3px' },
  cardSub:   { fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 },

  /* Demo buttons */
  demoRow: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '10px 14px',
  },
  demoLabel: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginRight: 4 },
  demoBtn: {
    padding: '4px 12px', borderRadius: 8,
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.25)',
    color: '#fca5a5', fontSize: 12, fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.2s',
  },

  /* Form */
  form:      { display: 'flex', flexDirection: 'column', gap: 18 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 7 },
  label:     { fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.3px' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: {
    position: 'absolute', left: 14, width: 16, height: 16,
    color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '13px 14px 13px 42px',
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#fff', fontSize: 15,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: 12,
    background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
    display: 'flex', padding: 4,
    transition: 'color 0.2s',
  },
  rememberRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: -4,
  },
  checkLabel: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
  },
  checkbox: { accentColor: '#ef4444', width: 15, height: 15, cursor: 'pointer' },
  forgotBtn: {
    background: 'none', border: 'none',
    color: '#ef4444', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', padding: 0,
    transition: 'color 0.2s',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px', borderRadius: 10,
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    color: '#fca5a5', fontSize: 13,
  },
  submitBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    border: 'none', borderRadius: 12,
    color: '#fff', fontSize: 16, fontWeight: 700,
    letterSpacing: '0.3px',
    boxShadow: '0 8px 32px rgba(239,68,68,0.45)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    marginTop: 4,
  },
  spinnerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  spinner: {
    width: 18, height: 18,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  cardFooter: {
    marginTop: 20, textAlign: 'center',
    fontSize: 12, color: 'rgba(255,255,255,0.35)',
  },
  cred: { color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', fontWeight: 600 },

  /* Strip */
  strip: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '10px 0',
  },
  stripText: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
};

export default Login;
