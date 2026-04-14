let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Robustness: Ensure it ends with /api if it doesn't already
if (!API_BASE.endsWith('/api')) {
    API_BASE = `${API_BASE}/api`.replace('//api', '/api');
}

const API_URL = API_BASE;
export default API_URL;
