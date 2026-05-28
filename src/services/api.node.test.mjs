import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function loadApiModule() {
  const source = await readFile(new URL('./api.js', import.meta.url), 'utf8');
  const testableSource = source
    .replace("import * as mockData from '../data/mockData';", 'const mockData = {};')
    .replace(
      "const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api';",
      "const API_BASE = 'http://localhost:8080/api';",
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
