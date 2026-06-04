import * as mockData from '../data/mockData';

const DEFAULT_WEB_API_BASE = 'http://localhost:8080/api';
const DEFAULT_ANDROID_API_BASE = 'http://10.0.2.2:8081/api';
const isNativeApp = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
const BUILD_API_BASE = import.meta.env.VITE_API_BASE ?? (isNativeApp ? DEFAULT_ANDROID_API_BASE : DEFAULT_WEB_API_BASE);
export const AUTH_TOKEN_KEY = 'pocket-gardener-token';
export const API_BASE_STORAGE_KEY = 'pocket-gardener-api-base';
const REQUEST_TIMEOUT_MS = 12000;
const VISION_REQUEST_TIMEOUT_MS = 60000;
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

export function getDefaultApiBase() {
  return BUILD_API_BASE;
}

export function normalizeApiBase(value) {
  const rawValue = value?.trim() ?? '';
  if (!rawValue) {
    throw new Error('请输入服务器地址');
  }

  const withProtocol = /^https?:\/\//i.test(rawValue) ? rawValue : `http://${rawValue}`;
  const withoutTrailingSlash = withProtocol.replace(/\/+$/, '');

  let parsed;
  try {
    parsed = new URL(withoutTrailingSlash);
  } catch {
    throw new Error('服务器地址格式不正确');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('服务器地址只支持 http 或 https');
  }

  if (parsed.pathname === '' || parsed.pathname === '/') {
    return `${parsed.origin}/api`;
  }
  return withoutTrailingSlash;
}

export function getApiBase() {
  if (typeof localStorage === 'undefined') {
    return BUILD_API_BASE;
  }

  const savedApiBase = localStorage.getItem(API_BASE_STORAGE_KEY);
  if (!savedApiBase) {
    return BUILD_API_BASE;
  }

  try {
    return normalizeApiBase(savedApiBase);
  } catch {
    localStorage.removeItem(API_BASE_STORAGE_KEY);
    return BUILD_API_BASE;
  }
}

export function saveApiBase(value) {
  const normalized = normalizeApiBase(value);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(API_BASE_STORAGE_KEY, normalized);
  }
  return normalized;
}

export function resetApiBase() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(API_BASE_STORAGE_KEY);
  }
  return BUILD_API_BASE;
}

async function request(path, options = {}) {
  const { timeoutMs = REQUEST_TIMEOUT_MS, ...fetchOptions } = options;
  const token = currentAuthToken();
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? globalThis.setTimeout(() => controller.abort(), timeoutMs) : null;
  let response;

  try {
    response = await fetch(`${getApiBase()}${path}`, {
      ...fetchOptions,
      signal: controller?.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers ?? {}),
      },
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('连接服务器超时，请检查手机和电脑是否在同一网络，或在登录页设置正确的服务器地址', { cause: err });
    }
    throw new Error('无法连接服务器，请检查后端是否启动、服务器地址是否正确，或电脑防火墙是否允许 8080 端口', { cause: err });
  } finally {
    if (timeoutId) {
      globalThis.clearTimeout(timeoutId);
    }
  }

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
    timeoutMs: VISION_REQUEST_TIMEOUT_MS,
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
