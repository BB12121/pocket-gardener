import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function loadApiModule() {
  const source = await readFile(new URL('./api.js', import.meta.url), 'utf8');
  const testableSource = source
    .replace("import * as mockData from '../data/mockData';", 'const mockData = {};')
    .replace(
      "const BUILD_API_BASE = import.meta.env.VITE_API_BASE ?? (isNativeApp ? DEFAULT_ANDROID_API_BASE : DEFAULT_WEB_API_BASE);",
      "const BUILD_API_BASE = 'http://localhost:8080/api';",
    );

  return import(`data:text/javascript,${encodeURIComponent(testableSource)}#${Date.now()}`);
}

test('authenticated requests use the token restored from localStorage', async () => {
  const storage = new Map([['pocket-gardener-token', 'from-storage']]);
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };

  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer from-storage');
    return {
      ok: true,
      json: async () => ({ id: 'p1' }),
    };
  };

  const api = await loadApiModule();
  api.setAuthToken('');

  const plant = await api.createPlant({ nickname: 'test', speciesName: '绿萝' });

  assert.equal(plant.id, 'p1');
});

test('unauthorized responses clear the saved token and notify the app', async () => {
  const storage = new Map([['pocket-gardener-token', 'expired-token']]);
  let notified = false;
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  globalThis.window = {
    dispatchEvent: (event) => {
      if (event.type === 'pocket-gardener-auth-expired') {
        notified = true;
      }
    },
  };
  globalThis.Event = class Event {
    constructor(type) {
      this.type = type;
    }
  };

  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
    json: async () => ({ message: 'Unauthorized' }),
  });

  const api = await loadApiModule();
  api.setAuthToken('');

  await assert.rejects(
    () => api.createPlant({ nickname: 'test', speciesName: '绿萝' }),
    /登录已过期/,
  );

  assert.equal(storage.has('pocket-gardener-token'), false);
  assert.equal(notified, true);
});

test('community interaction helpers call the post interaction endpoints', async () => {
  const calls = [];
  globalThis.localStorage = {
    getItem: key => (key === 'pocket-gardener-token' ? 'token' : null),
    setItem: () => {},
    removeItem: () => {},
  };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({ ok: true }),
    };
  };

  const api = await loadApiModule();

  await api.likePost('c1');
  await api.addPostComment('c1', '这条经验很有帮助');

  assert.equal(calls[0].url, 'http://localhost:8080/api/posts/c1/like');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[1].url, 'http://localhost:8080/api/posts/c1/comments');
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(calls[1].options.body, JSON.stringify({ content: '这条经验很有帮助' }));
});

test('requests use the server address saved at login', async () => {
  const storage = new Map([
    ['pocket-gardener-token', 'token'],
    ['pocket-gardener-api-base', 'http://10.29.91.238:8080/api'],
  ]);
  let requestedUrl = '';
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  globalThis.fetch = async (url) => {
    requestedUrl = url;
    return {
      ok: true,
      json: async () => ({ ok: true }),
    };
  };

  const api = await loadApiModule();

  await api.fetchGarden();

  assert.equal(requestedUrl, 'http://10.29.91.238:8080/api/garden');
});

test('server address helper normalizes a host and port to the api root', async () => {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };

  const api = await loadApiModule();
  const saved = api.saveApiBase('10.29.91.238:8080');

  assert.equal(saved, 'http://10.29.91.238:8080/api');
  assert.equal(storage.get('pocket-gardener-api-base'), 'http://10.29.91.238:8080/api');
});

test('image attachment picker accepts only images up to the attachment limit', async () => {
  const { pickImageFiles } = await import(`../utils/imageFiles.js#${Date.now()}`);
  const files = [
    { name: 'one.jpg', type: 'image/jpeg' },
    { name: 'two.png', type: 'image/png' },
    { name: 'notes.txt', type: 'text/plain' },
    { name: 'three.webp', type: 'image/webp' },
  ];

  const result = pickImageFiles(files, 1);

  assert.deepEqual(result.accepted.map(file => file.name), ['one.jpg', 'two.png']);
  assert.equal(result.hasRejectedType, true);
  assert.equal(result.hasRejectedLimit, true);
});
