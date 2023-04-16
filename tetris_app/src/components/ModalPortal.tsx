import { createPortal } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import style from './modal.module.css';

const ModalPortal = ({
  children,
  closePortal,
}: {
  children: React.ReactNode;
  closePortal: () => void;
}) => {
  const ref = useRef<Element | null>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (document) {
      const dom = document.getElementById('root-modal');
      ref.current = dom; // ref에 dom 값 전달
    }
  }, []);
  const refCurrent = ref.current;
  if (refCurrent !== null && refCurrent !== undefined && mounted) {
    // mounted 됬고 dom이 존재하는 경우 모달 랜더링 진행
    return createPortal(
      <div className={style.modal}>
        <div
          className={style['modal-background']}
          role="presentation"
          onClick={closePortal}
        />
        <div className={style['modal-content']}>
          <div className={style['modal-content__close']}>
            <button onClick={closePortal}>x</button>
          </div>
          <div className={style['modal-content__main']}>{children}</div>
        </div>
      </div>,
      refCurrent,
    );
  }

  return null;
};

export default ModalPortal;
