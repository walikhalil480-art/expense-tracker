

async function runTests() {
  const fetch = globalThis.fetch;
  const baseUrl = 'http://localhost:4005/api/v1';

  try {
    console.log("Testing Registration...");
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    
    const regData = await regRes.json();
    console.log("Registration Response:", regRes.status, regData);
    if (!regRes.ok) throw new Error("Registration failed");

    // Extract cookie from response
    const setCookie = regRes.headers.get('set-cookie');
    console.log("Set-Cookie header:", setCookie);

    console.log("Testing /me endpoint with cookie...");
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        'Cookie': setCookie || ''
      }
    });

    const meData = await meRes.json();
    console.log("/me Response:", meRes.status, meData);
    if (!meRes.ok) throw new Error("/me failed");

    console.log("All tests passed successfully.");
  } catch (err) {
    console.error("Test Error:", err.message);
    process.exit(1);
  }
}

runTests();
