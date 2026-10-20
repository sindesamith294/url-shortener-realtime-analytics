import api from './axios';
export const createUrl    = data      => api.post('/urls', data);
export const getUrls      = ()        => api.get('/urls');
export const getAnalytics = id        => api.get(`/urls/${id}/analytics`);
export const updateUrl    = (id,data) => api.patch(`/urls/${id}`, data);
export const deleteUrl    = id        => api.delete(`/urls/${id}`);
