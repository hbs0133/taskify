import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '@/components/Button';
import ButtonSet from '@/components/ButtonSet';
import PwdLabel from './PwdLabel';
import TextInputLabel from './TextInputLabel';
import Modal from './AgreeModal';
import { postSignUp } from '@/services/postService';
import useToast from '@/hooks/useToast';
import { useModalStore } from '@/stores/modalStore';
import styles from './SignForm.module.scss';

export type TSignUpInputs = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email('유효한 이메일 주소를 입력해주세요.')
    .required('이메일을 입력해주세요.'),
  nickname: yup.string().required('닉네임을 입력해주세요.'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  passwordConfirmation: yup
    .string()
    .required('비밀번호 확인을 입력해주세요.')
    .oneOf([yup.ref('password'), ''], '비밀번호가 일치하지 않습니다.'),
});

export default function SignUpForm() {
  const [checkTerms, setCheckTerms] = useState(false);
  const router = useRouter();
  const { isModalOpen, setOpenModal, setCloseModal } = useModalStore();

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<TSignUpInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const password = watch('password');
  const passwordConfirmation = watch('passwordConfirmation');

  useEffect(() => {
    if (password?.length > 0) {
      trigger('passwordConfirmation');
    }
  }, [password, passwordConfirmation, trigger]);

  const onSubmit = async (data: TSignUpInputs) => {
    try {
      await postSignUp(data);
      toast('success', '회원가입 되었습니다.');
      router.push('/signin'); // 회원가입이 성공되면 로그인 페이지로 리다이렉트
    } catch (error: any) {
      let errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.';

      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = '이미 사용중인 이메일입니다.';
        } else if (error.response.status === 400) {
          errorMessage = '이메일 형식으로 작성해주세요.';
        }
      }

      console.error('회원가입에 실패했습니다:', error);
      // 에러 처리 로직 추가 가능
      toast('error', errorMessage);
    }
  };

  const handleAgree = () => {
    setCheckTerms(true);
    setCloseModal();
  };

  const handleOpenModal = () => {
    setCheckTerms(false);
    setOpenModal();
  };

  return (
    <form className={styles[`form`]} onSubmit={handleSubmit(onSubmit)}>
      <TextInputLabel
        id='email'
        label='이메일'
        placeholder='이메일을 입력해 주세요'
        error={errors.email?.message}
        register={register}
      />
      <TextInputLabel
        id='nickname'
        label='닉네임'
        placeholder='닉네임을 입력해 주세요'
        error={errors.nickname?.message}
        register={register}
      />
      <PwdLabel
        id='password'
        label='비밀번호'
        placeholder='비밀번호를 입력해 주세요'
        error={errors.password?.message}
        register={register}
      />
      <PwdLabel
        id='passwordConfirmation'
        label='비밀번호 확인'
        placeholder='비밀번호를 한번 더 입력해 주세요'
        error={errors.passwordConfirmation?.message}
        register={register}
      />
      <div>
        <input
          id='terms'
          type='checkbox'
          checked={checkTerms}
          onChange={handleOpenModal}
          onClick={setOpenModal}
          readOnly
        />{' '}
        <label htmlFor='terms' className={styles[`agree`]}>
          이용약관에 동의합니다.
        </label>
        {isModalOpen && <Modal onAgree={handleAgree} />}
      </div>
      <div className='h'>
        <ButtonSet buttonSetType='primary' widthFill={true}>
          <Button buttonType='login' disabled={!isValid || !checkTerms}>
            가입하기
          </Button>
        </ButtonSet>
      </div>
    </form>
  );
}
