import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAPI, setAuthSession, clearAuthSession } from './api';

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zipbet_user') || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('zipbet_user') || 'null'));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('zipbet-auth-change', syncUser);
    return () => window.removeEventListener('zipbet-auth-change', syncUser);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-wrap">
            <Link to="/" className="brand">
              <span className="brand-mark">Z</span>
              ZIPBET
            </Link>
          </div>

          <nav className="nav">
            <NavLink to="/sports">Sports</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>

          <div className="topbar-actions">
            {user ? (
              <>
                <span className="user-pill">{user.name}</span>
                <button className="ghost-button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="ghost-button">Login</Link>
                <Link to="/signup" className="primary-button">Create account</Link>
              </>
            )}
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function LandingPage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchAPI('/live-odds')
      .then(setFeatured)
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">BET SMARTER</span>
          <h1>Elevate the way you watch the game.</h1>
          <p>
            ZIPBET brings sports fans a rich, responsive sportsbook experience with live odds, smart bet slips,
            and a premium dashboard built for action.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="primary-button large">Join ZIPBET</Link>
            <Link to="/sports" className="secondary-button large">Explore markets</Link>
          </div>
          <ul className="hero-stats">
            <li>
              <strong>24/7</strong>
              <span>Live coverage</span>
            </li>
            <li>
              <strong>100+</strong>
              <span>Markets</span>
            </li>
            <li>
              <strong>2.1s</strong>
              <span>Avg. response</span>
            </li>
          </ul>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span className="live-dot" />
            Live Odds
          </div>
          <div className="match-list">
            {featured.slice(0, 3).map((match) => (
              <div className="match-card compact" key={match.id}>
                <div className="match-title-row">
                  <span>{match.homeTeam}</span>
                  <span>vs</span>
                  <span>{match.awayTeam}</span>
                </div>
                <div className="odds-row">
                  <span>1 {match.homeOdds}</span>
                  <span>X {match.drawOdds}</span>
                  <span>2 {match.awayOdds}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-box">
          <div className="icon">⚽</div>
          <h3>Smart markets</h3>
          <p>Follow football, basketball, and more with dynamic, up-to-the-minute pricing.</p>
        </div>
        <div className="feature-box">
          <div className="icon">💳</div>
          <h3>Simulated wallet</h3>
          <p>Track balances, place bets, and settle outcomes in a protected demo environment.</p>
        </div>
        <div className="feature-box">
          <div className="icon">📊</div>
          <h3>Quick insights</h3>
          <p>See recent bets, performance, and market activity from one elegant control panel.</p>
        </div>
      </section>

      <section className="promo-panel">
        <div>
          <span className="eyebrow">READY TO PLAY</span>
          <h2>Built for modern sportsbooks.</h2>
        </div>
        <Link to="/signup" className="primary-button large">Create account</Link>
      </section>
    </>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const data = await fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setAuthSession(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <span className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Create account'}</span>
          <h2>{mode === 'login' ? 'Log in to ZIPBET' : 'Join ZIPBET'}</h2>
        </div>

        {mode === 'signup' && (
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button full" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </button>

        <p className="auth-switch">
          {mode === 'login' ? 'Need an account?' : 'Already registered?'}{' '}
          <Link to={mode === 'login' ? '/signup' : '/login'}>{mode === 'login' ? 'Sign up' : 'Login'}</Link>
        </p>
      </form>
    </div>
  );
}

function SportsPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI('/live-odds')
      .then((data) => setMatches(data))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell-inner">
      <div className="section-header">
        <div>
          <span className="eyebrow">LIVE MARKETS</span>
          <h2>Featured matches</h2>
        </div>
      </div>

      {loading ? (
        <div className="loading-block">Loading odds...</div>
      ) : (
        <div className="market-grid">
          {matches.map((match) => (
            <div className="market-card" key={match.id}>
              <div className="market-topline">
                <span className="league-tag">{match.league}</span>
                <span className="status-tag">{match.status}</span>
              </div>
              <div className="market-teams">
                <strong>{match.homeTeam}</strong>
                <span>vs</span>
                <strong>{match.awayTeam}</strong>
              </div>
              <div className="market-odds">
                <div>
                  <label>1</label>
                  <strong>{match.homeOdds}</strong>
                </div>
                <div>
                  <label>X</label>
                  <strong>{match.drawOdds}</strong>
                </div>
                <div>
                  <label>2</label>
                  <strong>{match.awayOdds}</strong>
                </div>
              </div>
              <div className="card-footer">
                <span>{new Date(match.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <Link to={`/matches/${match.id}`} className="secondary-button small">Open bet slip</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [selection, setSelection] = useState('home');
  const [stake, setStake] = useState(25);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('zipbet_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchAPI(`/fixtures/${id}`)
      .then((data) => setMatch(data))
      .catch((err) => setError(err.message || 'Could not load match'));
  }, [id, navigate]);

  const placeBet = async () => {
    try {
      setError('');
      setSuccess('');
      const data = await fetchAPI('/bets', {
        method: 'POST',
        body: JSON.stringify({ matchId: Number(id), selection, stake: Number(stake) }),
      });
      setSuccess(`Bet placed successfully. Wallet updated to ${data.wallet.balance}.`);
    } catch (err) {
      setError(err.message || 'Unable to place bet.');
    }
  };

  if (!match) return <div className="loading-block">Loading match...</div>;

  const oddsMap = {
    home: match.homeOdds,
    draw: match.drawOdds,
    away: match.awayOdds,
  };

  return (
    <div className="page-shell-inner match-layout">
      <div className="match-header-box">
        <span className="eyebrow">{match.league}</span>
        <h2>{match.homeTeam} vs {match.awayTeam}</h2>
        <p>{new Date(match.kickoffAt).toLocaleString()}</p>
      </div>

      <div className="bet-panel">
        <div className="odds-boxes">
          <button className={selection === 'home' ? 'odds-select active' : 'odds-select'} onClick={() => setSelection('home')}>
            <span>Home win</span>
            <strong>{match.homeOdds}</strong>
          </button>
          <button className={selection === 'draw' ? 'odds-select active' : 'odds-select'} onClick={() => setSelection('draw')}>
            <span>Draw</span>
            <strong>{match.drawOdds}</strong>
          </button>
          <button className={selection === 'away' ? 'odds-select active' : 'odds-select'} onClick={() => setSelection('away')}>
            <span>Away win</span>
            <strong>{match.awayOdds}</strong>
          </button>
        </div>

        <div className="stake-box">
          <label htmlFor="stake">Stake</label>
          <input id="stake" type="number" min="5" step="5" value={stake} onChange={(event) => setStake(Number(event.target.value))} />
        </div>

        <div className="bet-summary">
          <span>Potential payout</span>
          <strong>{Math.round(Number(stake) * Number(oddsMap[selection]))}</strong>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button className="primary-button full" onClick={placeBet}>Place bet</button>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bets, setBets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('zipbet_token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      fetchAPI('/auth/profile'),
      fetchAPI('/bets'),
    ])
      .then(([profileData, betsData]) => {
        setProfile(profileData);
        setBets(betsData);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (!profile) return <div className="loading-block">Loading your dashboard...</div>;

  return (
    <div className="page-shell-inner">
      <div className="dashboard-grid">
        <div className="stat-card highlight">
          <span>Balance</span>
          <strong>${profile.wallet.balance}</strong>
        </div>
        <div className="stat-card">
          <span>Open bets</span>
          <strong>{bets.filter((bet) => bet.status === 'open').length}</strong>
        </div>
        <div className="stat-card">
          <span>Winnings</span>
          <strong>{bets.filter((bet) => bet.status === 'won').length}</strong>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Recent bets</h3>
        {bets.length === 0 ? (
          <p className="empty-state">No bets placed yet.</p>
        ) : (
          <div className="bet-list">
            {bets.map((bet) => (
              <div className="bet-item" key={bet.id}>
                <div>
                  <strong>{bet.selection.toUpperCase()}</strong>
                  <p>Stake ${bet.stake} • Odds {bet.odds}</p>
                </div>
                <span className={`status-badge ${bet.status}`}>{bet.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({
    homeTeam: '',
    awayTeam: '',
    league: '',
    kickoffAt: '',
    homeOdds: 1.9,
    drawOdds: 3.2,
    awayOdds: 3.7,
  });
  const [status, setStatus] = useState('');

  const loadMatches = () => {
    fetchAPI('/fixtures')
      .then(setMatches)
      .catch(() => navigate('/login'));
  };

  useEffect(() => {
    const token = localStorage.getItem('zipbet_token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadMatches();
  }, [navigate]);

  const createFixture = async (event) => {
    event.preventDefault();
    try {
      const result = await fetchAPI('/admin/fixtures', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setStatus(`Fixture created: ${result.match.homeTeam} vs ${result.match.awayTeam}`);
      setForm({
        homeTeam: '',
        awayTeam: '',
        league: '',
        kickoffAt: '',
        homeOdds: 1.9,
        drawOdds: 3.2,
        awayOdds: 3.7,
      });
      loadMatches();
    } catch (err) {
      setStatus(err.message || 'Could not create fixture.');
    }
  };

  const settleMatch = async (matchId, winner) => {
    try {
      const result = await fetchAPI('/admin/settle', {
        method: 'POST',
        body: JSON.stringify({ matchId, winner }),
      });
      setStatus(`Settled ${result.match.homeTeam} vs ${result.match.awayTeam} with ${winner}.`);
      loadMatches();
    } catch (err) {
      setStatus(err.message || 'Settlement failed.');
    }
  };

  return (
    <div className="page-shell-inner admin-layout">
      <div className="admin-card">
        <h3>Create fixture</h3>
        <form className="admin-form" onSubmit={createFixture}>
          <input value={form.homeTeam} onChange={(event) => setForm({ ...form, homeTeam: event.target.value })} placeholder="Home team" />
          <input value={form.awayTeam} onChange={(event) => setForm({ ...form, awayTeam: event.target.value })} placeholder="Away team" />
          <input value={form.league} onChange={(event) => setForm({ ...form, league: event.target.value })} placeholder="League" />
          <input type="datetime-local" value={form.kickoffAt} onChange={(event) => setForm({ ...form, kickoffAt: event.target.value })} />
          <div className="odds-row-inline">
            <input type="number" step="0.01" value={form.homeOdds} onChange={(event) => setForm({ ...form, homeOdds: Number(event.target.value) })} placeholder="Home odds" />
            <input type="number" step="0.01" value={form.drawOdds} onChange={(event) => setForm({ ...form, drawOdds: Number(event.target.value) })} placeholder="Draw odds" />
            <input type="number" step="0.01" value={form.awayOdds} onChange={(event) => setForm({ ...form, awayOdds: Number(event.target.value) })} placeholder="Away odds" />
          </div>
          <button className="primary-button full" type="submit">Add fixture</button>
        </form>
        {status && <p className="form-success compact">{status}</p>}
      </div>

      <div className="admin-card">
        <h3>Fixture settlement</h3>
        <div className="admin-match-list">
          {matches.map((match) => (
            <div className="admin-match-item" key={match.id}>
              <div>
                <strong>{match.homeTeam} vs {match.awayTeam}</strong>
                <small>{match.league}</small>
              </div>
              <div className="admin-settle-actions">
                <button className="secondary-button small" onClick={() => settleMatch(match.id, 'home')}>Home</button>
                <button className="secondary-button small" onClick={() => settleMatch(match.id, 'draw')}>Draw</button>
                <button className="secondary-button small" onClick={() => settleMatch(match.id, 'away')}>Away</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
