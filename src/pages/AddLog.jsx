import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useGardenData } from '../context/useGardenData';
import { identifyPlant } from '../services/api';
import { MAX_IMAGE_ATTACHMENTS, readImageAttachments } from '../utils/imageFiles';

export default function AddLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { plants, addLog, refresh } = useGardenData();
  const plant = plants.find(p => p.id === id);
  const [logType, setLogType] = useState('浇水');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('正常');
  const [height, setHeight] = useState('');
  const [leaves, setLeaves] = useState('');
  const [health, setHealth] = useState('');
  const [images, setImages] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const [aiFillMessage, setAiFillMessage] = useState('');
  const [processingImages, setProcessingImages] = useState(false);
  const [recognizingGrowth, setRecognizingGrowth] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const logTypes = ['浇水', '施肥', '修剪', '换盆', '病虫害', '其他'];

  const optionalNumber = (value) => {
    if (value === '') return undefined;
    return Number(value);
  };

  const fillGrowthFromImage = async (image) => {
    setRecognizingGrowth(true);
    setAiFillMessage('AI 正在根据照片识别生长数据，可能需要几十秒...');
    try {
      const result = await identifyPlant(image);
      let filled = 0;
      if (typeof result.height === 'number') {
        setHeight(String(Number(result.height.toFixed(1))));
        filled += 1;
      }
      if (typeof result.leaves === 'number') {
        setLeaves(String(Math.round(result.leaves)));
        filled += 1;
      }
      if (typeof result.health === 'number') {
        setHealth(String(Math.round(result.health)));
        filled += 1;
      }
      setAiFillMessage(filled > 0 ? '已根据照片预填生长数据，可继续手动调整' : '照片已识别，但未能估算生长数据');
    } catch (error) {
      setAiFillMessage(error.message || '生长数据识别失败，可手动填写');
    } finally {
      setRecognizingGrowth(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLog({
      plantId: id,
      type: logType,
      note,
      status,
      images,
      height: optionalNumber(height),
      leaves: optionalNumber(leaves),
      health: optionalNumber(health),
    });
    await refresh();
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
        setPhotoError(`最多添加 ${MAX_IMAGE_ATTACHMENTS} 张照片`);
      }
      if (result.images[0]) {
        await fillGrowthFromImage(result.images[0]);
      }
    } catch (error) {
      setPhotoError(error.message || '照片处理失败，请换一张图片重试');
    } finally {
      setProcessingImages(false);
      event.target.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, itemIndex) => itemIndex !== index));
    setPhotoError('');
  };

  if (!plant) return <div className="page"><div className="empty">植物不存在</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1>记录养护</h1>
      </div>

      {submitted ? (
        <div className="section" style={{ padding: '48px 16px', textAlign: 'center' }}>
          <Icon name="check" size={48} color="var(--green)" />
          <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '12px' }}>记录成功</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            已更新 {plant.nickname} 的养护状态
          </div>
        </div>
      ) : (
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
            <div className="cell">
              <div className="cell-content">
                <div className="cell-desc">目标植物</div>
                <div className="cell-title" style={{ fontWeight: '500' }}>{plant.nickname}</div>
              </div>
            </div>
          </div>

          <div className="section" style={{ padding: '16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>养护类型</div>
            <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
              {logTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`btn btn-sm ${logType === type ? 'btn-primary' : 'btn-default'}`}
                  onClick={() => setLogType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="form-group">
              <textarea
                className="form-textarea"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="记录本次养护的详细情况..."
                style={{ padding: '14px 16px' }}
              />
            </div>
          </div>

          <div className="section">
            <div className="form-group">
              <div className="form-item">
                <span className="form-label">状态</span>
                <select className="form-input" value={status} onChange={e => setStatus(e.target.value)} style={{ border: 'none' }}>
                  <option>正常</option>
                  <option>轻微异常</option>
                  <option>黄叶</option>
                  <option>病虫害</option>
                  <option>生长旺盛</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <span className="section-title">生长数据</span>
              <span style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>
                {recognizingGrowth ? 'AI 识别中' : '选填'}
              </span>
            </div>
            <div className="form-group">
              <div className="form-item">
                <span className="form-label">高度</span>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder="cm"
                  style={{ border: 'none' }}
                />
              </div>
              <div className="form-item">
                <span className="form-label">叶片数</span>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="1"
                  value={leaves}
                  onChange={e => setLeaves(e.target.value)}
                  placeholder="片"
                  style={{ border: 'none' }}
                />
              </div>
              <div className="form-item">
                <span className="form-label">健康评分</span>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={health}
                  onChange={e => setHealth(e.target.value)}
                  placeholder="0-100"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
            {aiFillMessage && (
              <div className="form-hint" style={{ padding: '0 16px 12px' }}>
                {aiFillMessage}
              </div>
            )}
          </div>

          <div className="section" style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={processingImages || images.length >= MAX_IMAGE_ATTACHMENTS}
                style={{
                  border: '0.5px dashed var(--border)',
                  borderRadius: '6px',
                  padding: '18px 12px',
                  textAlign: 'center',
                  color: 'var(--text-placeholder)',
                  background: '#fbfbfc',
                  font: 'inherit',
                  cursor: images.length >= MAX_IMAGE_ATTACHMENTS ? 'default' : 'pointer',
                }}
              >
                <Icon name="camera" size={24} color="var(--text-placeholder)" />
                <div style={{ fontSize: '13px', marginTop: '4px' }}>
                  {processingImages ? '正在处理照片...' : images.length >= MAX_IMAGE_ATTACHMENTS ? '照片已达上限' : '拍照'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={processingImages || images.length >= MAX_IMAGE_ATTACHMENTS}
                style={{
                  border: '0.5px dashed var(--border)',
                  borderRadius: '6px',
                  padding: '18px 12px',
                  textAlign: 'center',
                  color: 'var(--text-placeholder)',
                  background: '#fbfbfc',
                  font: 'inherit',
                  cursor: images.length >= MAX_IMAGE_ATTACHMENTS ? 'default' : 'pointer',
                }}
              >
                <Icon name="image" size={24} color="var(--text-placeholder)" />
                <div style={{ fontSize: '13px', marginTop: '4px' }}>
                  {images.length >= MAX_IMAGE_ATTACHMENTS ? '照片已达上限' : '从相册选择'}
                </div>
              </button>
            </div>
            <div className="form-hint" style={{ paddingTop: '8px' }}>最多 {MAX_IMAGE_ATTACHMENTS} 张</div>
            {images.length > 0 && (
              <div className="image-attachment-grid">
                {images.map((image, index) => (
                  <div className="image-attachment" key={`${image.slice(0, 32)}-${index}`}>
                    <img src={image} alt={`养护照片 ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)} aria-label="移除照片">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photoError && <div className="form-hint error">{photoError}</div>}
          </div>

          <div style={{ padding: '16px' }}>
            <button type="submit" className="btn btn-primary btn-block" disabled={processingImages}>
              确认记录
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
