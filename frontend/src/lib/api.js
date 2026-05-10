// Thin API client with token attachment.
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const TOKEN_KEY = 'rm_admin_token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    // Auto-logout on token failure
    if (err?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(err);
  }
);

// Resolve an asset path that may be either a full URL or a backend-relative path
export const resolveAsset = (pathOrUrl) => {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith('/api/')) return `${BACKEND_URL}${pathOrUrl}`;
  return pathOrUrl;
};

// ----- API methods -----
export const apiLogin = (password) =>
  client.post('/auth/login', { password }).then((r) => r.data);

export const apiMe = () => client.get('/auth/me').then((r) => r.data);

export const apiListProposals = () =>
  client.get('/proposals').then((r) => r.data);
export const apiGetProposal = (slug) =>
  client.get(`/proposals/${slug}`).then((r) => r.data);
export const apiCreateProposal = (body) =>
  client.post('/proposals', body).then((r) => r.data);
export const apiUpdateProposal = (id, body) =>
  client.put(`/proposals/${id}`, body).then((r) => r.data);
export const apiDeleteProposal = (id) =>
  client.delete(`/proposals/${id}`).then((r) => r.data);

export const apiPostAction = (slug, body) =>
  client.post(`/proposals/${slug}/action`, body).then((r) => r.data);
export const apiListActions = () =>
  client.get('/proposal-actions').then((r) => r.data);
export const apiMarkActionRead = (id) =>
  client.post(`/proposal-actions/${id}/read`).then((r) => r.data);
export const apiUnreadCount = () =>
  client.get('/proposal-actions/unread-count').then((r) => r.data);

export const apiUploadImage = (file, onProgress) => {
  const form = new FormData();
  form.append('file', file);
  return client
    .post('/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    })
    .then((r) => r.data);
};

export const apiPostContact = (body) =>
  client.post('/contact', body).then((r) => r.data);

// Site content (homepage CMS)
export const apiGetSiteContent = () =>
  client.get('/site-content').then((r) => r.data);
export const apiUpdateSiteContent = (body) =>
  client.put('/site-content', body).then((r) => r.data);

export default client;
