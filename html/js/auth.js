/**
 * Sistema de Autenticação FiberNOC
 * Gerencia login, logout e validação de sessão
 */

// Credenciais de teste (em produção, usar backend)
const VALID_CREDENTIALS = {
  'admin': 'admin123',
  'fibernoc': 'senha456',
  'tecnico': 'tecnico789'
};

/**
 * Realiza o login do usuário
 * @param {string} username - Usuário
 * @param {string} password - Senha
 * @returns {boolean} - true se válido, false caso contrário
 */
function login(username, password) {
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
