import React, { useEffect } from 'react';
import {
  View,
  Alert,
  Button,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks';
import { useLazyFetchOneQuery } from '@/services/modules/users';
import { changeTheme, ThemeState } from '@/store/theme';
import { Header } from '@/components';
import i18next from 'i18next';
import { ApplicationScreenProps } from 'types/navigation';

const ProfileScreen = ({ navigation, route }: ApplicationScreenProps) => {
  const { t } = useTranslation(['example', 'welcome']);
  const {
    Common,
    Fonts,
    Gutters,
    Layout,
    Images,
    darkMode: isDark,
  } = useTheme();
  const dispatch = useDispatch();
  let message = route.params?.message

  const [fetchOne, { data, isSuccess, isLoading, isFetching }] =
    useLazyFetchOneQuery();

  useEffect(() => {
    if (isSuccess && data?.name) {
      Alert.alert(t('example:helloUser', { name: data.name }));
    }
  }, [isSuccess, data]);

  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }));
  };

  const onChangeLanguage = (lang: 'fr' | 'en') => {
    i18next.changeLanguage(lang);
  };

  return (
    <View>
      <Header title={"Profile"} />
      <Button
        title="Go Example2Screen"
        onPress={() => navigation.navigate("Example2")}
      />
    </View>
  );
};

export default ProfileScreen;
