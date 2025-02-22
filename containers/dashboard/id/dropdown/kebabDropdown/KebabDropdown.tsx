import useTodoEditModalStore from '@/stores/useTodoEditModalStore';
import Dropdown from '../Dropdown';
import styles from './KebabDropdown.module.scss';
import useTodoModalStore from '@/stores/todoModalStore';
import useDetectClose from '@/hooks/useDetectClose';
import { useRef } from 'react';
import { IconKebab } from '@/assets/icongroup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCard } from '@/services/cardService';
import useToast from '@/hooks/useToast';
import { useTheme } from '@/hooks/useThemeContext';
import classNames from 'classnames';

export default function KebabDropdown({
  card,
}: {
  isOpen: boolean;
  card: ICard;
}) {
  const { setOpenEditModal } = useTodoEditModalStore();
  const { setCloseTodoModal } = useTodoModalStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useDetectClose(dropdownRef, false);
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const handleOpenDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const deleteCardMutation = useMutation({
    mutationKey: ['card', card.id],
    mutationFn: () => deleteCard(card.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getCardList', card.columnId],
      });
      setCloseTodoModal();
      toast('success', '카드가 성공적으로 삭제되었습니다.');
    },
    onError: (error) => {
      toast('error', '카드 삭제에 실패했습니다.');
    },
  });

  const handleDeleteCard = () => {
    deleteCardMutation.mutate();
  };

  const { theme } = useTheme();

  return (
    <div
      ref={dropdownRef}
      className={classNames(styles['kebab-dropdown'], styles[theme])}
    >
      <IconKebab className={styles['icon']} onClick={handleOpenDropdown} />

      <Dropdown visibility={isOpen}>
        <ul className={styles['container']}>
          <li
            className={styles['list']}
            onClick={(e) => {
              e.stopPropagation();
              setOpenEditModal(card.id);
              setCloseTodoModal();
            }}
          >
            수정하기
          </li>
          <li className={styles['list']} onClick={handleDeleteCard}>
            삭제하기
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
