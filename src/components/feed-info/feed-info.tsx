import { FC } from 'react';
import { useAppSelector as useSelector } from '../../services/hooks';
import {
  feedOrdersSelector,
  feedTotalSelector,
  feedTotalTodaySelector
} from '@selectors';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(feedOrdersSelector);
  const total = useSelector(feedTotalSelector);
  const totalToday = useSelector(feedTotalTodaySelector);
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  const feed = {
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
