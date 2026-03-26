import {
  describe,
  expect,
  jest,
  afterAll,
  beforeEach,
  afterEach,
  it
} from '@jest/globals';
import * as api from '@api';
import userReducer, {
  setAuthChecked,
  clearUser,
  clearError,
  loginUser,
  registerUser,
  logoutUser,
  fetchUser,
  updateUser,
  fetchUserOrders,
  forgotPassword,
  resetPassword,
  initialState
} from '../src/services/slices/userSlice';
import { TUserState } from 'src/services/types';
import { TLoginData, TOrder, TUser } from '@utils-types';
import { configureStore } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../src/utils/cookie';

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

const mockUser: TUser = {
  user: { email: 'pushkarevromana@gmail.com', name: 'kr1spy' },
  email: 'pushkarevromana@gmail.com',
  name: 'kr1spy'
};

const mockLogin: TLoginData = {
  email: 'kr1spy@gmail.com',
  password: '123'
};

jest.mock('../src/utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

let store = configureStore({ reducer: { user: userReducer } });

describe('Тестирование слайса пользователя (userSlice)', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({ reducer: { user: userReducer } });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('тест экшена setAuthChecked', () => {
    const state = userReducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест экшена clearUser', () => {
    const state = userReducer(
      {
        ...initialState,
        user: mockUser
      },
      clearUser()
    );
    expect(state.user).toBeNull();
  });

  it('тест экшена clearError', () => {
    const state = userReducer(
      { ...initialState, error: 'Ошибка логина' },
      clearError()
    );
    expect(state.error).toBeNull();
  });

  it('тест [loginUser.pending]', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [loginUser.fulfilled]', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест [loginUser.rejected]', () => {
    const action = {
      type: loginUser.rejected.type,
      payload: 'Ошибка логина'
    };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка логина');
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест асинхронного экшена [loginUser]', async () => {
    const mockApiResponse: api.TAuthResponse = {
      success: true,
      refreshToken: '123',
      accessToken: '321',
      user: mockUser
    };

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const loginUserSpy = jest
      .spyOn(api, 'loginUserApi')
      .mockResolvedValue(mockApiResponse);

    await store.dispatch(loginUser(mockLogin));

    const state = store.getState().user;

    expect(loginUserSpy).toHaveBeenCalledWith(mockLogin);
    expect(setCookie).toHaveBeenCalledWith('accessToken', '321');
    expect(setItemSpy).toHaveBeenCalledWith('refreshToken', '123');
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест [registerUser.pending]', () => {
    const action = { type: registerUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [registerUser.fulfilled]', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест [registerUser.rejected]', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: 'Ошибка регистрации'
    };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест асинхронного экшена [registerUser]', async () => {
    const mockApiResponse: api.TAuthResponse = {
      success: true,
      refreshToken: '123',
      accessToken: '321',
      user: mockUser
    };

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const registerUserSpy = jest
      .spyOn(api, 'registerUserApi')
      .mockResolvedValue(mockApiResponse);

    await store.dispatch(registerUser({ ...mockLogin, name: 'kr1spy' }));

    const state = store.getState().user;

    expect(registerUserSpy).toHaveBeenCalledWith({
      ...mockLogin,
      name: 'kr1spy'
    });
    expect(state.user).toEqual(mockUser);
    expect(setCookie).toHaveBeenCalledWith('accessToken', '321');
    expect(setItemSpy).toHaveBeenCalledWith('refreshToken', '123');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест [logoutUser.fulfilled]', () => {
    const action = {
      type: logoutUser.fulfilled.type
    };
    const state = userReducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [logoutUser.rejected]', () => {
    const action = {
      type: logoutUser.rejected.type
    };
    const state = userReducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест асинхронного экшена [logoutUser]', async () => {
    const mockApiResponse = {
      success: true
    };

    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('123');
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    const logoutUserSpy = jest
      .spyOn(api, 'logoutApi')
      .mockResolvedValue(mockApiResponse);

    await store.dispatch(logoutUser());

    const state = store.getState().user;

    expect(getItemSpy).toHaveBeenCalledWith('refreshToken');
    expect(getItemSpy).toHaveReturnedWith('123');
    expect(deleteCookie).toHaveBeenCalledWith('accessToken');
    expect(removeItemSpy).toHaveBeenCalledWith('refreshToken');
    expect(logoutUserSpy).toHaveBeenCalledWith();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест [fetchUser.pending]', () => {
    const action = { type: fetchUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [fetchUser.fulfilled]', () => {
    const action = {
      type: fetchUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест [fetchUser.rejected]', () => {
    const action = {
      type: fetchUser.rejected.type,
      payload: 'Ошибка получения пользователя'
    };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка получения пользователя');
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toBeNull();
  });

  it('тест асинхронного экшена [fetchUser]', async () => {
    const mockApiResponse: api.TUserResponse = {
      success: true,
      user: mockUser
    };

    const fetchUserSpy = jest
      .spyOn(api, 'getUserApi')
      .mockResolvedValue(mockApiResponse);

    await store.dispatch(fetchUser());

    const state = store.getState().user;

    expect(fetchUserSpy).toHaveBeenCalledWith();
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('тест [updateUser.pending]', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [updateUser.fulfilled]', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer(initialState, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('тест [updateUser.rejected]', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: 'Ошибка обновления'
    };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка обновления');
  });

  it('тест асинхронного экшена [updateUser]', async () => {
    const mockApiResponse: api.TUserResponse = {
      success: true,
      user: mockUser
    };

    const spy = jest
      .spyOn(api, 'updateUserApi')
      .mockResolvedValue(mockApiResponse);

    await store.dispatch(updateUser({ name: 'newName' }));

    const state = store.getState().user;

    expect(spy).toHaveBeenCalled();
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
  });

  it('тест [fetchUserOrders.pending]', () => {
    const action = { type: fetchUserOrders.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('тест [fetchUserOrders.fulfilled]', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = userReducer(initialState, action);

    expect(state.orders).toEqual(mockOrders);
    expect(state.isLoading).toBe(false);
  });

  it('тест [fetchUserOrders.rejected]', () => {
    const action = {
      type: fetchUserOrders.rejected.type,
      payload: 'Ошибка заказов'
    };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка заказов');
  });

  it('тест асинхронного экшена [fetchUserOrders]', async () => {
    const spy = jest.spyOn(api, 'getOrdersApi').mockResolvedValue(mockOrders);

    await store.dispatch(fetchUserOrders());

    const state = store.getState().user;

    expect(spy).toHaveBeenCalled();
    expect(state.orders).toEqual(mockOrders);
  });

  it('тест [forgotPassword.fulfilled]', () => {
    const action = { type: forgotPassword.fulfilled.type };
    const state = userReducer({ ...initialState, error: 'error' }, action);

    expect(state.error).toBeNull();
  });

  it('тест [forgotPassword.rejected]', () => {
    const action = {
      type: forgotPassword.rejected.type,
      payload: 'Ошибка'
    };
    const state = userReducer(initialState, action);

    expect(state.error).toBe('Ошибка');
  });

  it('тест асинхронного экшена [forgotPassword]', async () => {
    const spy = jest
      .spyOn(api, 'forgotPasswordApi')
      .mockResolvedValue({ success: true });

    await store.dispatch(forgotPassword('test@test.com'));

    expect(spy).toHaveBeenCalled();
  });

  it('тест [resetPassword.fulfilled]', () => {
    const action = { type: resetPassword.fulfilled.type };
    const state = userReducer({ ...initialState, error: 'error' }, action);

    expect(state.error).toBeNull();
  });

  it('тест [resetPassword.rejected]', () => {
    const action = {
      type: resetPassword.rejected.type,
      payload: 'Ошибка'
    };
    const state = userReducer(initialState, action);

    expect(state.error).toBe('Ошибка');
  });

  it('тест асинхронного экшена [resetPassword]', async () => {
    const spy = jest
      .spyOn(api, 'resetPasswordApi')
      .mockResolvedValue({ success: true });

    await store.dispatch(resetPassword({ password: '123', token: 'token' }));

    expect(spy).toHaveBeenCalled();
  });
});
