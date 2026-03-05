import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export interface BurgerConstructorUIProps {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  // handleMoveUp: (index: number) => void;
  // handleMoveDown: (index: number) => void;
  // handleClose: (id: string) => void;
}