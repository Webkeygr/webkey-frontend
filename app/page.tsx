// app/page.tsx  (αν είναι .js βγάλ' το typing)

async function getData() {
  const res = await fetch('https://cms.webkey.gr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
          posts(first: 5) {
            nodes {
              id
              title
              slug
              date
            }
          }
        }
      `,
    }),
    cache: 'no-store',
  });

  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const data = await getData();

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #0f172a 0%, #020617 70%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>Webkey Headless 🚀</h1>
      <p style={{ opacity: 0.7 }}>Frontend: Vercel • CMS: https://cms.webkey.gr</p>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1rem',
        padding: '1.5rem 2rem',
        width: 'min(600px, 90vw)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Τελευταία Posts</h2>
        {data?.posts?.nodes?.length ? (
          <ul style={{ display: 'grid', gap: '0.6rem' }}>
            {data.posts.nodes.map((post: any) => (
              <li key={post.id}>
                <strong>{post.title}</strong>
                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                  {post.slug} • {new Date(post.date).toLocaleDateString('el-GR')}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Δεν βρέθηκαν posts.</p>
        )}
      </div>

      <small style={{ opacity: 0.3 }}>Login: https://cms.webkey.gr/wp-admin</small>
    </main>
  );
}
