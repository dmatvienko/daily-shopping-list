const GIST_ID = 'c0430f02f7eb058dc373bc5ffe16196a';

exports.handler = async (event) => {
  const token = process.env.GIST_TOKEN;
  const url = `https://api.github.com/gists/${GIST_ID}`;
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const r = await fetch(url, {
        headers: { 'Authorization': `token ${token}`, 'Cache-Control': 'no-cache' }
      });
      const data = await r.json();
      const content = data.files?.['data.json']?.content ?? '{"shopping":[],"todo":[]}';
      return { statusCode: 200, headers: cors, body: content };
    }

    if (event.httpMethod === 'POST') {
      const r = await fetch(url, {
        method: 'PATCH',
        headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: { 'data.json': { content: event.body } } })
      });
      return { statusCode: r.ok ? 200 : 500, headers: cors, body: '{"ok":true}' };
    }
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }

  return { statusCode: 405, headers: cors, body: 'Method not allowed' };
};
