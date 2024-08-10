import SmallModal from '@/components/SmallModal';
import ModalPortal from '@/components/ModalPortal';
import { useInviteModalStore } from '@/stores/modalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';

// 현재 대시보드 id를 받아옴

function InviteModal({ id }: { id: string | string[] | undefined }) {
  const { isModalOpen, setCloseModal } = useInviteModalStore();
  const queryClient = useQueryClient();

  const postInviteMutation = useMutation({
    mutationFn: (newEmail: string) =>
      axios.post(`/dashboards/${id}/invitations`, { email: newEmail }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      setCloseModal();
    },
  });

  const handleCancelBtnClick = () => {
    setCloseModal();
  };

  const handleCreateBtnClick = (data: { email: string }) => {
    postInviteMutation.mutate(data.email);
  };

  if (!isModalOpen) return null;

  return (
    <ModalPortal onClose={setCloseModal}>
      <SmallModal
        type='invite'
        handleLeftBtnClick={handleCancelBtnClick}
        handleRightBtnClick={handleCreateBtnClick}
        onSubmit={handleCreateBtnClick}
      />
    </ModalPortal>
  );
}

export default InviteModal;
