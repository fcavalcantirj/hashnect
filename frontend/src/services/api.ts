import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hashnect.onrender.com:3001';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async () => {
    window.location.href = `${API_URL}/api/auth/google`;
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// User services
export const userService = {
  getProfile: async (id: string) => {
    const response = await api.get(`/api/users/${id}/profile`);
    return response.data;
  },
  
  updateProfile: async (id: string, data: any) => {
    const response = await api.patch(`/api/users/${id}`, data);
    return response.data;
  },
};

// Connection services
export const connectionService = {
  getConnections: async () => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    const response = await api.get(`/api/connections/user/${user.id}`);
    return response.data;
  },
  
  createConnection: async (toUserId: string) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const response = await api.post('/api/connections', {
      fromUserId: user.id,
      toUserId,
    });
    return response.data;
  },
  
  acceptConnection: async (id: string) => {
    const response = await api.patch(`/api/connections/${id}/accept`);
    return response.data;
  },
  
  updateStrength: async (id: string, strength: number) => {
    const response = await api.patch(`/api/connections/${id}/strength`, { strength });
    return response.data;
  },
};

// Hashtag services
export const hashtagService = {
  getHashtags: async () => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    const response = await api.get(`/api/hashtags/users/${user.id}`);
    return response.data;
  },
  
  addHashtag: async (hashtagId: string, strength?: number) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const response = await api.post(`/api/hashtags/users/${user.id}`, {
      hashtagId,
      strength,
    });
    return response.data;
  },
  
  removeHashtag: async (hashtagId: string) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const response = await api.delete(`/api/hashtags/users/${user.id}/${hashtagId}`);
    return response.data;
  },
};

// Subdomain services
export const subdomainService = {
  getSubdomains: async () => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    const response = await api.get(`/api/subdomains/user/${user.id}`);
    return response.data;
  },
  
  createSubdomain: async (data: any) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const response = await api.post('/api/subdomains', {
      ...data,
      ownerId: user.id,
    });
    return response.data;
  },
  
  updateSubdomain: async (id: string, data: any) => {
    const response = await api.patch(`/api/subdomains/${id}`, data);
    return response.data;
  },
  
  deleteSubdomain: async (id: string) => {
    const response = await api.delete(`/api/subdomains/${id}`);
    return response.data;
  },
};

// Subscription services
export const subscriptionService = {
  getSubscriptions: () => api.get('/subscriptions'),
  getCurrentPlan: () => api.get('/subscriptions/current'),
  subscribe: (planId: string) => api.post('/subscriptions', { planId }),
  createCheckoutSession: (planType: string) => api.post('/subscriptions/checkout', { planType }),
  cancelSubscription: (id: string) => api.delete(`/subscriptions/${id}`)
};

// Graph data service
export const graphService = {
  getGraphData: async () => {
    const user = authService.getCurrentUser();
    if (!user) return { nodes: [], links: [] };

    // Get user's connections
    const connectionsResponse = await api.get(`/api/connections/user/${user.id}`);
    const connections = connectionsResponse.data;

    // Get user's hashtags
    const hashtagsResponse = await api.get(`/api/hashtags/users/${user.id}`);
    const hashtags = hashtagsResponse.data;

    // Get user's subdomains
    const subdomainsResponse = await api.get(`/api/subdomains/user/${user.id}`);
    const subdomains = subdomainsResponse.data;

    // Create nodes
    const nodes = [
      // Current user
      {
        id: user.id,
        name: user.fullName,
        val: 20,
        color: '#6200ea',
        verificationLevel: user.verificationLevel || 0,
        type: 'user',
      },
      // Connection users
      ...connections.map((conn: any) => ({
        id: conn.toUser.id,
        name: conn.toUser.fullName,
        val: 15,
        color: '#6200ea',
        verificationLevel: conn.toUser.verificationLevel || 0,
        type: 'user',
      })),
      // Hashtags
      ...hashtags.map((ht: any) => ({
        id: ht.hashtag.id,
        name: ht.hashtag.name,
        val: 25,
        color: '#03dac6',
        verificationLevel: 0,
        type: 'hashtag',
      })),
      // Subdomains
      ...subdomains.map((sd: any) => ({
        id: sd.id,
        name: sd.name,
        val: 22,
        color: '#bb86fc',
        verificationLevel: 0,
        type: 'subdomain',
      })),
    ];

    // Create links
    const links = [
      // User to connections
      ...connections.map((conn: any) => ({
        source: user.id,
        target: conn.toUser.id,
        strength: conn.strength || 0.5,
      })),
      // User to hashtags
      ...hashtags.map((ht: any) => ({
        source: user.id,
        target: ht.hashtag.id,
        strength: ht.strength || 0.5,
      })),
      // User to subdomains
      ...subdomains.map((sd: any) => ({
        source: user.id,
        target: sd.id,
        strength: 0.7,
      })),
    ];

    return { nodes, links };
  },
};

export default {
  authService,
  userService,
  connectionService,
  hashtagService,
  subdomainService,
  subscriptionService,
  graphService
};
