import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { useGardenData } from '../context/useGardenData';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    communityPosts,
    followedUsers,
    currentUser,
    toggleUserFollow,
    likeCommunityPost,
    getPostComments,
    commentOnPost,
  } = useGardenData();
  const post = communityPosts.find(item => item.id === id);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [following, setFollowing] = useState(false);

  const isMe = post?.authorId === currentUser.id;
  const isFollowed = followedUsers.includes(post?.authorId);
  const canSubmit = commentText.trim().length > 0 && !submitting;

  useEffect(() => {
    let active = true;
    async function loadComments() {
      if (!id || !post) return;
      setLoadingComments(true);
      try {
        const result = await getPostComments(id);
        if (active) setComments(result.comments ?? []);
      } finally {
        if (active) setLoadingComments(false);
      }
    }
    loadComments();
    return () => {
      active = false;
    };
  }, [getPostComments, id, post]);

  const sortedComments = useMemo(() => [...comments].sort((a, b) => b.time.localeCompare(a.time)), [comments]);

  const handleLike = async () => {
    if (liking || !post) return;
    setLiking(true);
    try {
      await likeCommunityPost(post.id);
    } finally {
      setLiking(false);
    }
  };

  const handleFollow = async () => {
    if (following || !post) return;
    setFollowing(true);
    try {
      await toggleUserFollow(post.authorId);
    } finally {
      setFollowing(false);
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (!canSubmit || !post) return;
    setSubmitting(true);
    try {
      const result = await commentOnPost(post.id, commentText.trim());
      setComments(result.comments ?? []);
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
          <h1>帖子详情</h1>
        </div>
        <div className="empty">帖子不存在或已被删除</div>
      </div>
    );
  }

  return (
    <div className="page post-detail-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>帖子详情</h1>
      </div>

      <article className="section" style={{ padding: '18px 16px' }}>
        <div className="flex-center gap-8" style={{ marginBottom: '14px' }}>
          <Link to={`/community/user/${post.authorId}`}>
            <div className="avatar avatar-round" style={{ width: '38px', height: '38px', fontSize: '16px' }}>
              {post.author.charAt(0)}
            </div>
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link to={`/community/user/${post.authorId}`} style={{ fontSize: '15px', fontWeight: 600 }}>
              {post.author}
            </Link>
            <div style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{post.time}</div>
          </div>
          {!isMe && (
            <button
              className={`btn btn-sm ${isFollowed ? 'btn-default' : 'btn-primary'}`}
              onClick={handleFollow}
              disabled={following}
            >
              {isFollowed ? '已关注' : '关注'}
            </button>
          )}
        </div>

        <h2 style={{ fontSize: '20px', lineHeight: 1.35, marginBottom: '10px', letterSpacing: 0 }}>{post.title}</h2>
        <div style={{ fontSize: '15px', color: 'var(--text-regular)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        {post.images?.length > 0 && (
          <div style={{ display: 'grid', gap: '8px', marginTop: '14px' }}>
            {post.images.map((img, index) => (
              <img
                key={img}
                src={img}
                alt={`帖子图片 ${index + 1}`}
                style={{ width: '100%', maxHeight: '260px', borderRadius: '8px', objectFit: 'cover' }}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {post.tags.map(tag => <span key={tag} className="tag tag-gray">{tag}</span>)}
          {post.type === '求助' && <span className="tag tag-red">求助</span>}
        </div>

        <div className="post-detail-actions">
          <button
            className={`post-action large like-action ${post.likedByCurrentUser ? 'liked' : ''} ${liking ? 'pulsing' : ''}`}
            onClick={handleLike}
            disabled={liking}
            aria-pressed={Boolean(post.likedByCurrentUser)}
          >
            <Icon name="heart" size={18} color="currentColor" /> {post.likes}
          </button>
          <div className="post-action large as-text">
            <Icon name="comment" size={18} color="var(--text-secondary)" /> {post.comments}
          </div>
        </div>
      </article>

      <section className="section">
        <div className="section-header">
          <span className="section-title">评论</span>
          <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{post.comments} 条</span>
        </div>

        <form className="comment-composer" onSubmit={handleComment}>
          <input
            value={commentText}
            onChange={event => setCommentText(event.target.value)}
            placeholder="写下你的经验或建议"
            maxLength={180}
          />
          <button className="btn btn-sm btn-primary" disabled={!canSubmit}>
            {submitting ? '发送中' : '发送'}
          </button>
        </form>

        {loadingComments && <div className="empty" style={{ padding: '24px 16px' }}>正在加载评论...</div>}
        {!loadingComments && sortedComments.length === 0 && (
          <div className="empty" style={{ padding: '28px 16px' }}>还没有评论，来分享第一条建议</div>
        )}
        {!loadingComments && sortedComments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="avatar avatar-round" style={{ width: '30px', height: '30px', fontSize: '13px' }}>
              {comment.author.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex-between">
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{comment.author}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-placeholder)' }}>{comment.time}</span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-regular)', lineHeight: 1.6, marginTop: '3px' }}>
                {comment.content}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
