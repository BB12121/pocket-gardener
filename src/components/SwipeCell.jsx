import { useRef, useState } from 'react';

export default function SwipeCell({ children, actions = [] }) {
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragging = useRef(false);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const actionWidth = actions.length * 72;

  const startSwipe = (clientX) => {
    if (actionWidth === 0) return;
    startX.current = clientX;
    currentX.current = offset;
    dragging.current = true;
    setSwiping(true);
  };

  const moveSwipe = (clientX) => {
    if (!dragging.current || actionWidth === 0) return;
    const diff = clientX - startX.current;
    let newOffset = currentX.current + diff;
    if (newOffset > 0) newOffset = 0;
    if (newOffset < -actionWidth) newOffset = -actionWidth;
    setOffset(newOffset);
  };

  const endSwipe = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setSwiping(false);
    if (offset < -actionWidth / 2) {
      setOffset(-actionWidth);
    } else {
      setOffset(0);
    }
  };

  const handleTouchStart = (e) => startSwipe(e.touches[0].clientX);
  const handleTouchMove = (e) => moveSwipe(e.touches[0].clientX);
  const handleTouchEnd = () => endSwipe();
  const handlePointerDown = (e) => {
    if (e.pointerType === 'touch') return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startSwipe(e.clientX);
  };
  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    moveSwipe(e.clientX);
  };
  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') return;
    endSwipe();
  };

  const close = () => setOffset(0);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 1,
          background: 'var(--white)',
          touchAction: 'pan-y',
          cursor: actionWidth ? 'grab' : 'default',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {children}
      </div>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        zIndex: 0,
      }}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => { close(); action.onClick(); }}
            style={{
              width: '72px',
              height: '100%',
              border: 'none',
              color: 'white',
              fontSize: '13px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: action.color || '#c8c8c8',
            }}
          >
            {action.icon && <span style={{ display: 'flex' }}>{action.icon}</span>}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
