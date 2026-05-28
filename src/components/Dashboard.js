import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { engagementData, intentDistribution, industryData } from '../data';

const StatCard = ({ label, value, sub, color }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8edf2', flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 13, color: '#86888A', marginBottom: 6, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: color || '#0077B5', fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: '#86888A', marginTop: 4 }}>{sub}</div>}
  </div>
);

export default function Dashboard() {
  // Demo-only build: keep dashboard focused on mock data.

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Analytics Overview</h2>
        <p style={{ color: '#86888A', margin: '6px 0 0', fontSize: 14 }}>Real-time LinkedIn data intelligence — last 7 days</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard label="Posts Extracted" value="1,284" sub="↑ 18% vs last week" color="#0077B5" />
        <StatCard label="Profiles Analyzed" value="342" sub="↑ 9% vs last week" color="#00A0DC" />
        <StatCard label="Hot Leads" value="76" sub="↑ 31% vs last week" color="#e8533a" />
        <StatCard label="Avg. Relevance Score" value="83%" sub="↑ 4pts vs last week" color="#27ae60" />
      </div>

      {/* Engagement Chart */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8edf2', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Weekly Engagement Trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={engagementData}>
            <defs>
              <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0077B5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0077B5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#86888A' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#86888A' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8edf2', fontSize: 13 }} />
            <Area type="monotone" dataKey="engagements" stroke="#0077B5" strokeWidth={2.5} fill="url(#engGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Intent Pie */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8edf2', flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Intent Distribution</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <PieChart width={140} height={140}>
              <Pie data={intentDistribution} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                {intentDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {intentDistribution.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#313335', flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0077B5' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Industry Bar */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', border: '1px solid #e8edf2', flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Leads by Industry</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={industryData} layout="vertical" barSize={12}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#86888A' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="industry" tick={{ fontSize: 12, fill: '#313335' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e8edf2', fontSize: 12 }} />
              <Bar dataKey="leads" fill="#0077B5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
