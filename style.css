:root {
  --brand-dark: #1f497d;
  --brand-mid: #2563eb;
  --brand-light: #0ea5e9;
  --bg: #0b1220;
  --panel: #0f172a;
  --panel-2: #111c33;
  --border: #223052;
  --text: #e7edf7;
  --text-dim: #93a3c2;
  --green: #16a34a;
  --red: #dc2626;
  --amber: #d97706;
  --radius: 14px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: "Inter", "Noto Sans TC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-tap-highlight-color: transparent;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100dvh;
}

/* ── Top bar ───────────────────────────────────────────── */
#topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  padding-top: max(10px, env(safe-area-inset-top));
  background: linear-gradient(90deg, var(--brand-dark), var(--brand-mid) 65%, var(--brand-light));
  box-shadow: 0 2px 10px rgba(0,0,0,0.25);
  flex-shrink: 0;
  z-index: 10;
}

#topbar .brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: .3px;
  flex: 1;
  min-width: 0;
}
#topbar .brand img { width: 24px; height: 24px; border-radius: 6px; }
#topbar .brand span.title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

#status-dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: var(--text-dim);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.12);
  flex-shrink: 0;
}
#status-dot.online { background: #34d399; }
#status-dot.offline { background: #f87171; }
#status-dot.connecting { background: #fbbf24; }

.icon-btn {
  background: rgba(255,255,255,0.14);
  border: none;
  color: #fff;
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 16px;
  flex-shrink: 0;
}
.icon-btn:active { background: rgba(255,255,255,0.28); }

/* ── Main content area ────────────────────────────────── */
#main {
  flex: 1;
  position: relative;
  min-height: 0;
  background: #fff;
}

#app-frame {
  border: 0;
  width: 100%;
  height: 100%;
  display: block;
  background: #fff;
}

.hidden { display: none !important; }

/* ── Overlay screens (settings / offline / loading) ─────── */
.screen {
  position: absolute;
  inset: 0;
  background: var(--bg);
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
}

.card h2 {
  margin: 0 0 4px 0;
  font-size: 18px;
}
.card p.hint {
  margin: 0 0 18px 0;
  color: var(--text-dim);
  font-size: 13px;
  line-height: 1.6;
}

label {
  display: block;
  font-size: 12.5px;
  color: var(--text-dim);
  margin: 14px 0 6px;
  font-weight: 600;
}

input[type="text"], input[type="url"] {
  width: 100%;
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 11px 12px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}
input:focus { border-color: var(--brand-light); }

.row-btns {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button.primary {
  flex: 1;
  background: linear-gradient(90deg, var(--brand-dark), var(--brand-mid));
  color: #fff;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14.5px;
  cursor: pointer;
}
button.primary:active { filter: brightness(0.92); }

button.ghost {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}

.presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.presets button {
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--text-dim);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}
.presets button:active { color: #fff; border-color: var(--brand-light); }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--text-dim);
  background: var(--panel-2);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: 999px;
  margin-top: 14px;
}

.spinner {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--brand-light);
  animation: spin 0.8s linear infinite;
  margin: 0 auto 14px;
}
@keyframes spin { to { transform: rotate(360deg); } }

#install-toast {
  position: fixed;
  left: 16px; right: 16px;
  bottom: max(16px, env(safe-area-inset-bottom));
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  z-index: 50;
  transform: translateY(120%);
  transition: transform .25s ease;
}
#install-toast.show { transform: translateY(0); }
#install-toast .txt { flex: 1; font-size: 13px; color: var(--text-dim); }
#install-toast .txt b { color: var(--text); display: block; font-size: 14px; margin-bottom: 2px; }
