import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { userSelector, userErrorSelector } from '@selectors';
import { RegisterUI } from '@ui-pages';
import { clearError, registerUser } from '@slices';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(userSelector);
  const error = useSelector(userErrorSelector);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Очищаем ошибку при размонтировании
  useEffect(
    () => () => {
      dispatch(clearError());
    },
    [dispatch]
  );

  // Перенаправляем если пользователь уже авторизован
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (userName && email && password) {
      dispatch(registerUser({ name: userName, email, password }));
    }
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
    />
  );
};
