import { describe, expect, jest, afterAll, beforeEach } from '@jest/globals';
import { fetchIngredients } from '@slices';
import ingredientsReducer, { initialState } from '../src/services/slices/ingredientsSlice';
import { TIngredientsState } from 'src/services/types';
import * as api from '@api';
import { store } from '../src/services';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Крафтовая булка Самопал Марс',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '1.png',
    image_mobile: '2.png',
    image_large: '3.png'
  }
];

describe('Тестирование слайса ингредиентов (ingredientsSlice)', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('тест [fetchIngredients.pending]', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [fetchIngredients.fulfilled]', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('тест [fetchIngredients.rejected]', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка запроса ингредиентов'
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.ingredients).toEqual(initialState.ingredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка запроса ингредиентов');
  });

  it('тест асинхронного экшена [fetchIngredients]', async () => {
    const getIngredientsSpy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockResolvedValue(mockIngredients);

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
