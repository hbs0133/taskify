import Button from '@/components/Button';
import styles from './EditDashboardName.module.scss';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import ColorCircleList from '@/components/ColorCircleList';
import { useState } from 'react';
import ButtonSet from '@/components/ButtonSet';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function EditDashboardName({ id }: { id: string | string[] | undefined }) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string | null>('');
  const [color, setColor] = useState<string | null>('#7AC555');

  const fetchDashboardById = async (id: string | string[] | undefined) => {
    const response = await instance.get(`/dashboards/${id}`);
    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => fetchDashboardById(id),
    enabled: !!id,
  });

  const putDashboardMutation = useMutation({
    mutationFn: () => instance.put(`/dashboards/${id}`, { title, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handlePutBtnClick = () => {
    putDashboardMutation.mutate();
  };
  const handleOnTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleText = e.target.value;
    setTitle(titleText);
  };

  const handleOnColorClick: OnColorClick = (color: string) => {
    setColor(color);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className={`${styles['container']}`}>
      <h2>{data?.title}</h2>
      <label className={`${styles['label-container']}`}>
        <p>대시보드 이름</p>
        <input type='text' onChange={handleOnTitleChange} />
      </label>
      <ColorCircleList onClick={handleOnColorClick} />
      <Button
        disabled={!title}
        buttonType='modal-primary'
        onClick={handlePutBtnClick}
      >
        변 경
      </Button>
    </section>
  );
}

export default EditDashboardName;
