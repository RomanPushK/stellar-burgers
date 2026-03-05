import {
  TIngredient,
  TOrder,
  TUser,
  TConstructorIngredient
} from '@utils-types';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  isLoading: boolean;
  error: string | null;
};

export type TOrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
  modalData: TOrder | null;
};

export type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  orders: TOrder[];
};

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export type RootState = {
  ingredients: TIngredientsState;
  constructorBurger: TConstructorState;
  order: TOrderState;
  user: TUserState;
  feed: TFeedState;
};
export type { TConstructorIngredient };
