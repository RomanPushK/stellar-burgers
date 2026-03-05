import { FC, SyntheticEvent, useState, useEffect } from 'react';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/slices/userSlice';
import { userErrorSelector } from '@selectors';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(userErrorSelector);

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email) {
      dispatch(forgotPassword(email))
        .unwrap()
        .then(() => {
          setIsSubmitted(true);
          localStorage.setItem('resetPassword', 'true');
          navigate('/reset-password');
        });
    }
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
