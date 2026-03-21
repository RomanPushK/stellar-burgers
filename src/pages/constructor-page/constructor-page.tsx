import { FC } from 'react';
import { useSelector } from '../../services';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '@components';
import { ingredientsSelector } from '@selectors';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredients = useSelector(ingredientsSelector);
  // Если ингредиенты не загружены, компонент не рендерится
  // Прелоадер показывается в App компоненте
  if (ingredients.length === 0) {
    return null;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
