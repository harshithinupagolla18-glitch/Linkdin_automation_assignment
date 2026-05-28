import React, { useEffect, useMemo, useState } from 'react';
import { mockPosts } from '../data';

const Badge = ({ label, color = '#0077B5', bg = '#e8f4fb' }) => (
  <span style={{ fontSize: 11, fontWeight: 600, color, background: bg, borderRadius: 4, padding: '3px 8px', marginRight: 4, display: 'inline-block', marginBottom: 4 }}>
    {label}
  </span>
);

const sentimentColor = s => s === 'Positive' ? { color: '#27ae60', bg: '#e8f8ef' } : s === 'Negative' ? { color: '#e74c3c', bg: '#fef0ef' } : { color: '#f39c12', bg: '#fef9e7' };
const intentColor = i => {
  const map = { 'Purchase Intent': { color: '#e8533a', bg: '#fdf0ed' }, 'Thought Leadership': { color: '#8e44ad', bg: '#f3e9f9' }, 'Brand Awareness': { color: '#0077B5', bg: '#e8f4fb' }, 'Recruitment': { color: '#27ae60', bg: '#e8f8ef' }, 'Educational': { color: '#f39c12', bg: '#fef9e7' } };
  return map[i] || { color: '#86888A', bg: '#f5f5f5' };
};

export default function Posts() {
  const [search, setSearch] = useState('');
  const [filterIntent, setFilterIntent] = useState('All');
  const [apiPostsNote, setApiPostsNote] = useState('');
  const [thirdPartyPostsNote, setThirdPartyPostsNote] = useState('');
  const [thirdPartyPosts, setThirdPartyPosts] = useState([]);

  const intents = ['All', 'Purchase Intent', 'Thought Leadership', 'Brand Awareness', 'Recruitment', 'Educational'];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/posts', { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setApiPostsNote(json?.note || '');
      } catch {
        // ignore: keep mock data
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = window.localStorage.getItem('las.thirdpartyProfileUrl') || '';
        if (!url) return;
        const res = await fetch(`/api/thirdparty/posts?url=${encodeURIComponent(url)}`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const items = Array.isArray(json?.items) ? json.items : [];
        setThirdPartyPosts(items);
        setThirdPartyPostsNote(items.length ? '' : 'Third‑party provider did not return posts for this profile.');
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const dataset = useMemo(() => {
    // Until LinkedIn feed access is approved/configured, we keep mock posts.
    // If server starts returning items, you can map them into this UI shape.
    if (thirdPartyPosts.length) {
      // Attempt a best-effort mapping for common third-party "post" shapes.
      return thirdPartyPosts.map((p, idx) => {
        const author = p?.authorName || p?.author || p?.profileName || 'LinkedIn';
        const content = p?.text || p?.content || p?.caption || p?.postText || JSON.stringify(p);
        return {
          id: p?.id || p?.urn || `${idx}`,
          author,
          role: p?.authorHeadline || p?.headline || 'Third‑party',
          avatar: author.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
          content,
          likes: Number(p?.likes || p?.likeCount || 0),
          comments: Number(p?.comments || p?.commentCount || 0),
          shares: Number(p?.shares || p?.shareCount || 0),
          time: p?.date || p?.createdAt || p?.time || '—',
          intent: 'Thought Leadership',
          industry: 'LinkedIn',
          sentiment: 'Neutral',
          relevance: 80,
          tags: [],
        };
      });
    }
    return mockPosts;
  }, [thirdPartyPosts]);

  const filtered = dataset.filter(p => {
    const matchSearch = p.content.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
    const matchIntent = filterIntent === 'All' || p.intent === filterIntent;
    return matchSearch && matchIntent;
  });

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Extracted Posts</h2>
        <p style={{ color: '#86888A', margin: '6px 0 0', fontSize: 14 }}>AI-annotated LinkedIn posts with NLP classification</p>
        {apiPostsNote && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#86888A' }}>{apiPostsNote}</div>
        )}
        {thirdPartyPostsNote && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#86888A' }}>{thirdPartyPostsNote}</div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts or authors..."
          style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #dde3ea', fontSize: 13, color: '#313335', width: 240, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {intents.map(i => (
            <button key={i} onClick={() => setFilterIntent(i)}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filterIntent === i ? '#0077B5' : '#dde3ea'}`, background: filterIntent === i ? '#0077B5' : '#fff', color: filterIntent === i ? '#fff' : '#313335', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Post Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(post => {
          const sc = sentimentColor(post.sentiment);
          const ic = intentColor(post.intent);
          return (
            <div key={post.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '20px 24px', transition: 'box-shadow 0.2s' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {/* Avatar */}
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0077B5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {post.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 15 }}>{post.author}</div>
                      <div style={{ color: '#86888A', fontSize: 12, marginTop: 2 }}>{post.role} · {post.time}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: post.relevance >= 90 ? '#27ae60' : post.relevance >= 75 ? '#f39c12' : '#86888A', background: '#f5f7fa', padding: '4px 10px', borderRadius: 6 }}>
                        {post.relevance}% match
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: '12px 0 14px', color: '#313335', fontSize: 14, lineHeight: 1.6 }}>{post.content}</p>

                  {/* Tags */}
                  <div style={{ marginBottom: 12 }}>
                    <Badge label={post.intent} color={ic.color} bg={ic.bg} />
                    <Badge label={post.sentiment} color={sc.color} bg={sc.bg} />
                    <Badge label={post.industry} color="#313335" bg="#f0f2f5" />
                    {post.tags.map(t => <Badge key={t} label={`#${t}`} color="#5e6470" bg="#f5f5f5" />)}
                  </div>

                  {/* Engagement */}
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#86888A', borderTop: '1px solid #f0f2f5', paddingTop: 12 }}>
                    <span>👍 {post.likes.toLocaleString()} likes</span>
                    <span>💬 {post.comments} comments</span>
                    <span>🔁 {post.shares} shares</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#86888A', fontSize: 14 }}>No posts match your filters.</div>
        )}
      </div>
    </div>
  );
}
