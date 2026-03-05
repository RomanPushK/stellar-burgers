import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch as useDispatch } from '../../services/hooks';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '@slices';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Ошибка при выходе из системы:', error);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
