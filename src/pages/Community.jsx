import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useGardenData } from '../context/useGardenData';

export default function Community() {
  const navigate = useNavigate();
  const { communityPosts, followedUsers, currentUser, toggleUserFollow, likeCommunityPost } = useGardenData();
  const [tab, setTab] = useState('推荐');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('hot');
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [slideClass, setSlideClass] = useState('');
  const [slideFrom, setSlideFrom] = useState('40px');
  const [likingId, setLikingId] = useState('');
  const [followingId, setFollowingId] = useState('');
  const prevTabIndex = useRef(1);

  const tabs = ['关注', '推荐', '我的'];

  const handleTabChange = (newTab) => {
    if (newTab === tab) return;
    const newIndex = tabs.indexOf(newTab);
    const oldIndex = prevTabIndex.current;
    setSlideFrom(newIndex > oldIndex ? '40px' : '-40px');
    setSlideClass(newIndex > oldIndex ? 'slide-left' : 'slide-right');
    setTimeout(() => {
      setTab(newTab);
      prevTabIndex.current = newIndex;
      setSlideClass('slide-enter');
    }, 200);
    setTimeout(() => setSlideClass(''), 550);
  };

  const handleFollow = async (event, userId) => {
    event.stopPropagation();
    if (followingId) return;
    setFollowingId(userId);
    try {
      await toggleUserFollow(userId);
    } finally {
      setFollowingId('');
    }
  };

  const handleLike = async (event, postId) => {
    event.stopPropagation();
    if (likingId) return;
    setLikingId(postId);
    try {
      await likeCommunityPost(postId);
    } finally {
      setLikingId('');
    }
  };

  const filtered = (() => {
    let posts = communityPosts;
    if (tab === '关注') {
      posts = posts.filter(p => followedUsers.includes(p.authorId));
    } else if (tab === '我的') {
      posts = posts.filter(p => p.authorId === currentUser.id);
    }
    if (filterType !== 'all') {
      posts = posts.filter(p => p.type === filterType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return [...posts].sort((a, b) => sortBy === 'hot' ? b.likes - a.likes : b.time.localeCompare(a.time));
  })();

  return (
    <div className="page" style={{ position: 'relative' }}>
      <div className="section" style={{ paddingBottom: 0 }}>
        <div style={{ padding: '12px 16px' }}>
          <div className="search-bar">
            <Icon name="search" size={16} color="var(--text-placeholder)" />
            <input
              placeholder="搜索帖子、标签..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="tabs-underline" style={{ justifyContent: 'center' }}>
          {tabs.map(t => (
            <button
              key={t}
              className={`tab-underline-item ${tab === t ? 'active' : ''}`}
              onClick={() => handleTabChange(t)}
            >
              {t}
            </button>
          ))}
          <button
            className="btn-text flex-center gap-8"
            onClick={() => setShowFilter(!showFilter)}
            style={{ fontSize: '13px', position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}
            aria-label="筛选"
          >
            <Icon name={showFilter ? 'chevron-up' : 'chevron-down'} size={12} color="var(--green)" />
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="section" style={{ padding: '10px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-placeholder)', marginBottom: '6px' }}>类型</div>
          <div className="flex gap-8" style={{ marginBottom: '10px' }}>
            {[{ key: 'all', label: '全部' }, { key: '经验', label: '经验' }, { key: '求助', label: '求助' }].map(f => (
              <button
                key={f.key}
                className={`btn btn-sm ${filterType === f.key ? 'btn-primary' : 'btn-default'}`}
                onClick={() => setFilterType(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-placeholder)', marginBottom: '6px' }}>排序</div>
          <div className="flex gap-8">
            <button className={`btn btn-sm ${sortBy === 'hot' ? 'btn-primary' : 'btn-default'}`} onClick={() => setSortBy('hot')}>按热度</button>
            <button className={`btn btn-sm ${sortBy === 'time' ? 'btn-primary' : 'btn-default'}`} onClick={() => setSortBy('time')}>按时间</button>
          </div>
        </div>
      )}

      <div className="tab-slide-container">
        <div className={`tab-slide-content ${slideClass}`} style={{ '--slide-from': slideFrom }}>
          {filtered.length === 0 && (
            <div className="section">
              <div className="empty">
                {tab === '关注' ? '关注更多用户来查看他们的帖子' : '暂无相关帖子'}
              </div>
            </div>
          )}

          {filtered.map(post => {
            const isFollowed = followedUsers.includes(post.authorId);
            const isMe = post.authorId === currentUser.id;
            return (
              <article
                key={post.id}
                className="section community-card"
                style={{ padding: '16px', cursor: 'pointer' }}
                onClick={() => navigate(`/community/post/${post.id}`)}
              >
                <div className="flex-center gap-8" style={{ marginBottom: '10px' }}>
                  <Link to={`/community/user/${post.authorId}`} onClick={event => event.stopPropagation()}>
                    <div className="avatar avatar-round" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                      {post.author.charAt(0)}
                    </div>
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/community/user/${post.authorId}`} onClick={event => event.stopPropagation()} style={{ fontSize: '14px', fontWeight: '500' }}>
                      {post.author}
                    </Link>
                  </div>
                  {!isMe && !isFollowed && (
                    <button
                      className="btn btn-sm btn-default"
                      onClick={event => handleFollow(event, post.authorId)}
                      disabled={followingId === post.authorId}
                      style={{ fontSize: '12px', padding: '0 8px', height: '24px' }}
                    >
                      + 关注
                    </button>
                  )}
                  {!isMe && isFollowed && (
                    <button
                      className="follow-state"
                      onClick={event => handleFollow(event, post.authorId)}
                      disabled={followingId === post.authorId}
                      aria-pressed="true"
                    >
                      已关注
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{post.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {post.content.length > 80 ? `${post.content.slice(0, 80)}...` : post.content}
                </div>
                {post.images?.length > 0 && (
                  <div className="flex gap-8" style={{ marginTop: '10px', overflowX: 'auto' }}>
                    {post.images.map((img, i) => (
                      <img key={i} src={img} alt="" style={{
                        width: post.images.length === 1 ? '100%' : '120px',
                        height: post.images.length === 1 ? '160px' : '90px',
                        borderRadius: '6px', objectFit: 'cover', flexShrink: 0
                      }} />
                    ))}
                  </div>
                )}
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {post.tags.map(tag => <span key={tag} className="tag tag-gray">{tag}</span>)}
                  {post.type === '求助' && <span className="tag tag-red">求助</span>}
                </div>
                <div className="flex gap-12" style={{ marginTop: '12px', paddingTop: '10px', borderTop: '0.5px solid var(--divider)' }}>
                  <button
                    className={`post-action like-action ${post.likedByCurrentUser ? 'liked' : ''} ${likingId === post.id ? 'pulsing' : ''}`}
                    onClick={event => handleLike(event, post.id)}
                    disabled={likingId === post.id}
                    aria-pressed={Boolean(post.likedByCurrentUser)}
                  >
                    <Icon name="heart" size={14} color="currentColor" /> {post.likes}
                  </button>
                  <span className="flex-center gap-8" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Icon name="comment" size={14} color="var(--text-secondary)" /> {post.comments}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{post.time}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <button
        className="fab"
        onClick={() => navigate('/community/new-post')}
        aria-label="发布"
      >
        <Icon name="plus" size={24} color="#fff" />
      </button>
    </div>
  );
}
