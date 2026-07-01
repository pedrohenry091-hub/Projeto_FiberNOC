const API_BASE_URL = '/api';

async function apiCall(endpoint, options = {}) {
  const session = JSON.parse(localStorage.getItem('fibernoc_session') || 'null');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  let payload = {};

  if (contentType.includes('application/json')) {
    payload = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => '');
    payload = text ? { message: text } : {};
  }

  if (!response.ok) {
    throw new Error(payload.message || payload.error || `HTTP ${response.status}`);
  }

  return payload;
}

export async function getOnus() {
  try {
    const data = await apiCall('/onus');
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Erro ao buscar ONUs', error);
    return [];
  }
}

export async function getLogs() {
  try {
    const data = await apiCall('/logs');
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Erro ao buscar logs', error);
    return [];
  }
}

export async function getAlerts(limit = 6) {
  try {
    const data = await apiCall(`/alerts?limit=${limit}`);
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Erro ao buscar alertas', error);
    return [];
  }
}

export async function getStats() {
  try {
    return await apiCall('/stats');
  } catch (error) {
    console.error('Erro ao buscar estatísticas', error);
    return null;
  }
}
