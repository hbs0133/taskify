import React, { useState } from 'react';
import styles from './index.module.scss';
import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';
import { useCreateDashboardModalStore } from '@/stores/modalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import ColorCircleList from '@/components/ColorCircleList';
import ModalPortal from '@/components/ModalPortal';
import { useRouter } from 'next/router';
import useToast from '@/hooks/useToast';

export default function CreateDashboardModal() {
  const router = useRouter();
  const { isModalOpen, setCloseModal } = useCreateDashboardModalStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast('success', '대시보드가 성공적으로 생성 되었습니다.');
      setCloseModal();
    },
    onError: (error) => {
      toast('error', '대시보드 생성에 실패했습니다.');
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
