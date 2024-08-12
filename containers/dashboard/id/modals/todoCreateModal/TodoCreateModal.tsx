import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import useColumnList from '@/hooks/useColumnList';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SelectAssigneeDropdown from '../../dropdown/SelectAssigneeDropdown';
import ModalPortal from '@/components/ModalPortal';
import styles from './TodoCreateModal.module.scss';
import ImageInput from '@/components/Input/ImageInput';
import { useEffect, useState } from 'react';
import useToast from '@/hooks/useToast';
import getDate from '@/utils/getDate';
import useTodoCreateModalStore from '@/stores/TodoCreateModalStore';
import HashTagsInput from '../components/hastagsInput/HashtagsInput';

export default function TodoCreateModal({ columnId }: { columnId: number }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: 'onChange' });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id: dashboardId } = router.query;
  const { columnList } = useColumnList(dashboardId);

  const { TodoCreateModalId, setCloseTodoCreateModal } =
    useTodoCreateModalStore();

  const [selectedAssigneeValue, setSelectedAssigneeValue] =
    useState<IMember | null>(null);

  /*폼 유효성 검사*/

  useEffect(() => {
    const title = watch('title');
    const description = watch('description');
    setIsFormValid(title?.trim() !== '' && description?.trim() !== '');
  }, [watch('title'), watch('description')]);

  useEffect(() => {
    if (imageUrl) {
      setValue('imageUrl', imageUrl);
    }
  }, [imageUrl, setValue]);

  interface postType {
    imageUrl: string;
  }

  async function handlePostImage(file: File) {
    try {
      const res = await axios
        .post<postType>(
          `/columns/${columnId}/card-image`,
          { image: file },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then((res) => res.data)
        .then((data) => data.imageUrl);
      console.log(res);
      return res;
    } catch (e: any) {
      console.error(e.message);
      toast('error', '이미지 업로드에 실패했습니다.');
    }
  }

  const handleImageInput = async (image: any) => {
    const res = await handlePostImage(image);

    if (res) {
      setImageUrl(res);
    }
  };

  const postTodoMutation = useMutation({
    mutationFn: (formData: FormValues) => {
      return axios.post(`/cards`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getColumnList', dashboardId],
      });
      queryClient.invalidateQueries({
        queryKey: ['getCardList', columnId],
      });

      toast('success', '할 일이 성공적으로 생성되었습니다.');
      reset(); // 폼 초기화
      setCloseTodoCreateModal();
    },
    onError: (error) => {
      console.error('Create Error:', error);
      toast('error', '할 일 생성에 실패했습니다.');
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { title, description, dueDate, imageUrl } = data;

    const assigneeUserId =
      selectedAssigneeValue?.userId ?? selectedAssigneeValue?.id;

    const requestData: FormValues = {
      assigneeUserId,
      dashboardId: Number(dashboardId),
      columnId: columnId,
      title,
      description,
      tags: tags,
      imageUrl: imageUrl,
    };

    if (dueDate) {
      requestData.dueDate = getDate(dueDate, true);
    }

    if (!isFormValid) {
      toast('error', '모든 필수 입력 항목을 입력해주세요.');
    }

    postTodoMutation.mutate(requestData); // 폼 데이터 전송
  };

  if (TodoCreateModalId !== columnId) return <></>;
  return (
    <ModalPortal onClose={setCloseTodoCreateModal}>
      <div className={styles['container']}>
        <form
          className={styles['form']}
          onSubmit={handleSubmit(onSubmit)}
          onReset={() => {
            reset(); // 폼 리셋
            setCloseTodoCreateModal();
          }}
        >
          <p className={styles['modal-title']}>할 일 생성</p>
          <div className={styles['owner']}>
            <div className={styles['label-and-form']}>
              <label className={styles['form-label']}>담당자</label>
              <SelectAssigneeDropdown
                selectedAssigneeValue={selectedAssigneeValue}
                setSelectedAssigneeValue={setSelectedAssigneeValue}
                dashboardId={dashboardId}
              />
            </div>
          </div>
          <div className={styles['label-and-form']}>
            <div className={styles['label-with-star']}>
              <label className={styles['form-label']}>제목</label>
              <label className={styles['essential']}>*</label>
            </div>
            <input
              className={`${styles['form-input']} ${
                errors.title ? styles['error-border'] : ''
              }`}
              placeholder='제목을 입력해주세요'
              {...register('title', { required: '* 필수 입력 항목입니다' })}
            />
            {errors.title && (
              <p className={styles['error-message']}>{errors.title.message}</p>
            )}
          </div>
          <div className={styles['label-and-form']}>
            <div className={styles['label-with-star']}>
              <label className={styles['form-label']}>설명</label>
              <label className={styles['essential']}>*</label>
            </div>
            <textarea
              className={`${styles['form-input']} ${
                styles['form-description']
              } ${errors.description ? styles['error-border'] : ''}`}
              placeholder='설명을 입력해주세요'
              {...register('description', {
                required: '* 필수 입력 항목입니다',
              })}
            ></textarea>
            {errors.description && (
              <p className={styles['error-message']}>
                {errors.description.message}
              </p>
            )}
          </div>
          <div className={styles['label-and-form']}>
            <label className={styles['form-label']}>마감일</label>
            <input
              className={styles['date-input']}
              type='datetime-local'
              {...register('dueDate')}
            />
          </div>
          <div className={styles['label-and-form']}>
            <label className={styles['form-label']}>태그</label>
            <HashTagsInput tags={tags} setTags={setTags} />
          </div>
          <div className={styles['label-and-form']}>
            <label className={styles['form-label']}>이미지</label>
            <ImageInput
              name='task-image'
              value={imageUrl}
              onChange={handleImageInput}
              onDeleteClick={() => setImageUrl(null)}
            />
          </div>
          <div className={styles['button-group']}>
            <button type='reset' className={styles['button']}>
              취소
            </button>
            <button
              type='submit'
              className={`${styles['button']} ${styles['yellow']}`}
              disabled={!isFormValid}
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
