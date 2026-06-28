const API_BASE_URL = '/api';

async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || `HTTP ${response.status}`);
  }

  return response.json();
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
