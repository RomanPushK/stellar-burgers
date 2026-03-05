import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector as useSelector } from '../../services/hooks';
import { userSelector } from '@selectors';

export const AppHeader: FC = () => {
  const user = useSelector(userSelector);

  return <AppHeaderUI userName={user?.name || ''} />;
};
