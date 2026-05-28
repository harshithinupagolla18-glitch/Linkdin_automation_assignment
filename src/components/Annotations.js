import React from 'react';
import { mockPosts } from '../data';

const stepStyle = { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 };
const iconStyle = c => ({ width: 36, height: 36, borderRadius: 8, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 });

const pipeline = [
  { icon: '🔍', label: 'Data Extraction', desc: 'LinkedIn posts, profiles, and comments are scraped via API or scraper.', color: '#e8f4fb' },
  { icon: '🧹', label: 'Preprocessing', desc: 'HTML stripped, text normalized, stopwords removed, tokenized.', color: '#f0f9f0' },
  { icon: '🤖', label: 'NLP Classification', desc: 'Intent, sentiment, and industry classified using transformer models.', color: '#f3e9f9' },
  { icon: '🏷️', label: 'Annotation', desc: 'Each post is tagged with intent, audience type, and engagement tier.', color: '#fef9e7' },
  { icon: '📊', label: 'Scoring & Ranking', desc: 'Relevance scores (0–100) computed based on business criteria.', color: '#fdf0ed' },
  { icon: '🎯', label: 'Output & Action', desc: 'Leads exported to CRM, posts surfaced for ad targeting.', color: '#e8f8ef' },
];

const nlpLabels = [
  { category: 'Audience Intent', values: ['Purchase Intent', 'Research Phase', 'Awareness Seeker', 'Decision Maker'] },
  { category: 'Industry Category', values: ['SaaS / Product', 'Marketing / Growth', 'Enterprise Sales', 'DevOps / Cloud', 'Human Resources', 'FinTech'] },
  { category: 'Content Type', values: ['Thought Leadership', 'Case Study', 'Job Post', 'Product Launch', 'Educational', 'Event'] },
  { category: 'Sentiment', values: ['Positive', 'Neutral', 'Negative'] },
];

export default function Annotations() {
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>NLP Annotation Pipeline</h2>
        <p style={{ color: '#86888A', margin: '6px 0 0', fontSize: 14 }}>How raw LinkedIn data becomes structured, actionable intelligence</p>
      </div>

      {/* Pipeline */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '24px', marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 20 }}>Processing Pipeline</div>
        {pipeline.map((step, i) => (
          <div key={i} style={stepStyle}>
            <div style={iconStyle(step.color)}>{step.icon}</div>
            <div>
              <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14, marginBottom: 3 }}>
                {i + 1}. {step.label}
              </div>
              <div style={{ color: '#86888A', fontSize: 13, lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Label Taxonomy */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '24px', marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 20 }}>Annotation Label Taxonomy</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {nlpLabels.map(group => (
            <div key={group.category} style={{ background: '#f8f9fb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0077B5', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{group.category}</div>
              {group.values.map(v => (
                <div key={v} style={{ fontSize: 13, color: '#313335', padding: '5px 0', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0077B5', display: 'inline-block', flexShrink: 0 }} />
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sample Annotated Post */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '24px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Sample Annotated Record</div>
        <div style={{ background: '#f8f9fb', borderRadius: 8, padding: 16, marginBottom: 16, borderLeft: '3px solid #0077B5' }}>
          <p style={{ margin: 0, color: '#313335', fontSize: 14, lineHeight: 1.6, fontStyle: 'italic' }}>
            "{mockPosts[2].content}"
          </p>
          <div style={{ marginTop: 10, color: '#86888A', fontSize: 12 }}>— {mockPosts[2].author} · {mockPosts[2].role}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {[
            { key: 'Intent', val: mockPosts[2].intent, color: '#e8533a' },
            { key: 'Sentiment', val: mockPosts[2].sentiment, color: '#27ae60' },
            { key: 'Industry', val: mockPosts[2].industry, color: '#0077B5' },
            { key: 'Relevance', val: `${mockPosts[2].relevance}/100`, color: '#8e44ad' },
          ].map(item => (
            <div key={item.key} style={{ background: '#fff', border: '1px solid #e8edf2', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#86888A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{item.key}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
