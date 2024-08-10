import React, { useState } from 'react';
import styles from './index.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';
import { useCreateModalStore } from '@/stores/modalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import ColorCircleList from '@/components/ColorCircleList';
import ModalPortal from '@/components/ModalPortal';
import { useRouter } from 'next/router';

export default function CreateDashboardModal() {
  const router = useRouter();
  const { isModalOpen, setCloseModal } = useCreateModalStore();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string | null>('');
  const [color, setColor] = useState<string | null>('#7AC555');

  const handleOnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleText = e.target.value;
    setTitle(titleText);
  };

  const handleOnColorClick: OnColorClick = (color: string) => {
    setColor(color);
  };

  const handleCancelBtnClick = () => {
    setCloseModal();
  };

  const createDashboardMutation = useMutation({
    mutationFn: () => axios.post(`/dashboards`, { title, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      setCloseModal();
    },
  });

  const handleCreateBtnClick = () => {
    createDashboardMutation.mutate();
  };

  if (!isModalOpen) return null;

  return (
    <ModalPortal onClose={setCloseModal}>
      <section className={`${styles['modal-container']}`}>
        <h2>새로운 대시보드</h2>
        <label className={`${styles['label-container']}`}>
          <p>대시보드 이름</p>
          <input type='text' onChange={handleOnTitleChange} />
        </label>
        <ColorCircleList onClick={handleOnColorClick} />
        <ButtonSet buttonSetType='primary' widthFill={true}>
          <Button buttonType='modal-secondary' onClick={handleCancelBtnClick}>
            취소
          </Button>

          <Button
            //이부분 disabled 스타일 처리 도용님께 여쭤보고 버튼 색상 바꾸는 :disabled  css 추가하면 좋을꺼 같다! 현재는 사용자가 알지 못한다!
            disabled={!title}
            buttonType='modal-primary'
            onClick={handleCreateBtnClick}
          >
            생성
          </Button>
        </ButtonSet>
      </section>
    </ModalPortal>
  );
}
