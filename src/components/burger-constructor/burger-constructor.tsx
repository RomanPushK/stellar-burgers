import { FC, useMemo } from 'react';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  constructorBunSelector,
  constructorIngredientsSelector,
  orderLoadingSelector,
  orderModalDataSelector,
  userSelector
} from '@selectors';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { clearConstructor, createOrder, setOrderModalData } from '@slices';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useSelector(constructorBunSelector);
  const ingredients = useSelector(constructorIngredientsSelector);
  const orderRequest = useSelector(orderLoadingSelector);
  const orderModalData = useSelector(orderModalDataSelector);
  const user = useSelector(userSelector);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((orderData) => {
        dispatch(setOrderModalData(orderData));
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Ошибка создания заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  const constructorItems = { bun, ingredients };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
