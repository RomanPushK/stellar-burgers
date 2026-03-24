import { TConstructorState } from 'src/services/types';
import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown,
  clearConstructor
} from '../src/services/slices/constructorSlice';
import { describe, expect, it, beforeEach } from '@jest/globals';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Помидор',
  type: 'main',
  proteins: 100,
  fat: 200,
  carbohydrates: 300,
  calories: 400,
  price: 500,
  image: '111.png',
  image_large: '222.png',
  image_mobile: '333.png'
};
const mockBun: TIngredient = {
  _id: '1',
  name: 'Мякиш',
  type: 'bun',
  proteins: 100,
  fat: 200,
  carbohydrates: 300,
  calories: 400,
  price: 500,
  image: '111.png',
  image_large: '222.png',
  image_mobile: '333.png'
};
const mockIngredients: TConstructorIngredient[] = [
  {
    id: '111111',
    __v: 0,
    _id: '1',
    name: 'Помидор',
    type: 'main',
    proteins: 100,
    fat: 200,
    carbohydrates: 300,
    calories: 400,
    price: 500,
    image: '111.png',
    image_large: '222.png',
    image_mobile: '333.png'
  },
  {
    id: '222222',
    __v: 0,
    _id: '2',
    name: 'Огурец',
    type: 'main',
    proteins: 1000,
    fat: 2000,
    carbohydrates: 3000,
    calories: 4000,
    price: 5000,
    image: '1111.png',
    image_large: '2222.png',
    image_mobile: '3333.png'
  },
  {
    id: '333333',
    __v: 0,
    _id: '3',
    name: 'Лук',
    type: 'main',
    proteins: 2000,
    fat: 3000,
    carbohydrates: 4000,
    calories: 5000,
    price: 6000,
    image: '11111.png',
    image_large: '22222.png',
    image_mobile: '33333.png'
  }
];

describe('Тестирование слайса конструктора бургера (constructorSlice)', () => {
  let initialState: TConstructorState;

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: [],
      isLoading: false,
      error: null
    };
  });

  it('Проверка неизвестного экшена', () => {
    const state = constructorReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('Проверка добавления ингредиента [addIngredient]', () => {
    const newIngredient = mockIngredient;

    const newIngredientCopy = { ...newIngredient };

    const state = constructorReducer(
      initialState,
      addIngredient(newIngredient)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(newIngredient);
    expect(state.ingredients[0].id).toBeDefined();
    expect(state.ingredients[0].__v).toBeDefined();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);

    expect(newIngredient).toEqual(newIngredientCopy);
  });

  it('Проверка добавления булки [addBun]', () => {
    const newBun = mockBun;

    const state = constructorReducer(initialState, addBun(newBun));

    expect(state.ingredients).toHaveLength(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toEqual(newBun);
  });

  it('Проверка удаления ингредиента [removeIngredient]', () => {
    const ingredient = mockIngredients;

    const stateBefore = { ...initialState, ingredients: ingredient };

    expect(stateBefore.ingredients).toHaveLength(3);

    const state = constructorReducer(stateBefore, removeIngredient('111111'));

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual(ingredient[1]);
    expect(state.ingredients[0].id).toBe('222222');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка неверного удаления ингредиента [removeIngredient]', () => {
    const ingredient = mockIngredients;

    const stateBefore = { ...initialState, ingredients: ingredient };

    expect(stateBefore.ingredients).toHaveLength(3);

    const state = constructorReducer(stateBefore, removeIngredient('555555'));

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients).toEqual(ingredient);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка перемещения ингредиента вверх [moveUp]', () => {
    const ingredient = mockIngredients;

    const state = constructorReducer(
      { ...initialState, ingredients: ingredient },
      moveUp(1)
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]).toEqual(ingredient[1]);
    expect(state.ingredients[1]).toEqual(ingredient[0]);
    expect(state.ingredients[2]).toEqual(ingredient[2]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка неверного перемещения ингредиента вверх [moveUp]', () => {
    const ingredient = mockIngredients;

    const state = constructorReducer(
      { ...initialState, ingredients: ingredient },
      moveUp(-1)
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]).toEqual(ingredient[0]);
    expect(state.ingredients[1]).toEqual(ingredient[1]);
    expect(state.ingredients[2]).toEqual(ingredient[2]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка неверного перемещения ингредиента вверх [moveUp]', () => {
    const ingredient = mockIngredients;

    const state = constructorReducer(
      { ...initialState, ingredients: ingredient },
      moveUp(3)
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]).toEqual(ingredient[0]);
    expect(state.ingredients[1]).toEqual(ingredient[1]);
    expect(state.ingredients[2]).toEqual(ingredient[2]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка перемещения ингредиента вниз [moveDown]', () => {
    const ingredient = mockIngredients;

    const state = constructorReducer(
      { ...initialState, ingredients: ingredient },
      moveDown(1)
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]).toEqual(ingredient[0]);
    expect(state.ingredients[1]).toEqual(ingredient[2]);
    expect(state.ingredients[2]).toEqual(ingredient[1]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка неверного перемещения ингредиента вниз [moveDown]', () => {
    const ingredient = mockIngredients;

    const state = constructorReducer(
      { ...initialState, ingredients: ingredient },
      moveDown(2)
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]).toEqual(ingredient[0]);
    expect(state.ingredients[1]).toEqual(ingredient[1]);
    expect(state.ingredients[2]).toEqual(ingredient[2]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка неверного перемещения ингредиента вниз [moveDown]', () => {
    const ingredient = mockIngredients;

    const state = constructorReducer(
      { ...initialState, ingredients: ingredient },
      moveDown(-1)
    );

    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0]).toEqual(ingredient[0]);
    expect(state.ingredients[1]).toEqual(ingredient[1]);
    expect(state.ingredients[2]).toEqual(ingredient[2]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });

  it('Проверка очищения ингредиентов [clearConstructor]', () => {
    const ingredient = mockIngredients;

    const state = constructorReducer(
      { ...initialState, ingredients: ingredient },
      clearConstructor()
    );

    expect(state.ingredients).toHaveLength(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.bun).toBe(null);
  });
});
