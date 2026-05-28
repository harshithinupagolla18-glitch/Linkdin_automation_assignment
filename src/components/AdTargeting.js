import React, { useState } from 'react';

const adCampaigns = [
  { id: 1, name: "SaaS Decision Makers Q3", status: "Active", reach: "48,200", ctr: "3.2%", budget: "$4,800", leads: 34, intent: "Purchase Intent", industry: "SaaS" },
  { id: 2, name: "Growth Leaders Awareness", status: "Active", reach: "31,500", ctr: "2.7%", budget: "$2,100", leads: 19, intent: "Brand Awareness", industry: "Marketing" },
  { id: 3, name: "Enterprise Sales Retarget", status: "Paused", reach: "12,000", ctr: "4.1%", budget: "$1,600", leads: 11, intent: "Thought Leadership", industry: "Enterprise" },
  { id: 4, name: "DevOps Hiring Pipeline", status: "Draft", reach: "—", ctr: "—", budget: "$900", leads: 0, intent: "Recruitment", industry: "DevOps" },
];

const statusStyle = s => {
  if (s === 'Active') return { color: '#27ae60', bg: '#e8f8ef' };
  if (s === 'Paused') return { color: '#f39c12', bg: '#fef9e7' };
  return { color: '#86888A', bg: '#f5f5f5' };
};

const Segment = ({ label, values }) => (
  <div style={{ background: '#f8f9fb', borderRadius: 8, padding: 14, marginBottom: 12 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: '#0077B5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {values.map(v => (
        <span key={v} style={{ background: '#e8f4fb', color: '#0077B5', fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 20 }}>{v}</span>
      ))}
    </div>
  </div>
);

export default function AdTargeting() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Ad Campaign Targeting</h2>
        <p style={{ color: '#86888A', margin: '6px 0 0', fontSize: 14 }}>LinkedIn audience segments built from annotated post and profile data</p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Campaign List */}
        <div style={{ flex: 2, minWidth: 300 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: '#f8f9fb', borderBottom: '1px solid #e8edf2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>Campaigns</span>
              <button style={{ padding: '6px 14px', background: '#0077B5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                + New Campaign
              </button>
            </div>
            {adCampaigns.map((c, i) => {
              const sc = statusStyle(c.status);
              return (
                <div key={c.id}
                  onClick={() => setSelected(c)}
                  style={{ padding: '16px 20px', borderBottom: i < adCampaigns.length - 1 ? '1px solid #f0f2f5' : 'none', cursor: 'pointer', background: selected?.id === c.id ? '#f0f7ff' : '#fff', transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{c.name}</div>
                    <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4 }}>{c.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#86888A' }}>
                    <span>📊 {c.reach} reach</span>
                    <span>🎯 {c.ctr} CTR</span>
                    <span>💰 {c.budget}</span>
                    <span>👤 {c.leads} leads</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audience Segments Panel */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: 20 }}>
            <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14, marginBottom: 16 }}>
              {selected ? `Audience: ${selected.name}` : 'Audience Segments'}
            </div>
            {selected ? (
              <>
                <Segment label="Intent Targeting" values={[selected.intent]} />
                <Segment label="Industry" values={[selected.industry]} />
                <Segment label="Job Level" values={['Director', 'VP', 'C-Suite', 'Founder']} />
                <Segment label="Company Size" values={['51-200', '201-500', '500-1000']} />
                <Segment label="Geography" values={['India', 'Singapore', 'UAE']} />
                <button style={{ width: '100%', padding: '10px', background: '#0077B5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
                  Export Audience →
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#86888A', fontSize: 13 }}>
                Click a campaign to view its audience segments
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
