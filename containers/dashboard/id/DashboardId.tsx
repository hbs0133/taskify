import Button from '@/components/Button';
import Column from '@/containers/dashboard/id/column/Column';
import useColumnList from '@/hooks/useColumnList';
import { useCreateModalStore } from '@/stores/modalStore';
import { useRouter } from 'next/router';

import styles from './index.module.scss';
import CreateModal from './modals/CreateModal';
import { DragDropContext } from '@hello-pangea/dnd';
import { useQueryClient } from '@tanstack/react-query';
import { onDragEnd } from '@/services/dragService';

import DashboardLayout from '@/containers/dashboardLayout';
import { useTheme } from '@/hooks/useThemeContext';

function DashboardId() {
  const { theme, toggleTheme } = useTheme();

  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const { isModalOpen, setOpenModal } = useCreateModalStore();
  const { columnList, isLoading, error } = useColumnList(id);

  // 나중에 수정
  if (isLoading) return <h2>...loading</h2>;
  if (error) return <h2>error</h2>;

  const handleDragEnd = (result: any) => {
    onDragEnd(result, queryClient);
  };

  return (
    <DashboardLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <section className={`${styles['main-section']} ${styles[theme]}`}>
          <>
            {columnList.map((column: IColumn) => {
              return (
                <Column id={column.id} title={column.title} key={column.id} />
              );
            })}
          </>
          <div className={styles['etc-wrapper']}>
            <Button buttonType='add-column' onClick={setOpenModal}>
              새로운 컬럼 추가하기
            </Button>
            {isModalOpen && <CreateModal id={id} />}
          </div>
        </section>
      </DragDropContext>
    </DashboardLayout>
  );
}

export default DashboardId;
