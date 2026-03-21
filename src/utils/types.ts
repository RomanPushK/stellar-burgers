export type TOrder = {
  _id: string;
  ingredients: string[];
  status: 'created' | 'pending' | 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type TUser = {
  user: { email: string; name: string } | null;
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'main' | 'sauce';

export type TIngredient = {
  _id: string;
  name: string;
  type: TTabMode;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  __v: number;
  id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  email: string;
  password: string;
  name: string;
};

export type TFeedsResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TServerResponse<T> = {
  success: boolean;
} & T;

export type TOrdersResponse = TServerResponse<{
  orders: TOrder[];
}>;

export type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;
