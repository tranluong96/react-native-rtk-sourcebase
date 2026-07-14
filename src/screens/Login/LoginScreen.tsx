import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ApplicationScreenProps } from 'types/navigation';
import { Input } from '@/components';
import useTheme from '@/hooks/useTheme';
import { reduxStorage } from '@/store';
import { TYPE_CONSTANT } from '@/utils/configs/const';
import { navigateAndSimpleReset } from '@/navigators/navigate_ext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = {
  email?: string;
  password?: string;
};

const LoginScreen = ({ navigation }: ApplicationScreenProps) => {
  const { t } = useTranslation(['login', 'common']);
  const { Layout, Gutters, Fonts, Common, Colors, FontSize } = useTheme();
  const insets = useSafeAreaInsets();

  // Accent color driven by the theme so it adapts to light/dark mode.
  const accent = Colors.circleButtonColor;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = t('login:errors.emailRequired');
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = t('login:errors.emailInvalid');
    }

    if (!password) {
      nextErrors.password = t('login:errors.passwordRequired');
    } else if (password.length < 6) {
      nextErrors.password = t('login:errors.passwordMin');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (loading || !validate()) {
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with a real authentication call.
      await reduxStorage.setItem(TYPE_CONSTANT.SESSION, '123');
      navigateAndSimpleReset(navigation, 'Main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[Layout.fill, { backgroundColor: Colors.white }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.white}
        translucent
      />
      <KeyboardAwareScrollView
        style={Layout.fill}
        contentContainerStyle={[
          Layout.scrollSpaceBetween,
          Gutters.regularHPadding,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        bottomOffset={24}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand */}
        <View style={[Layout.alignItemsCenter, Gutters.largeBMargin]}>
          <View
            style={[
              Layout.center,
              Gutters.smallBMargin,
              {
                height: 72,
                width: 72,
                borderRadius: 20,
                backgroundColor: accent,
              },
            ]}
          >
            <Text style={[Fonts.textBold, { color: Colors.white, fontSize: FontSize.regular }]}>
              {t('common:appName.initials')}
            </Text>
          </View>
          <Text style={[Fonts.titleSmall, Fonts.textCenter]}>
            {t('login:title')}
          </Text>
          <Text
            style={[
              Fonts.textSmall,
              Fonts.textLight,
              Fonts.textCenter,
              Gutters.tinyTMargin,
            ]}
          >
            {t('login:subtitle')}
          </Text>
        </View>

        {/* Form */}
        <View>
          {/* Email */}
          <Text style={[Fonts.textSmall, Fonts.textBold, Gutters.tinyBMargin]}>
            {t('login:emailLabel')}
          </Text>
          <Input
            email
            value={email}
            placeholder={t('login:emailPlaceholder')}
            error={errors.email}
            onChangeText={(text: string) => {
              setEmail(text);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: undefined }));
              }
            }}
          />
          {!!errors.email && (
            <Text style={[Fonts.textTiny, Fonts.textError, Gutters.tinyBMargin]}>
              {errors.email}
            </Text>
          )}

          {/* Password */}
          <Text
            style={[
              Fonts.textSmall,
              Fonts.textBold,
              Gutters.smallTMargin,
              Gutters.tinyBMargin,
            ]}
          >
            {t('login:passwordLabel')}
          </Text>
          <Input
            secure={!showPassword}
            value={password}
            placeholder={t('login:passwordPlaceholder')}
            error={errors.password}
            rightLabel={
              <Text style={[Fonts.textTiny, { color: accent }]}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            }
            rightStyle={{
              height: 40,
              width: 52,
              top: 8,
              paddingTop: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onRightPress={() => setShowPassword(prev => !prev)}
            onChangeText={(text: string) => {
              setPassword(text);
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: undefined }));
              }
            }}
          />
          {!!errors.password && (
            <Text style={[Fonts.textTiny, Fonts.textError, Gutters.tinyBMargin]}>
              {errors.password}
            </Text>
          )}

          {/* Forgot password */}
          <TouchableOpacity
            style={[Layout.alignItemsEnd, Gutters.smallTMargin]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[Fonts.textTiny, Fonts.textBold, { color: accent }]}>
              {t('login:forgotPassword')}
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading}
            onPress={onSubmit}
            style={[
              Common.button.rounded,
              Layout.fullWidth,
              Gutters.regularTMargin,
              { height: 52, backgroundColor: accent, opacity: loading ? 0.7 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={[Fonts.textSmall, Fonts.textBold, { color: Colors.white }]}>
                {t('login:signIn')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[Layout.rowCenter, Gutters.regularTMargin]}>
          <Text style={[Fonts.textSmall, Fonts.textLight]}>
            {t('login:noAccount')}{' '}
          </Text>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[Fonts.textSmall, Fonts.textBold, { color: accent }]}>
              {t('login:signUp')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;
