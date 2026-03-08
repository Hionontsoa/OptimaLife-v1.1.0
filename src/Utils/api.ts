/**
 * Aide à la récupération de données API avec gestion automatique du token
 */
export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem('optima_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  try {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('optima_token');
      window.location.reload();
    }
    return res;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};
