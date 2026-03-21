import { FC, SyntheticEvent, useState, useEffect } from 'react';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/slices/userSlice';
import { userSelector, userErrorSelector } from '@selectors';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(userSelector);
  const error = useSelector(userErrorSelector);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      const from = location.state?.from || { pathname: '/' };
      navigate(from.pathname, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
