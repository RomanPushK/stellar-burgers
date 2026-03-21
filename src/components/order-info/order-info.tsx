import { FC, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector as useSelector } from '../../services/hooks';
import { ingredientsSelector } from '@selectors';
import { getOrderByNumberApi } from '@api';
import { OrderInfoUI } from '@ui';
import { Preloader } from '@ui';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const [order, setOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const ingredients = useSelector(ingredientsSelector);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        let orderData: TOrder | null = null;

        if (number) {
          const response = await getOrderByNumberApi(parseInt(number, 10));
          if (
            response.success &&
            response.orders &&
            response.orders.length > 0
          ) {
            orderData = response.orders[0];
          }
        }

        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
