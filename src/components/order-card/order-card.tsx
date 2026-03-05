import { FC, memo, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector as useSelector } from '../../services/hooks';
import { ingredientsSelector } from '@selectors';
import { OrderCardProps } from './type';
import { TIngredient, TOrder } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const MAX_INGREDIENTS = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = useSelector(ingredientsSelector);

  const validatedOrder: TOrder = {
    _id: order._id || '',
    ingredients: order.ingredients || [],
    status: order.status || 'created',
    name: order.name || '',
    createdAt: order.createdAt || '',
    updatedAt: order.updatedAt || '',
    number: order.number || 0
  };

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = validatedOrder.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, MAX_INGREDIENTS);

    const remains =
      ingredientsInfo.length > MAX_INGREDIENTS
        ? ingredientsInfo.length - MAX_INGREDIENTS
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  const handleClick = () => {
    const basePath = location.pathname.includes('/profile')
      ? '/profile/orders'
      : '/feed';

    navigate(`${basePath}/${order.number}`, {
      state: { background: location }
    });
  };

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
      onClick={handleClick}
    />
  );
});
