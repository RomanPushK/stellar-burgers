import { describe, expect, jest, afterAll, beforeEach } from '@jest/globals';
import { fetchFeeds } from '@slices';
import feedReducer, { initialState } from '../src/services/slices/feedSlice';
import { TFeedState } from 'src/services/types';
import * as api from '@api';
import { store } from '../src/services';
import { TFeedsResponse, TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['643d69a5c3f7b9001cfa093c'],
    status: 'created' as const,
    name: 'Space Burger',
    createdAt: '20:21',
    updatedAt: '20:31',
    number: 354
  }
];

const mockResponse: TFeedsResponse = {
  success: true,
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('Тестирование слайса ленты (feedSlice)', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('тест [fetchFeeds.pending]', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [fetchFeeds.fulfilled]', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: mockResponse
    };
    const state = feedReducer(initialState, action);

    expect(state.orders).toEqual(mockResponse.orders);
    expect(state.total).toBe(mockResponse.total);
    expect(state.totalToday).toBe(mockResponse.totalToday);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('тест [fetchFeeds.rejected]', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка запроса ленты заказов' }
    };
    const state = feedReducer(initialState, action);

    expect(state.orders).toEqual(initialState.orders);
    expect(state.total).toBe(initialState.total);
    expect(state.totalToday).toBe(initialState.totalToday);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка запроса ленты заказов');
  });

  it('тест асинхронного экшена [fetchFeeds]', async () => {
    const getFeedsSpy = jest
      .spyOn(api, 'getFeedsApi')
      .mockResolvedValue(mockResponse);

    await store.dispatch(fetchFeeds());

    const state = store.getState().feed;
    expect(getFeedsSpy).toHaveBeenCalledTimes(1);
    expect(state.orders).toEqual(mockOrders);
    expect(state.isLoading).toBe(false);
    expect(state.total).toBe(mockResponse.total);
    expect(state.error).toBeNull();
  });
});
