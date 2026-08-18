// Native fetch

async function test() {
  const res = await fetch('https://teerop-pos-u37l.vercel.app/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'testuser3', password: 'testpassword', role: 'Admin' })
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}
test();
