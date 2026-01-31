import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ViewPaste() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/pastes/${slug}`)
      .then(res => {
        if (res.status === 404) throw new Error("Paste not found.");
        if (res.status === 410) throw new Error("This paste has expired.");
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message));
  }, [slug]);

  if (error) return <div style={{ padding: '50px', color: 'red', textAlign: 'center', fontFamily: 'sans-serif' }}>{error}</div>;
  if (!data) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>View Paste</h1>
      <pre style={{ 
        background: '#f4f4f4', 
        padding: '20px', 
        borderRadius: '5px', 
        whiteSpace: 'pre-wrap', 
        border: '1px solid #ddd',
        fontSize: '14px'
      }}>
        {data.content}
      </pre>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Views: {data.viewCount} | Created: {new Date(data.createdAt).toLocaleString()}
      </div>
      <hr style={{ margin: '20px 0' }} />
      <a href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>← Create New Paste</a>
    </div>
  );
}