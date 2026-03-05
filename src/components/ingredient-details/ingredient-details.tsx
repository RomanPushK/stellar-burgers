import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector as useSelector } from '../../services/hooks';
import { ingredientsSelector } from '@selectors';
import { IngredientDetailsUI } from '@ui';
import { Preloader } from '@ui';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ingredients = useSelector(ingredientsSelector);
  const [ingredient, setIngredient] = useState<TIngredient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ingredients.length > 0 && id) {
      const foundIngredient = ingredients.find((item) => item._id === id);
      if (foundIngredient) {
        setIngredient(foundIngredient);
      } else {
        navigate('/404');
      }
    }
    setLoading(false);
  }, [id, ingredients, navigate]);

  if (loading) {
    return <Preloader />;
  }

  if (!ingredient) {
    return <div>Ингредиент не найден</div>;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
