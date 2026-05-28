import React, { useEffect, useMemo, useState } from 'react';
import { mockProfiles } from '../data';
import { getLinkedInProfile, getThirdPartyProfileByUrl } from '../api/linkedin';

const statusStyle = s => {
  if (s === 'Hot Lead') return { color: '#e8533a', bg: '#fdf0ed' };
  if (s === 'Warm Lead') return { color: '#f39c12', bg: '#fef9e7' };
  return { color: '#86888A', bg: '#f5f5f5' };
};

const ScoreBar = ({ score }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#e8edf2', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${score}%`, background: score >= 90 ? '#27ae60' : score >= 75 ? '#0077B5' : '#86888A', borderRadius: 3, transition: 'width 0.6s ease' }} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 600, color: '#313335', minWidth: 32 }}>{score}</span>
  </div>
);

export default function Profiles() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [linkedInProfile, setLinkedInProfile] = useState(null);
  const [thirdPartyProfile, setThirdPartyProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await getLinkedInProfile();
        if (mounted) setLinkedInProfile(p);
      } catch {
        // ignore: keep mock data if API isn't configured
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const computedProfiles = useMemo(() => {
    if (!linkedInProfile && !thirdPartyProfile) return mockProfiles;

    const tp = thirdPartyProfile;
    const tpName =
      tp?.fullName ||
      tp?.name ||
      [tp?.firstName, tp?.lastName].filter(Boolean).join(' ') ||
      tp?.basicInfo?.fullName ||
      '';
    const tpHeadline = tp?.headline || tp?.title || tp?.basicInfo?.headline || '';
    const tpCompany =
      tp?.companyName ||
      tp?.company ||
      tp?.currentCompany ||
      tp?.experience?.[0]?.companyName ||
      tp?.experiences?.[0]?.companyName ||
      '—';
    const tpIndustry = tp?.industry || tp?.industryName || 'LinkedIn';

    const name =
      linkedInProfile.name ||
      [linkedInProfile.given_name, linkedInProfile.family_name].filter(Boolean).join(' ') ||
      'LinkedIn Member';

    return [
      ...(tp
        ? [
            {
              id: 'thirdparty',
              name: tpName || 'Third‑party LinkedIn Profile',
              role: tpHeadline || 'LinkedIn Profile',
              company: tpCompany || '—',
              connections: tp?.connections || tp?.connectionsCount || '—',
              score: 96,
              status: 'Hot Lead',
              industry: tpIndustry,
            },
          ]
        : []),
      {
        id: 'me',
        name,
        role: linkedInProfile.headline || 'LinkedIn Profile',
        company: linkedInProfile?.locale?.country || '—',
        connections: '—',
        score: 100,
        status: 'Hot Lead',
        industry: 'LinkedIn',
      },
      ...mockProfiles,
    ];
  }, [linkedInProfile, thirdPartyProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = window.localStorage.getItem('las.thirdpartyProfileUrl') || '';
        if (!url) return;
        const resp = await getThirdPartyProfileByUrl(url);
        if (!mounted) return;
        setThirdPartyProfile(resp?.item || null);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const statuses = ['All', 'Hot Lead', 'Warm Lead', 'Prospect'];
  const filtered = computedProfiles.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Lead Profiles</h2>
        <p style={{ color: '#86888A', margin: '6px 0 0', fontSize: 14 }}>Ranked and scored profiles ready for outreach</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name or company..."
          style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #dde3ea', fontSize: 13, color: '#313335', width: 220, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filterStatus === s ? '#0077B5' : '#dde3ea'}`, background: filterStatus === s ? '#0077B5' : '#fff', color: filterStatus === s ? '#fff' : '#313335', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#f8f9fb' }}>
                {['Profile', 'Company', 'Industry', 'Relevance Score', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#86888A', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid #e8edf2' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const sc = statusStyle(p.status);
                return (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f2f5' : 'none' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#0077B5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                          {p.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{p.name}</div>
                          <div style={{ color: '#86888A', fontSize: 12 }}>{p.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#313335', fontSize: 14 }}>{p.company}</td>
                    <td style={{ padding: '16px 20px', color: '#313335', fontSize: 13 }}>
                      <span style={{ background: '#f0f2f5', color: '#5e6470', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>{p.industry}</span>
                    </td>
                    <td style={{ padding: '16px 20px', minWidth: 160 }}>
                      <ScoreBar score={p.score} />
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button style={{ padding: '7px 14px', borderRadius: 8, background: '#0077B5', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Connect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#86888A', fontSize: 14 }}>No profiles match your filters.</div>
        )}
      </div>
    </div>
  );
}
