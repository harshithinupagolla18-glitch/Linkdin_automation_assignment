import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Posts from './components/Posts';
import Profiles from './components/Profiles';
import Annotations from './components/Annotations';
import AdTargeting from './components/AdTargeting';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'posts', label: 'Posts', icon: '📝' },
  { id: 'profiles', label: 'Lead Profiles', icon: '👤' },
  { id: 'annotations', label: 'NLP Annotations', icon: '🤖' },
  { id: 'ads', label: 'Ad Targeting', icon: '🎯' },
];

const pages = { dashboard: Dashboard, posts: Posts, profiles: Profiles, annotations: Annotations, ads: AdTargeting };

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const Page = pages[active];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 64,
        background: '#fff',
        borderRight: '1px solid #e8edf2',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0077B5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="15" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="2" y="15" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
              <rect x="15" y="15" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#0077B5', lineHeight: 1.2 }}>LinkedIn</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#1a1a2e', lineHeight: 1.2 }}>AutoSystem</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#86888A', fontSize: 18, flexShrink: 0, padding: 4 }}
          >{sidebarOpen ? '←' : '→'}</button>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 10px', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                background: active === item.id ? '#e8f4fb' : 'transparent',
                color: active === item.id ? '#0077B5' : '#5e6470',
                fontWeight: active === item.id ? 600 : 400,
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: 4,
                textAlign: 'left',
                transition: 'all 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div style={{ padding: '16px', borderTop: '1px solid #e8edf2' }}>
            <div style={{ fontSize: 12, color: '#86888A', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 600, color: '#313335', marginBottom: 2 }}>Assignment Demo</div>
              <div>LinkedIn Automation System</div>
              <div style={{ marginTop: 4, color: '#0077B5' }}>v1.0.0</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8edf2', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ fontSize: 13, color: '#86888A' }}>
            <span style={{ color: '#0077B5', fontWeight: 600 }}>LinkedIn Automation</span>
            <span> / </span>
            <span>{navItems.find(n => n.id === active)?.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#5e6470', background: '#f0f2f5', padding: '5px 12px', borderRadius: 20, fontWeight: 700 }}>
              ● Assignment Demo
            </div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0077B5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '28px 32px' }}>
          <Page />
        </div>
      </div>
    </div>
  );
}
