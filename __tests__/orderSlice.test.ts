import {
  describe,
  expect,
  jest,
  afterAll,
  beforeEach,
  it
} from '@jest/globals';
import orderReducer, {
  createOrder,
  setOrderModalData,
  clearOrder
} from '../src/services/slices/orderSlice';
import { TOrderState } from 'src/services/types';
import * as api from '@api';
import { store } from '../src/services';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '123',
  ingredients: ['ing1', 'ing2'],
  status: 'done',
  name: 'Cheeseburger',
  createdAt: '20:22',
  updatedAt: '20:31',
  number: 777
};

describe('Тестирование слайса заказа (orderSlice)', () => {
  const initialState: TOrderState = {
    order: null,
    isLoading: false,
    error: null,
    modalData: null
  };

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('тест экшена setOrderModalData', () => {
    const state = orderReducer(initialState, setOrderModalData(mockOrder));
    expect(state.modalData).toEqual(mockOrder);
  });

  it('тест экшена clearOrder', () => {
    const stateWithOrder = { ...initialState, order: mockOrder };
    const state = orderReducer(stateWithOrder, clearOrder());
    expect(state.order).toBeNull();
  });

  it('тест [createOrder.pending]', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [createOrder.fulfilled]', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);
    expect(state.order).toEqual(mockOrder);
    expect(state.isLoading).toBe(false);
  });

  it('тест [createOrder.rejected]', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка создания заказа' }
    };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
  });

  it('тест асинхронного экшена [createOrder]', async () => {
    const mockApiResponse = {
      success: true,
      name: 'Cheeseburger',
      order: mockOrder
    };

    const createOrderSpy = jest
      .spyOn(api, 'orderBurgerApi')
      .mockResolvedValue(mockApiResponse);

    const ingredientsIds = ['ing1', 'ing2'];
    await store.dispatch(createOrder(ingredientsIds));

    const state = store.getState().order;

    expect(createOrderSpy).toHaveBeenCalledWith(ingredientsIds);
    expect(state.order).toEqual(mockOrder);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
