import { createPortal } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

const ModalPortalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  width: 100%;
  height: 100%;

  .modal-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 10;
    width: 300px;
    height: 300px;
    border: 1px solid;
    background: white;
    border-radius: 5px;
  }

  .modal-content__close {
    display: inline-flex;
    justify-content: flex-end;
    width: 100%;
  }

  .modal-content__main {
    display: flex;

    padding: 1rem;
  }

  .modal-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.5;
  }
`;
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
      const $dom = document.getElementById('root-modal');
      ref.current = $dom; // ref에 dom 값 전달
    }
  }, []);
  const refCurrent = ref.current;
  if (refCurrent !== null && refCurrent !== undefined && mounted) {
    // mounted 됬고 dom이 존재하는 경우 모달 랜더링 진행
    return createPortal(
      <ModalPortalWrapper>
        <div
          className={'modal-background'}
          role="presentation"
          onClick={closePortal}
        />
        <div className={'modal-content'}>
          <div className={'modal-content__close'}>
            <button onClick={closePortal}>x</button>
          </div>
          <div className={'modal-content__main'}>{children}</div>
        </div>
      </ModalPortalWrapper>,
      refCurrent,
    );
  }

  return null;
};

export default ModalPortal;
