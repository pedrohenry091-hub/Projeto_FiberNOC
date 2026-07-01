const VALID_CREDENTIALS = {
  admin: 'admin123',
  fibernoc: 'senha456',
  tecnico: 'tecnico789'
};

function generateToken() {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
}

async function login(username, password) {
  const normalizedUsername = (username || '').trim();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalizedUsername, password })
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success) {
      const sessionData = { user: data.user, loginTime: data.loginTime, token: data.token };
      localStorage.setItem('fibernoc_session', JSON.stringify(sessionData));
      return true;
    }
  } catch (error) {
    console.warn('API indisponível, usando fallback local', error);
  }

  if (VALID_CREDENTIALS[normalizedUsername] && VALID_CREDENTIALS[normalizedUsername] === password) {
    const sessionData = {
      user: normalizedUsername,
      loginTime: new Date().toISOString(),
      token: generateToken()
    };
    localStorage.setItem('fibernoc_session', JSON.stringify(sessionData));
    return true;
  }

  return false;
}

function logout() {
  localStorage.removeItem('fibernoc_session');
  window.location.href = '/login.html';
}

function isAuthenticated() {
  return Boolean(localStorage.getItem('fibernoc_session'));
}

function getSessionData() {
  const session = localStorage.getItem('fibernoc_session');
  return session ? JSON.parse(session) : null;
}

function getCurrentUser() {
  const session = getSessionData();
  return session ? session.user : null;
}
