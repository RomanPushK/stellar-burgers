import { FC, SyntheticEvent, useState, useEffect, useMemo } from 'react';
import { ProfileUI } from '@ui-pages';
import {
  useAppDispatch as useDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { userSelector } from '@selectors';
import { TRegisterData } from '@api';
import { updateUser } from '@slices';

export const Profile: FC = () => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  // Состояние формы
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Обновляем форму только один раз при загрузке пользователя
  useEffect(() => {
    if (user && (!formValue.name || !formValue.email)) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // Проверяем, изменилась ли форма
  const isFormChanged = useMemo(() => {
    if (!user) return false;
    return (
      formValue.name !== user.name ||
      formValue.email !== user.email ||
      !!formValue.password
    );
  }, [formValue, user]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // TODO: добавить логику сохранения
    const updatedData: Partial<TRegisterData> = {};

    if (formValue.name !== user?.name) {
      updatedData.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      updatedData.email = formValue.email;
    }
    if (formValue.password) {
      updatedData.password = formValue.password;
    }
    console.log('Сохранение данных:', formValue);

    // Отправляем запрос на обновление
    dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => {
        console.log('Данные успешно обновлены');
        // Очищаем поле пароля после успешного обновления
        setFormValue((prevState) => ({
          ...prevState,
          password: ''
        }));
      })
      .catch((error: any) => {
        console.error('Ошибка при обновлении данных:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleLogout={function (): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
};
