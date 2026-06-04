import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useGardenData } from '../context/useGardenData';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { communityUsers, communityPosts, followedUsers, toggleUserFollow } = useGardenData();
  const user = communityUsers.find(u => u.id === id);
  const [busy, setBusy] = useState(false);
  const followed = followedUsers.includes(id);
  const userPosts = communityPosts.filter(p => p.authorId === id);

  const handleFollow = async () => {
    setBusy(true);
    try {
      await toggleUserFollow(id);
    } finally {
      setBusy(false);
    }
  };

  if (!user) return <div className="page"><div className="empty">用户不存在</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>{user.name}</h1>
      </div>

      <div className="section" style={{ padding: '24px 16px', textAlign: 'center' }}>
        <div className="avatar avatar-lg avatar-round" style={{ margin: '0 auto' }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ fontSize: '18px', fontWeight: '500', marginTop: '12px' }}>{user.name}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {user.city} · {user.bio}
        </div>
        <div style={{ marginTop: '12px' }}>
          <button
            className={`btn btn-sm ${followed ? 'btn-default' : 'btn-primary'}`}
            onClick={handleFollow}
            disabled={busy}
          >
            {followed ? '已关注' : '关注'}
          </button>
        </div>
      </div>

      <div className="section">
        <div className="grid-3">
          <div>
            <div className="stat-num">{userPosts.length}</div>
            <div className="stat-label">帖子</div>
          </div>
          <div>
            <div className="stat-num">{user.followers}</div>
            <div className="stat-label">关注者</div>
          </div>
          <div>
            <div className="stat-num">{user.following}</div>
            <div className="stat-label">关注中</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">TA的帖子</span>
        </div>
        {userPosts.length === 0 && <div className="empty">暂无帖子</div>}
        {userPosts.map(post => (
          <div key={post.id} className="cell" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
            <div style={{ fontSize: '15px', fontWeight: '500' }}>{post.title}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {post.content.length > 60 ? post.content.slice(0, 60) + '...' : post.content}
            </div>
            {post.images && post.images.length > 0 && (
              <div className="flex gap-8" style={{ marginTop: '4px', overflowX: 'auto' }}>
                {post.images.slice(0, 3).map((img, i) => (
                  <img key={i} src={img} alt="" style={{
                    width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0
                  }} />
                ))}
              </div>
            )}
            <div className="flex-center gap-12" style={{ marginTop: '4px' }}>
              <span className="flex-center gap-8" style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>
                <Icon name="heart" size={12} color="var(--text-placeholder)" /> {post.likes}
              </span>
              <span className="flex-center gap-8" style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>
                <Icon name="comment" size={12} color="var(--text-placeholder)" /> {post.comments}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{post.time}</span>
            </div>
            <div className="flex gap-8" style={{ marginTop: '4px', flexWrap: 'wrap' }}>
              {post.tags.map(tag => <span key={tag} className="tag tag-gray">{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
