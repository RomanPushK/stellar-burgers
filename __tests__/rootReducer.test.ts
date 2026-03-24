import { rootReducer } from '../src/services/rootReducer';
import { describe, expect, it } from '@jest/globals';
import { createStore } from '@reduxjs/toolkit';

describe('Тестирование инициализации стора', () => {
  const store = createStore(rootReducer);
  const state = store.getState();

  it('Проверка [ingredients]', () => {
    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('Проверка [constructorBurger]', () => {
    expect(state.constructorBurger).toEqual({
      bun: null,
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('Проверка [order]', () => {
    expect(state.order).toEqual({
      order: null,
      isLoading: false,
      error: null,
      modalData: null
    });
  });

  it('Проверка [user]', () => {
    expect(state.user).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthChecked: false,
      orders: []
    });
  });

  it('Проверка [feed]', () => {
    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });
});
