:root {
  font-family: Inter, 'Segoe UI', sans-serif;
  color: #edf2ff;
  background: #060b17;
  line-height: 1.5;
  font-weight: 400;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(44, 104, 255, 0.22), transparent 35%),
    linear-gradient(180deg, #040914 0%, #090d1a 100%);
  color: #edf2ff;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

#root {
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 5vw;
  background: rgba(8, 13, 24, 0.7);
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  backdrop-filter: blur(12px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  font-size: 1.1rem;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.8rem;
  background: linear-gradient(135deg, #1b4de2 0%, #22c7d6 100%);
  color: white;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav a {
  color: #c7d2fe;
  font-size: 0.96rem;
  opacity: 0.8;
}

.nav a.active {
  opacity: 1;
  color: white;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.primary-button,
.secondary-button,
.ghost-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  border: none;
  padding: 0.85rem 1.2rem;
  font-weight: 700;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.primary-button {
  background: linear-gradient(135deg, #2563eb 0%, #22c7d6 100%);
  color: white;
  box-shadow: 0 18px 35px rgba(37, 99, 235, 0.35);
}

.secondary-button {
  background: rgba(148, 163, 184, 0.12);
  color: white;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.ghost-button {
  background: transparent;
  color: white;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.primary-button:hover,
.secondary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
}

.primary-button.large,
.secondary-button.large {
  padding: 1rem 1.5rem;
}

.primary-button.small,
.secondary-button.small,
.ghost-button.small {
  padding: 0.6rem 0.9rem;
  font-size: 0.8rem;
}

.primary-button.full,
.secondary-button.full {
  width: 100%;
}

.user-pill {
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.3);
  color: #dbeafe;
}

.main-content {
  padding: 2rem 5vw 4rem;
}

.hero-section {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 2rem;
  min-height: 72vh;
  padding-top: 2rem;
}

.eyebrow {
  display: inline-block;
  color: #7dd3fc;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  font-weight: 700;
}

.hero-copy h1 {
  font-size: clamp(2.9rem, 4vw, 5rem);
  line-height: 1.02;
  margin: 0.6rem 0 1rem;
  letter-spacing: -0.05em;
}

.hero-copy p {
  max-width: 640px;
  color: #cbd5e1;
  font-size: 1.08rem;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hero-stats {
  list-style: none;
  display: flex;
  gap: 2.2rem;
  padding: 0;
  margin: 0;
  color: #dbeafe;
}

.hero-stats li {
  display: grid;
  gap: 0.2rem;
}

.hero-stats strong {
  font-size: 1.7rem;
}

.hero-stats span {
  color: #94a3b8;
  font-size: 0.82rem;
}

.hero-card,
.market-card,
.feature-box,
.stat-card,
.dashboard-panel,
.admin-card,
.auth-card,
.match-header-box,
.bet-panel {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 14px 50px rgba(4, 8, 18, 0.3);
}

.hero-card {
  border-radius: 1.6rem;
  padding: 1.4rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
  font-weight: 700;
}

.live-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
}

.match-list {
  display: grid;
  gap: 0.9rem;
}

.match-card,
.market-card {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.match-card.compact {
  display: grid;
  gap: 0.75rem;
}

.match-title-row,
.market-topline,
.card-footer,
.market-odds,
.dashboard-grid,
.admin-settle-actions,
.odds-row-inline {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.market-topline,
.card-footer {
  align-items: center;
}

.league-tag,
.status-tag {
  display: inline-flex;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.03em;
}

.league-tag {
  background: rgba(59, 130, 246, 0.18);
  color: #bfdbfe;
}

.status-tag {
  background: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
}

.odds-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
}

.odds-row span,
.market-odds div {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 0.8rem;
  padding: 0.7rem 0.8rem;
  font-size: 0.8rem;
}

.market-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  margin: 1rem 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
  margin-top: 2rem;
}

.feature-box {
  border-radius: 1.3rem;
  padding: 1.5rem;
}

.icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-box h3 {
  margin: 0 0 0.55rem;
}

.feature-box p {
  margin: 0;
  color: #cbd5e1;
}

.promo-panel {
  margin-top: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(96, 165, 250, 0.3);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(34, 199, 214, 0.08));
  padding: 1.7rem 2rem;
}

.promo-panel h2 {
  margin: 0.5rem 0 0;
}

.page-shell-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.auth-layout {
  display: grid;
  place-items: center;
  min-height: 70vh;
}

.auth-card {
  width: min(100%, 480px);
  border-radius: 1.5rem;
  padding: 2rem;
}

.auth-header h2 {
  margin: 0.5rem 0 1.5rem;
}

.auth-card input,
.admin-form input,
.stake-box input {
  width: 100%;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.9rem;
  color: white;
  padding: 0.9rem 1rem;
  margin-bottom: 1rem;
}

.form-error {
  color: #fca5a5;
  margin: 0 0 1rem;
}

.form-success {
  color: #bbf7d0;
  margin: 0 0 1rem;
}

.form-success.compact {
  margin-top: 1rem;
}

.auth-switch {
  margin-top: 1rem;
  color: #cbd5e1;
  text-align: center;
}

.auth-switch a {
  color: #7dd3fc;
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.market-odds {
  margin-top: 1rem;
}

.market-odds div {
  display: grid;
  gap: 0.3rem;
  font-size: 0.85rem;
}

.market-odds label {
  color: #94a3b8;
}

.card-footer {
  margin-top: 1.2rem;
  color: #94a3b8;
  font-size: 0.8rem;
}

.loading-block {
  margin-top: 2rem;
  padding: 2.2rem;
  text-align: center;
  color: #cbd5e1;
  border-radius: 1.2rem;
  background: rgba(15, 23, 42, 0.66);
}

.match-layout {
  display: grid;
  gap: 1.4rem;
}

.match-header-box,
.bet-panel {
  border-radius: 1.4rem;
  padding: 1.5rem;
}

.match-header-box h2 {
  margin: 0.5rem 0;
}

.bet-panel {
  max-width: 700px;
}

.odds-boxes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.odds-select {
  background: rgba(15, 23, 42, 0.8);
  color: white;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  text-align: left;
  display: grid;
  gap: 0.3rem;
}

.odds-select.active {
  border-color: #60a5fa;
  background: rgba(59, 130, 246, 0.12);
}

.stake-box {
  margin-top: 1.4rem;
}

.bet-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.4rem 0;
  padding: 1rem 1.2rem;
  border-radius: 0.9rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  border-radius: 1.2rem;
  padding: 1.3rem;
}

.stat-card.highlight {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.22), rgba(34, 199, 214, 0.18));
}

.stat-card span {
  color: #94a3b8;
}

.stat-card strong {
  display: block;
  margin-top: 0.6rem;
  font-size: 2rem;
}

.dashboard-panel {
  border-radius: 1.4rem;
  margin-top: 1.6rem;
  padding: 1.5rem;
}

.bet-list {
  display: grid;
  gap: 0.8rem;
}

.bet-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.1rem;
  border-radius: 0.9rem;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.bet-item p {
  margin: 0.3rem 0 0;
  color: #94a3b8;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.45rem 0.7rem;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.status-badge.open {
  background: rgba(250, 204, 21, 0.12);
  color: #fde68a;
}

.status-badge.won {
  background: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
}

.status-badge.lost {
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
}

.admin-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
}

.admin-card {
  border-radius: 1.4rem;
  padding: 1.5rem;
}

.admin-form {
  display: grid;
  gap: 0.6rem;
}

.odds-row-inline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.admin-match-list {
  display: grid;
  gap: 0.9rem;
}

.admin-match-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 0.9rem;
  padding: 1rem;
}

.admin-match-item small {
  display: block;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.empty-state {
  color: #cbd5e1;
}

@media (max-width: 900px) {
  .hero-section,
  .feature-grid,
  .market-grid,
  .admin-layout,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .promo-panel {
    flex-direction: column;
    align-items: flex-start;
  }
}
