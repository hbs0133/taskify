import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import styles from './TodoEditModal.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import useImageStore from '@/stores/ImageInputStore';
import ModalPortal from '@/components/ModalPortal';
import useTodoEditModalStore from '@/stores/useTodoEditModalStore';
import useColumnList from '@/hooks/useColumnList';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import SelectProgressDropdown from '@/containers/dashboard/id/dropdown/SelectProgressDropdown';
import SelectAssigneeDropdown from '@/containers/dashboard/id/dropdown/SelectAssigneeDropdown';
import ImageInput from '@/components/Input/ImageInput';
import getDate from '@/utils/getDate';
import useToast from '@/hooks/useToast';
import HashTagsInput from '@/containers/dashboard/id/modals/components/hastagsInput/HashtagsInput';

export default function TodoEditModal({ card }: { card: ICard }) {
  const {
    id: cardId,
    title,
    description,
    columnId,
    dueDate,
    tags: initialTags,
    imageUrl,
    assignee,
  } = card;

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    imageUrl,
  );
  const [tags, setTags] = useState<string[]>(initialTags); // 태그 상태 관리
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      title: title,
      description: description,
      dueDate: dueDate ? dueDate.slice(0, 16) : '',
      tags: tags.length === 0 ? [] : tags,
      imageUrl: currentImageUrl ?? null,
    },
    mode: 'onChange',
  });

  const queryClient = useQueryClient();
  const { setCloseEditModal } = useTodoEditModalStore();
  const router = useRouter();
  const { id: dashboardId } = router.query as { id: string };
  const { columnList } = useColumnList(dashboardId);
  const currentColumn = columnList.find(
    (column: IColumn) => columnId === column.id,
  );
  const [selectedProgressValue, setSelectedProgressValue] = useState<IColumn>(
    currentColumn!,
  );

  const [selectedAssigneeValue, setSelectedAssigneeValue] = useState<
    IAssignee | IMember | null
  >(assignee ?? null);

  const postImageMutation = useMutation({
    mutationFn: (file: File) =>
      axios.post(`/columns/${columnId}/card-image`, file),
    onError: (error) => toast('error', error.message),
  });

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

      return res;
    } catch (e: any) {
      console.error(e.message);
      toast('error', '이미지 업로드에 실패했습니다.');
    }
  }

  const handleImageChange = async (image: any) => {
    const res = await handlePostImage(image);

    if (res) {
      setCurrentImageUrl(res);
    }
  };

  const handleImageDelete = () => {
    setCurrentImageUrl(null);
  };

  /*put*/
  const updateColumnMutation = useMutation({
    mutationFn: (data: IPostData) => {
      console.log('Request Data:', data);
      return axios.put(`/cards/${cardId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getColumnList', dashboardId],
      });
      queryClient.invalidateQueries({
        queryKey: ['getCardList', columnId],
      });
      queryClient.invalidateQueries({
        queryKey: ['getCardList', selectedProgressValue.id],
      });
      toast('success', '할 일이 성공적으로 수정되었습니다.');
      setCloseEditModal();
    },
    onError: (error) => {
      console.error('Update Error:', error);
      toast('error', '할 일 수정에 실패했습니다.');
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const titleValue = value.title?.trim() !== '';
      const descriptionValue = value.description?.trim() !== '';
      setIsFormValid(titleValue && descriptionValue);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // onSubmit 핸들러 추가
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { title, description, dueDate, imageUrl } = data;

    const requestData: IPostData = {
      title: title,
      description: description,
      columnId: selectedProgressValue.id,
      assigneeUserId: selectedAssigneeValue
        ? 'userId' in selectedAssigneeValue
          ? selectedAssigneeValue?.userId ?? null
          : selectedAssigneeValue?.id ?? null
        : null,
      tags: tags,

      dueDate: dueDate ? getDate(dueDate, true) : null,
      imageUrl: currentImageUrl ?? null,
    };
    if (!isFormValid) {
      toast('error', '모든 필수 입력 항목을 입력해주세요.');
    }

    updateColumnMutation.mutate(requestData);
  };

  return (
    <ModalPortal onClose={setCloseEditModal}>
      <div className={styles['container']}>
        <form className={styles['form']} onSubmit={handleSubmit(onSubmit)}>
          <p className={styles['modal-title']}>할 일 수정</p>
          <div className={styles['status-and-owner']}>
            <div
              className={`${styles['top-form']} ${styles['label-and-form']}`}
            >
              <label className={styles['form-label']}>상태</label>
              <SelectProgressDropdown
                columnList={columnList}
                selectedValue={selectedProgressValue}
                setSelectedValue={setSelectedProgressValue}
              />
            </div>
            <div
              className={`${styles['top-form']} ${styles['label-and-form']}`}
            >
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
            <HashTagsInput tags={tags} setTags={setTags} />{' '}
          </div>
          <div className={styles['label-and-form']}>
            <label className={styles['form-label']}>이미지</label>
            <ImageInput
              name='user-profile'
              value={currentImageUrl}
              onChange={handleImageChange}
              onDeleteClick={handleImageDelete}
            />
          </div>
          <div className={styles['button-group']}>
            <button
              type='reset'
              className={styles['button']}
              onClick={setCloseEditModal}
            >
              취소
            </button>
            <button
              type='submit'
              className={`${styles['button']} ${styles['yellow']}`}
              disabled={!isFormValid}
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
