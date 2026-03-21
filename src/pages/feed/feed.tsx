import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { fetchFeeds } from '@slices';
import { feedOrdersSelector } from '@selectors';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(feedOrdersSelector);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
