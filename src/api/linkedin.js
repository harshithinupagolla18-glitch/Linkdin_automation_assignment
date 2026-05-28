export async function getAuthStatus() {
  const res = await fetch('/api/status', { credentials: 'include' });
  if (!res.ok) throw new Error(`status_failed_${res.status}`);
  return await res.json();
}

export async function getLinkedInProfile() {
  const res = await fetch('/api/profile', { credentials: 'include' });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`profile_failed_${res.status}`);
  return await res.json();
}

export async function getThirdPartyProfileByUrl(url) {
  const res = await fetch(`/api/thirdparty/profile?url=${encodeURIComponent(url)}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`thirdparty_failed_${res.status}`);
  return await res.json();
}

export function startLinkedInAuth() {
  window.location.assign('/auth/linkedin');
}

export async function logoutLinkedIn() {
  const res = await fetch('/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`logout_failed_${res.status}`);
  return await res.json();
}

