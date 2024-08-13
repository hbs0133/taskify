import Button from '@/components/Button';
import styles from './EditDashboardName.module.scss';
import instance from '@/services/axios';
import { useQuery } from '@tanstack/react-query';
import ColorCircleList from '@/components/ColorCircleList';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useToast from '@/hooks/useToast';
import { useTheme } from '@/hooks/useThemeContext';
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/router';

function EditDashboardName({ id }: { id: string | string[] | undefined }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];
  const router = useRouter();

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
      toast('success', '대시보드가 성공적으로 수정되었습니다.');
    },
    onError: (err: any) => {
      toast('error', `${err.response.data.message}`);
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

  useEffect(() => {
    if (data && data.createdByMe === false) {
      toast('error', '대시보드 수정 권한이 없습니다.');
      router.push('/mydashboard');
    }
  }, [data, router]);

  if (isLoading) {
    return (
      <div className={`${styles['container']} ${themeStyle}`}>
        <Spinner />
      </div>
    );
  }

  return (
    <section className={`${styles['container']} ${themeStyle}`}>
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
