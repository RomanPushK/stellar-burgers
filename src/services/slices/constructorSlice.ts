import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { TConstructorIngredient, TConstructorState } from '../types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  isLoading: false,
  error: null
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push({ ...action.payload });
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid(),
          __v: 0
        }
      })
    },

    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },

    moveDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
