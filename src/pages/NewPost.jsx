import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useGardenData } from '../context/useGardenData';
import { MAX_IMAGE_ATTACHMENTS, readImageAttachments } from '../utils/imageFiles';

export default function NewPost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { addPost } = useGardenData();
  const [type, setType] = useState('经验');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const [processingImages, setProcessingImages] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await addPost({
      type,
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      images,
    });
    setSubmitted(true);
    setTimeout(() => navigate(-1), 1500);
  };

  const handleImageSelected = async (event) => {
    const fileList = event.target.files;
    if (!fileList?.length) return;
    setPhotoError('');
    setProcessingImages(true);
    try {
      const result = await readImageAttachments(fileList, images);
      setImages(prev => [...prev, ...result.images].slice(0, MAX_IMAGE_ATTACHMENTS));
      if (result.hasRejectedType) {
        setPhotoError('已忽略非图片文件');
      } else if (result.hasRejectedLimit) {
        setPhotoError(`最多添加 ${MAX_IMAGE_ATTACHMENTS} 张图片`);
      }
    } catch (error) {
      setPhotoError(error.message || '图片处理失败，请换一张图片重试');
    } finally {
      setProcessingImages(false);
      event.target.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, itemIndex) => itemIndex !== index));
    setPhotoError('');
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelected}
          style={{ display: 'none' }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelected}
          style={{ display: 'none' }}
        />

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

        <div className="section" style={{ padding: '16px' }}>
          <div className="flex-between" style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>帖子图片</span>
            <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>{images.length}/{MAX_IMAGE_ATTACHMENTS}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              className="image-upload-tile"
              onClick={() => cameraInputRef.current?.click()}
              disabled={processingImages || images.length >= MAX_IMAGE_ATTACHMENTS}
            >
              <Icon name="camera" size={22} color="var(--text-placeholder)" />
              <span>{processingImages ? '正在处理图片...' : images.length >= MAX_IMAGE_ATTACHMENTS ? '图片已达上限' : '拍照'}</span>
            </button>
            <button
              type="button"
              className="image-upload-tile"
              onClick={() => fileInputRef.current?.click()}
              disabled={processingImages || images.length >= MAX_IMAGE_ATTACHMENTS}
            >
              <Icon name="image" size={22} color="var(--text-placeholder)" />
              <span>{images.length >= MAX_IMAGE_ATTACHMENTS ? '图片已达上限' : '从相册选择'}</span>
            </button>
          </div>
          {images.length > 0 && (
            <div className="image-attachment-grid">
              {images.map((image, index) => (
                <div className="image-attachment" key={`${image.slice(0, 32)}-${index}`}>
                  <img src={image} alt={`帖子图片 ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(index)} aria-label="移除图片">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {photoError && <div className="form-hint error">{photoError}</div>}
        </div>

        <div style={{ padding: '16px' }}>
          <button type="submit" className="btn btn-primary btn-block" disabled={processingImages}>发布</button>
        </div>
      </form>
    </div>
  );
}
