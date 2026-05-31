import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createLog,
  createPlant,
  createPost,
  createTask,
  addPostComment,
  fetchGarden,
  fetchPostComments,
  generateSuggestion,
  likePost,
  mockSnapshot,
  toggleFollow,
  updateTaskStatus,
} from '../services/api';
import { GardenDataContext } from './gardenDataContextValue';
import { useAuth } from './useAuth';
import { localDateString, localDateTimeString } from '../utils/date';

export function GardenDataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(() => mockSnapshot());
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setApiOnline(false);
      return;
    }
    setLoading(true);
    try {
      const snapshot = await fetchGarden();
      setData(snapshot);
      setApiOnline(true);
    } catch {
      setData(prev => prev ?? mockSnapshot());
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }
    let active = true;
    async function load() {
      try {
        const snapshot = await fetchGarden();
        if (!active) return;
        setData(snapshot);
        setApiOnline(true);
      } catch {
        if (!active) return;
        setData(prev => prev ?? mockSnapshot());
        setApiOnline(false);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const replaceTask = (task) => {
    setData(prev => ({
      ...prev,
      careTasks: prev.careTasks.map(item => item.id === task.id ? task : item),
    }));
  };

  const value = useMemo(() => ({
    ...data,
    loading,
    apiOnline,
    refresh,
    async addPlant(payload) {
      const created = apiOnline
        ? await createPlant(payload)
        : {
            id: `p${Date.now()}`,
            nickname: payload.nickname,
            speciesId: data.species.find(item => item.name === payload.speciesName)?.id ?? data.species[0]?.id,
            createDate: localDateString(),
            purchaseDate: localDateString(),
            location: payload.location || '未设置',
            status: '健康',
            tags: payload.tags ?? [],
            image: '',
          };
      setData(prev => ({ ...prev, plants: [created, ...prev.plants] }));
      return created;
    },
    async addLog(payload) {
      const created = apiOnline
        ? await createLog(payload)
        : {
            id: `l${Date.now()}`,
            ...payload,
            time: localDateTimeString(),
            note: payload.note || '无备注',
            status: payload.status || '正常',
          };
      setData(prev => ({
        ...prev,
        careLogs: [created, ...prev.careLogs],
        checkinDays: prev.checkinDays.includes(created.time.split(' ')[0])
          ? prev.checkinDays
          : [...prev.checkinDays, created.time.split(' ')[0]],
      }));
      return created;
    },
    async addTask(payload) {
      const created = apiOnline
        ? await createTask(payload)
        : {
            id: `t${Date.now()}`,
            ...payload,
            planTime: payload.planTime.replace('T', ' '),
            status: '待处理',
            source: '手动创建',
          };
      setData(prev => ({ ...prev, careTasks: [created, ...prev.careTasks] }));
      return created;
    },
    async setTaskStatus(taskId, status) {
      const current = data.careTasks.find(task => task.id === taskId);
      const updated = apiOnline
        ? await updateTaskStatus(taskId, status)
        : { ...current, status };
      replaceTask(updated);
      return updated;
    },
    async addSuggestion(plantId) {
      const plant = data.plants.find(item => item.id === plantId);
      const suggestion = apiOnline
        ? await generateSuggestion(plantId)
        : {
            id: `a${Date.now()}`,
            plantId,
            time: localDateTimeString(),
            risk: plant?.status === '健康' ? '低' : '中',
            model: 'Mock-AI-Gardener',
            summary: `${plant?.nickname ?? '植物'}近期养护建议`,
            detail: '系统根据养护日志、任务状态和天气预警生成建议：保持当前浇水节奏，避免盆土长期积水，并持续观察叶片状态。',
          };
      setData(prev => ({ ...prev, aiSuggestions: [suggestion, ...prev.aiSuggestions] }));
      return suggestion;
    },
    async addPost(payload) {
      const created = apiOnline
        ? await createPost(payload)
        : {
            id: `c${Date.now()}`,
            ...payload,
            authorId: data.currentUser.id,
            author: data.currentUser.username,
            time: localDateString(),
            likes: 0,
            comments: 0,
            urgent: payload.type === '求助' ? '中' : null,
            images: [],
          };
      setData(prev => ({ ...prev, communityPosts: [created, ...prev.communityPosts] }));
      return created;
    },
    async likeCommunityPost(postId) {
      const current = data.communityPosts.find(post => post.id === postId);
      const updated = apiOnline
        ? await likePost(postId)
        : { ...current, likes: (current?.likes ?? 0) + 1 };
      setData(prev => ({
        ...prev,
        communityPosts: prev.communityPosts.map(post => post.id === postId ? updated : post),
      }));
      return updated;
    },
    async getPostComments(postId) {
      if (apiOnline) {
        return fetchPostComments(postId);
      }
      const post = data.communityPosts.find(item => item.id === postId);
      return { post, comments: [] };
    },
    async commentOnPost(postId, content) {
      if (apiOnline) {
        const result = await addPostComment(postId, content);
        setData(prev => ({
          ...prev,
          communityPosts: prev.communityPosts.map(post => post.id === postId ? result.post : post),
        }));
        return result;
      }
      const post = data.communityPosts.find(item => item.id === postId);
      const updated = { ...post, comments: (post?.comments ?? 0) + 1 };
      const comment = {
        id: `cm${Date.now()}`,
        postId,
        authorId: data.currentUser.id,
        author: data.currentUser.username,
        content,
        time: localDateTimeString(),
      };
      setData(prev => ({
        ...prev,
        communityPosts: prev.communityPosts.map(item => item.id === postId ? updated : item),
      }));
      return { post: updated, comments: [comment] };
    },
    async toggleUserFollow(userId) {
      const followedUsers = apiOnline
        ? await toggleFollow(userId)
        : data.followedUsers.includes(userId)
          ? data.followedUsers.filter(id => id !== userId)
          : [...data.followedUsers, userId];
      setData(prev => ({ ...prev, followedUsers }));
      return followedUsers;
    },
  }), [apiOnline, data, loading, refresh]);

  return (
    <GardenDataContext.Provider value={value}>
      {children}
    </GardenDataContext.Provider>
  );
}
