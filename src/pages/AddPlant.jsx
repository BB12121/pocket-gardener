import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useGardenData } from '../context/useGardenData';
import { identifyPlant } from '../services/api';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });
}

export default function AddPlant() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { addPlant, refresh } = useGardenData();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);
  const [speciesName, setSpeciesName] = useState('');
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [identifying, setIdentifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allTags = ['耐阴', '喜阳', '喜湿', '怕涝', '喜酸', '怕寒', '耐旱'];

  const chooseMethod = (nextMethod) => {
    setMethod(nextMethod);
    setFormError('');
    if (nextMethod === 'photo') {
      fileInputRef.current?.click();
    }
  };

  const handlePhotoSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('请选择图片文件');
      return;
    }
    setMethod('photo');
    setFormError('');
    setIdentifying(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPhotoPreview(dataUrl);
      const result = await identifyPlant(dataUrl);
      setRecognition(result);
      setSpeciesName(result.speciesName);
      setNickname(prev => prev || result.speciesName);
      setStep(2);
    } catch (error) {
      setRecognition(null);
      setFormError(error.message || '植物识别失败，请换一张清晰图片后重试');
    } finally {
      setIdentifying(false);
      event.target.value = '';
    }
  };

  const goStep2 = () => {
    if (!method) {
      setFormError('请选择建档方式');
      return;
    }
    if (method === 'photo' && !speciesName.trim()) {
      fileInputRef.current?.click();
      return;
    }
    setFormError('');
    setStep(2);
  };

  const goStep3 = () => {
    if (!speciesName.trim()) {
      setFormError('请填写植物品种');
      return;
    }
    if (!nickname.trim()) {
      setFormError('请给植物起一个昵称');
      return;
    }
    setFormError('');
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!nickname.trim() || !speciesName.trim()) {
      setFormError('请先填写品种和昵称');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      await addPlant({
        nickname: nickname.trim(),
        speciesName: speciesName.trim(),
        location,
        tags,
      });
      await refresh();
      setSubmitted(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      setFormError(error.message || '创建植物失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
          <h1>添加植物</h1>
        </div>
        <div className="section" style={{ padding: '48px 16px', textAlign: 'center' }}>
          <Icon name="check" size={48} color="var(--green)" />
          <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '12px' }}>创建成功</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            已为 {nickname || '新植物'} 初始化养护档案
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>添加植物</h1>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoSelected}
        style={{ display: 'none' }}
      />

      <div className="section" style={{ padding: '12px 16px' }}>
        <div className="flex-between" style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>步骤 {step}/3</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {step === 1 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">选择建档方式</span>
          </div>
          <div className="cell" onClick={() => chooseMethod('photo')} style={{ cursor: 'pointer', background: method === 'photo' ? 'var(--green-bg)' : 'var(--white)' }}>
            <div className="cell-icon" style={{ background: '#f5f5f5', borderRadius: '50%' }}>
              <Icon name="camera" size={18} color="var(--text-secondary)" />
            </div>
            <div className="cell-content">
              <div className="cell-title">{identifying ? '正在识别...' : '拍照识别'}</div>
              <div className="cell-desc">上传植物照片，自动识别品种并填入表单</div>
            </div>
            {method === 'photo' && <Icon name="check" size={16} color="var(--green)" />}
          </div>
          <div className="cell" onClick={() => chooseMethod('manual')} style={{ cursor: 'pointer', background: method === 'manual' ? 'var(--green-bg)' : 'var(--white)' }}>
            <div className="cell-icon" style={{ background: '#f5f5f5', borderRadius: '50%' }}>
              <Icon name="edit" size={18} color="var(--text-secondary)" />
            </div>
            <div className="cell-content">
              <div className="cell-title">手动录入</div>
              <div className="cell-desc">手动填写品种和基础信息</div>
            </div>
            {method === 'manual' && <Icon name="check" size={16} color="var(--green)" />}
          </div>
          {method && (
            <div style={{ padding: '16px' }}>
              <button className="btn btn-primary btn-block" onClick={goStep2} disabled={identifying}>
                下一步
              </button>
            </div>
          )}
          {formError && <div className="auth-error" style={{ margin: '0 16px 16px' }}>{formError}</div>}
        </div>
      )}

      {step === 2 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">{method === 'photo' ? '识别结果' : '品种信息'}</span>
          </div>
          {method === 'photo' && (
            <div style={{ padding: '16px', background: '#f9f9f9' }}>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="植物照片"
                  style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                />
              )}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                识别结果：<strong>{speciesName || '未识别'}</strong>
                {recognition && ` · 置信度 ${Math.round(recognition.confidence * 100)}%`}
              </div>
              {recognition?.care && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                  {recognition.care}
                </div>
              )}
              <button className="btn btn-default btn-sm" type="button" onClick={() => fileInputRef.current?.click()} style={{ marginTop: '10px' }}>
                重新选择图片
              </button>
            </div>
          )}
          <div className="form-group">
            <div className="form-item">
              <span className="form-label">品种</span>
              <input className="form-input" value={speciesName} onChange={e => setSpeciesName(e.target.value)} placeholder="例如：绿萝" />
            </div>
            <div className="form-item">
              <span className="form-label">昵称</span>
              <input className="form-input" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="给它起个名字" />
            </div>
          </div>
          <div style={{ padding: '16px', display: 'flex', gap: '8px' }}>
            <button className="btn btn-default" style={{ flex: 1 }} onClick={() => setStep(1)}>上一步</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={goStep3}>下一步</button>
          </div>
          {formError && <div className="auth-error" style={{ margin: '0 16px 16px' }}>{formError}</div>}
        </div>
      )}

      {step === 3 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">补充信息</span>
          </div>
          <div className="form-group">
            <div className="form-item">
              <span className="form-label">位置</span>
              <select className="form-input" value={location} onChange={e => setLocation(e.target.value)} style={{ border: 'none' }}>
                <option value="">请选择</option>
                <option>客厅窗台</option>
                <option>阳台</option>
                <option>书房</option>
                <option>卧室</option>
                <option>卫生间</option>
              </select>
            </div>
            <div className="form-item">
              <span className="form-label">购买日期</span>
              <input className="form-input" type="date" style={{ border: 'none' }} />
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>敏感标签</div>
            <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`btn btn-sm ${tags.includes(tag) ? 'btn-primary' : 'btn-default'}`}
                  onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: '0 16px 16px', display: 'flex', gap: '8px' }}>
            <button className="btn btn-default" style={{ flex: 1 }} onClick={() => setStep(2)} disabled={submitting}>上一步</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? '创建中...' : '确认创建'}
            </button>
          </div>
          {formError && <div className="auth-error" style={{ margin: '0 16px 16px' }}>{formError}</div>}
        </div>
      )}
    </div>
  );
}
