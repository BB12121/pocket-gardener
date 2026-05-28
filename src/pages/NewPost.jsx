import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGardenData } from '../context/useGardenData';

export default function NewPost() {
  const navigate = useNavigate();
  const { addPost } = useGardenData();
  const [type, setType] = useState('经验');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await addPost({
      type,
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    setSubmitted(true);
    setTimeout(() => navigate(-1), 1500);
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
          <h1>发布帖子</h1>
        </div>
        <div className="section" style={{ padding: '48px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '12px' }}>发布成功</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            你的帖子已发布到社区
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>发布帖子</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="section">
          <div className="form-group">
            <div className="form-item">
              <span className="form-label">类型</span>
              <select
                className="form-input"
                value={type}
                onChange={e => setType(e.target.value)}
                style={{ border: 'none' }}
              >
                <option value="经验">经验分享</option>
                <option value="求助">求助</option>
              </select>
            </div>
            <div className="form-item">
              <span className="form-label">标题</span>
              <input
                className="form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="输入帖子标题"
              />
            </div>
            <div className="form-item">
              <span className="form-label">标签</span>
              <input
                className="form-input"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="用逗号分隔，如：绿萝,施肥"
              />
            </div>
          </div>
        </div>

        <div className="section">
          <div className="form-group">
            <textarea
              className="form-textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="分享你的养护经验或描述你遇到的问题..."
              style={{ padding: '14px 16px', minHeight: '160px' }}
            />
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <button type="submit" className="btn btn-primary btn-block">发布</button>
        </div>
      </form>
    </div>
  );
}
