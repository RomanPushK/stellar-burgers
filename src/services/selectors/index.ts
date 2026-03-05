import { RootState } from '../types';

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isLoading;
export const ingredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;

export const constructorBunSelector = (state: RootState) =>
  state.constructorBurger.bun;
export const constructorIngredientsSelector = (state: RootState) =>
  state.constructorBurger.ingredients;
export const constructorLoadingSelector = (state: RootState) =>
  state.constructorBurger.isLoading;

export const orderSelector = (state: RootState) => state.order.order;
export const orderLoadingSelector = (state: RootState) => state.order.isLoading;
export const orderErrorSelector = (state: RootState) => state.order.error;
export const userOrdersSelector = (state: RootState) => state.user.orders;
export const orderModalDataSelector = (state: RootState) =>
  state.order.modalData;

export const userSelector = (state: RootState) => state.user.user;
export const userLoadingSelector = (state: RootState) => state.user.isLoading;
export const userErrorSelector = (state: RootState) => state.user.error;
export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;

export const feedOrdersSelector = (state: RootState) => state.feed.orders;
export const feedTotalSelector = (state: RootState) => state.feed.total;
export const feedTotalTodaySelector = (state: RootState) =>
  state.feed.totalToday;
export const feedLoadingSelector = (state: RootState) => state.feed.isLoading;
