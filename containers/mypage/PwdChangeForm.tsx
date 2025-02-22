import { AxiosError } from 'axios';
import { ChangeEvent, FormEventHandler, useState } from 'react';
import Button from '@/components/Button';
import PwdInput from '@/components/Input/PwdInput';
import { putPassword } from '@/services/putService';
import styles from './PwdChangeForm.module.scss';
import useToast from '@/hooks/useToast';
import { useTheme } from '@/hooks/useThemeContext';

interface PasswordChangeForm {
  password: string;
  newPassword: string;
  newPasswordCheck: string;
}

interface InputError {
  password?: string;
  newPassword?: string;
  newPasswordCheck?: string;
}

const INITIAL_INPUT_DATA = {
  password: '',
  newPassword: '',
  newPasswordCheck: '',
};

const checkValid = (inputData: PasswordChangeForm, inputError: InputError) =>
  inputData.password &&
  inputData.newPassword &&
  inputData.newPasswordCheck &&
  !(
    inputError.password ||
    inputError.newPassword ||
    inputError.newPasswordCheck
  );

export default function PwdChangeForm() {
  const [inputData, setInputData] =
    useState<PasswordChangeForm>(INITIAL_INPUT_DATA);
  const [inputError, setInputError] = useState<InputError>({});

  // Toast store의 addToastList 메소드 가져오기
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleInputBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // NOTE: 비밀번호 8자 이상인지 확인합니다.
    setInputError((prevError) => ({
      ...prevError,
      [id]: value.length < 8 ? '8자 이상 입력해주세요.' : '',
    }));

    if (id === 'newPassword' || id === 'newPasswordCheck') {
      // NOTE: 새 비밀번호끼리 일치여부 확인합니다.
      const missMatched =
        (id === 'newPassword' &&
          inputData.newPasswordCheck &&
          value !== inputData.newPasswordCheck) ||
        (id === 'newPasswordCheck' && value !== inputData.newPassword);
      setInputError((prevError) => ({
        ...prevError,
        newPasswordCheck: missMatched ? '비밀번호가 일치하지 않습니다.' : '',
      }));
    }

    if (id === 'newPassword' || id === 'password') {
      // NOTE: 새 비밀번호가 현재 비밀번호와 같은지 확인합니다.
      const matched =
        (id === 'password' &&
          inputData.newPassword &&
          value === inputData.newPassword) ||
        (id === 'newPassword' &&
          inputData.password &&
          value === inputData.password);
      setInputError((prevError) => ({
        ...prevError,
        newPassword: matched ? '새 비밀번호가 기존 비밀번호와 같습니다.' : '',
      }));
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const putData = async () => {
      const { password, newPassword } = inputData;
      try {
        await putPassword({ password, newPassword });
        // NOTE: 전체 페이지 리로드보다 시간이 훨씬 적게 걸려서 값만 비우도록 했습니다.
        setInputData(INITIAL_INPUT_DATA);
        toast('success', '비밀번호가 변경되었습니다.');
      } catch (error) {
        if (error instanceof AxiosError) {
          toast('error', error.response?.data.message || '비밀번호 변경 실패');
        } else if (error instanceof Error) {
          toast('error', error.message || '비밀번호 변경 실패');
        } else {
          toast('error', '알 수 없는 오류가 발생했습니다!');
          console.log(error);
        }
      }
    };

    putData();
  };
  const { theme } = useTheme();

  return (
    <form onSubmit={handleSubmit}>
      <div className={`${styles[`box`]} ${styles[theme]}`}>
        <div className={styles[`password`]}>
          <label htmlFor='password' className={styles[`label`]}>
            현재 비밀번호
          </label>
          <PwdInput
            id='password'
            placeholder='비밀번호 입력'
            value={inputData.password}
            error={inputError.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
        <div className={styles[`password`]}>
          <label htmlFor='newPassword' className={styles[`label`]}>
            새 비밀번호
          </label>
          <PwdInput
            id='newPassword'
            placeholder='새 비밀번호 입력'
            value={inputData.newPassword}
            error={inputError.newPassword}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
        <div className={styles[`password`]}>
          <label htmlFor='newPasswordCheck' className={styles[`label`]}>
            새 비밀번호 확인
          </label>
          <PwdInput
            id='newPasswordCheck'
            placeholder='새 비밀번호 확인 입력'
            value={inputData.newPasswordCheck}
            error={inputError.newPasswordCheck}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
        <div className={styles[`button`]}>
          <Button
            buttonType='login'
            disabled={!checkValid(inputData, inputError)}
          >
            변경
          </Button>
        </div>
      </div>
    </form>
  );
}
