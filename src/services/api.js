import * as mockData from '../data/mockData';

const DEFAULT_WEB_API_BASE = 'http://localhost:8080/api';
const DEFAULT_ANDROID_API_BASE = 'http://10.0.2.2:8081/api';
const isNativeApp = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
const API_BASE = import.meta.env.VITE_API_BASE ?? (isNativeApp ? DEFAULT_ANDROID_API_BASE : DEFAULT_WEB_API_BASE);
export const AUTH_TOKEN_KEY = 'pocket-gardener-token';
let authToken = '';

export function setAuthToken(token) {
  authToken = token || '';
}

function clearSavedAuth() {
  authToken = '';
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('pocket-gardener-auth-expired'));
  }
}

function currentAuthToken() {
  if (authToken) {
    return authToken;
  }
  if (typeof localStorage === 'undefined') {
    return '';
  }
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

async function request(path, options = {}) {
  const token = currentAuthToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 401) {
      clearSavedAuth();
      throw new Error('登录已过期，请重新登录');
    }
    throw new Error(body.message || `请求失败：${response.status}`);
  }
  return response.json();
}

export function mockSnapshot() {
  return {
    currentUser: mockData.currentUser,
    species: mockData.species,
    plants: mockData.plants,
    careLogs: mockData.careLogs,
    careTasks: mockData.careTasks,
    aiSuggestions: mockData.aiSuggestions,
    currentWeather: mockData.currentWeather,
    weatherAlerts: mockData.weatherAlerts,
    communityUsers: mockData.communityUsers,
    followedUsers: mockData.followedUsers,
    communityPosts: mockData.communityPosts.map(post => ({ ...post, likedByCurrentUser: false })),
    achievements: mockData.achievements,
    plantGrowthData: mockData.plantGrowthData,
    checkinDays: mockData.checkinDays,
  };
}

export async function fetchGarden() {
  return request('/garden');
}

export async function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchMe() {
  return request('/auth/me');
}

export async function createPlant(payload) {
  return request('/plants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createLog(payload) {
  return request('/logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createTask(payload) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTaskStatus(taskId, status) {
  return request(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function generateSuggestion(plantId) {
  return request(`/ai/${plantId}/generate`, {
    method: 'POST',
  });
}

export async function identifyPlant(imageDataUrl) {
  return request('/vision/plant', {
    method: 'POST',
    body: JSON.stringify({ imageDataUrl }),
  });
}

export async function createPost(payload) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function likePost(postId) {
  return request(`/posts/${postId}/like`, {
    method: 'POST',
  });
}

export async function fetchPostComments(postId) {
  return request(`/posts/${postId}/comments`);
}

export async function addPostComment(postId, content) {
  return request(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function toggleFollow(userId) {
  return request(`/community-users/${userId}/follow`, {
    method: 'POST',
  });
}
