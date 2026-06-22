/**
 * Sistema de Autenticação FiberNOC
 * Gerencia login, logout e validação de sessão com integração de API
 */

// Credenciais de teste (fallback local se API não responder)
const VALID_CREDENTIALS = {
  'admin': 'admin123',
  'fibernoc': 'senha456',
  'tecnico': 'tecnico789'
};

/**
 * Realiza o login do usuário via API
 * @param {string} username - Usuário
 * @param {string} password - Senha
 * @returns {Promise<boolean>} - true se válido, false caso contrário
 */
async function login(username, password) {
  try {
    // Tenta fazer login via API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      const sessionData = {
        user: data.user,
        loginTime: data.loginTime,
        token: data.token
      };
      localStorage.setItem('fibernoc_session', JSON.stringify(sessionData));
      return true;
    }
    return false;
  } catch (error) {
    console.warn("❌ API de login indisponível, usando fallback local:", error.message);
    
    // Fallback: validação local se API não responder
    if (VALID_CREDENTIALS[username] && VALID_CREDENTIALS[username] === password) {
      const sessionData = {
        user: username,
        loginTime: new Date().toISOString(),
        token: generateToken()
      };
      localStorage.setItem('fibernoc_session', JSON.stringify(sessionData));
      return true;
    }
    return false;
  }
}

/**
 * Realiza o logout do usuário
 */
function logout() {
  localStorage.removeItem('fibernoc_session');
  window.location.href = 'login.html';
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
  return localStorage.getItem('fibernoc_session') !== null;
}

/**
 * Obtém dados da sessão atual
 * @returns {object|null}
 */
function getSessionData() {
  const session = localStorage.getItem('fibernoc_session');
  return session ? JSON.parse(session) : null;
}

/**
 * Obtém o usuário logado
 * @returns {string|null}
 */
function getCurrentUser() {
  const session = getSessionData();
  return session ? session.user : null;
}

/**
 * Gera um token simples para a sessão
 * @returns {string}
 */
function generateToken() {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Protege páginas que requerem autenticação
 * Se não autenticado, redireciona para login
 */
function protectPage() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

/**
 * Redireciona usuários autenticados longe da página de login
 */
function protectLoginPage() {
  if (isAuthenticated()) {
    window.location.href = 'index.html';
  }
}
