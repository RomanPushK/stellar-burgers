import { FC, SyntheticEvent, useState, useEffect } from 'react';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { useNavigate } from 'react-router-dom';
import { userErrorSelector } from '@selectors';
import { ResetPasswordUI } from '@ui-pages';
import { resetPassword } from '@slices';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(userErrorSelector);

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  // Проверяем, можно ли сбрасывать пароль
  useEffect(() => {
    const canReset = localStorage.getItem('resetPassword');
    if (!canReset) {
      navigate('/forgot-password', { replace: true });
    }
  }, [dispatch, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (password && token) {
      dispatch(resetPassword({ password, token }))
        .unwrap()
        .then(() => {
          localStorage.removeItem('resetPassword');
          navigate('/login');
        });
    }
  };

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
