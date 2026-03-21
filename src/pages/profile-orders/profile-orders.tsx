import { FC, useEffect } from 'react';
import {
  useDispatch,
  userErrorSelector,
  userLoadingSelector,
  userOrdersSelector,
  userSelector,
  useSelector
} from '../../services';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '@slices';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const orders = useSelector(userOrdersSelector);
  const isLoading = useSelector(userLoadingSelector);
  const error = useSelector(userErrorSelector);

  useEffect(() => {
    // Перенаправляем если пользователь не авторизован
    if (!user) {
      navigate('/login');
      return;
    }

    if (user) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user, navigate]);

  // Показываем прелоадер при загрузке
  if (isLoading) {
    return <Preloader />;
  }

  // Показываем ошибку если есть
  if (error) {
    console.error('Ошибка загрузки заказов:', error);
    return <div>Ошибка загрузки заказов</div>;
  }

  return <ProfileOrdersUI orders={orders || []} />;
};
