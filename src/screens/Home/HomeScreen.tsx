import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks';
import {
  decrementBadge,
  incrementBadge,
  NotificationState,
} from '@/store/notification';
import { Header, Input, ConfirmModal, ActionModal, BaseBTSheet } from '@/components';
import { ApplicationScreenProps } from 'types/navigation';
import { K_SCREEN_HEIGHT } from '@/utils/configs/screens';
import { reduxStorage } from '@/store';
import { TYPE_CONSTANT } from '@/utils/configs/const';
import { navigateAndSimpleReset } from '@/navigators/navigate_ext';
import DPButton from '@/components/Button/DPButton';

type ThemeColors = ReturnType<typeof useTheme>['Colors'];
type Styles = ReturnType<typeof getStyles>;

type SectionProps = {
  styles: Styles;
  title: string;
  caption?: string;
  children: React.ReactNode;
};

type RowProps = {
  styles: Styles;
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isLast?: boolean;
};

const Section = ({ styles, title, caption, children }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}
    <View style={styles.card}>{children}</View>
  </View>
);

const Row = ({ styles, icon, title, subtitle, onPress, isLast }: RowProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.row, !isLast && styles.rowDivider]}
  >
    <View style={styles.rowIcon}>
      <Text style={styles.rowIconText}>{icon}</Text>
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }: ApplicationScreenProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isOpenAction, setIsOpenAction] = React.useState<boolean>(false);
  const { Layout, Colors, Fonts, Gutters } = useTheme();
  const dispatch = useDispatch();
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const amountBadge = useSelector(
    (state: { notification: NotificationState }) => state.notification.amountBadge,
  );

  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  //on handle logOut
  const onHandleLogOut = async () => {
    await reduxStorage.removeItem(TYPE_CONSTANT.SESSION);
    navigateAndSimpleReset(navigation, 'Login');
  };

  const handleIncrementBadge = () => {
    dispatch(incrementBadge({ amountBadge }));
  };

  const handleDecrementBadge = () => {
    dispatch(decrementBadge());
  };

  const openSheet = () => bottomSheetRef.current?.expand();

  const renderRightHeader = () => (
    <TouchableOpacity onPress={onHandleLogOut} style={styles.logout}>
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );

  const renderLeftHeader = () => (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>RN</Text>
    </View>
  );

  return (
    <View style={[Layout.fill, styles.screen]}>
      <Header
        title="Home"
        rightHeader={renderRightHeader()}
        leftHeader={renderLeftHeader()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <Text style={styles.heroGreeting}>Welcome back 👋</Text>
          <Text style={styles.heroTitle}>React Native Base</Text>
          <Text style={styles.heroSubtitle}>
            A playground of the components, navigation and state wired into this
            starter.
          </Text>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>{amountBadge} notifications</Text>
          </View>
        </View>

        <Input placeholder="Search components..." style={styles.search} />

        <Section
          styles={styles}
          title="Navigation"
          caption="Screens reachable from here"
        >
          <Row
            styles={styles}
            icon="👤"
            title="Profile"
            subtitle="Passes a message through route params"
            onPress={() =>
              navigation.navigate('Profile', { message: 'Message from Home' })
            }
          />
          <Row
            styles={styles}
            icon="🧪"
            title="Example"
            subtitle="Sandbox screen inside the Home stack"
            onPress={() => navigation.navigate('Example')}
            isLast
          />
        </Section>

        <Section styles={styles} title="Overlays" caption="Modals and bottom sheets">
          <Row
            styles={styles}
            icon="✅"
            title="Confirm modal"
            subtitle="Single action, dismiss on save"
            onPress={() => setIsOpen(true)}
          />
          <Row
            styles={styles}
            icon="⚡️"
            title="Action modal"
            subtitle="Save or cancel"
            onPress={() => setIsOpenAction(true)}
          />
          <Row
            styles={styles}
            icon="📄"
            title="Bottom sheet"
            subtitle="Gorhom sheet at half screen height"
            onPress={openSheet}
            isLast
          />
        </Section>

        <Section
          styles={styles}
          title="State"
          caption="Redux store, persisted with MMKV"
        >
          <View style={styles.counterRow}>
            <View style={Layout.fill}>
              <Text style={styles.rowTitle}>Badge count</Text>
              <Text style={styles.rowSubtitle}>Drives the tab bar badge</Text>
            </View>
            <TouchableOpacity
              style={styles.stepper}
              onPress={handleDecrementBadge}
            >
              <Text style={styles.stepperText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{amountBadge}</Text>
            <TouchableOpacity
              style={[styles.stepper, styles.stepperPrimary]}
              onPress={handleIncrementBadge}
            >
              <Text style={[styles.stepperText, styles.stepperTextPrimary]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </Section>

        <Section
          styles={styles}
          title="Native"
          caption="Fabric component written in C++/Kotlin"
        >
          <View style={Gutters.tinyPadding}>
            <DPButton
              title="Go to Profile (Fabric)"
              color={Colors.white}
              backgroundColor={Colors.brand}
              onPress={() =>
                navigation.navigate('Profile', { message: 'Message from Home' })
              }
              style={styles.fabricButton}
            />
          </View>
        </Section>

        <Text style={[Fonts.textTiny, Fonts.textCenter, styles.footer]}>
          Dipro · React Native Base
        </Text>
      </ScrollView>

      <ConfirmModal
        isOpen={isOpen}
        title="Confirm Modal"
        onSave={() => setIsOpen(false)}
        message="Show modal confirm"
      />
      <ActionModal
        isOpen={isOpenAction}
        title="Action Modal"
        onSave={() => setIsOpenAction(false)}
        onCancel={() => setIsOpenAction(false)}
        message="Show modal Action"
      />
      <BaseBTSheet
        bottomSheetRef={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
        children={
          <View style={[Layout.fill, styles.sheet]}>
            <Text style={styles.sheetTitle}>Bottom sheet</Text>
            <Text style={styles.rowSubtitle}>
              Drag it down or tap the backdrop to close.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const getStyles = (Colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      backgroundColor: Colors.background,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    /* Header */
    logout: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: Colors.brandSoft,
    },
    logoutText: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.brand,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.brand,
    },
    avatarText: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.white,
    },
    /* Hero */
    hero: {
      padding: 20,
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: Colors.brand,
    },
    heroGreeting: {
      fontSize: 13,
      color: Colors.white,
      opacity: 0.8,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: '700',
      marginTop: 2,
      color: Colors.white,
    },
    heroSubtitle: {
      fontSize: 13,
      lineHeight: 19,
      marginTop: 6,
      color: Colors.white,
      opacity: 0.85,
    },
    badgePill: {
      alignSelf: 'flex-start',
      marginTop: 14,
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
    badgePillText: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.white,
    },
    search: {
      marginBottom: 20,
      borderRadius: 12,
      backgroundColor: Colors.card,
      borderColor: Colors.border,
    },
    /* Sections */
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.textGray800,
    },
    sectionCaption: {
      fontSize: 12,
      marginTop: 2,
      marginBottom: 10,
      color: Colors.textGray200,
    },
    card: {
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
    },
    /* Rows */
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.brandSoft,
    },
    rowIconText: {
      fontSize: 18,
    },
    rowBody: {
      flex: 1,
    },
    rowTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.textGray800,
    },
    rowSubtitle: {
      fontSize: 12,
      marginTop: 2,
      color: Colors.textGray200,
    },
    chevron: {
      fontSize: 22,
      marginLeft: 8,
      color: Colors.textGray200,
    },
    /* Counter */
    counterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 14,
    },
    stepper: {
      width: 34,
      height: 34,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.brandSoft,
    },
    stepperPrimary: {
      backgroundColor: Colors.brand,
    },
    stepperText: {
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 22,
      color: Colors.brand,
    },
    stepperTextPrimary: {
      color: Colors.white,
    },
    counterValue: {
      minWidth: 40,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      color: Colors.textGray800,
    },
    /* Native */
    fabricButton: {
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      marginTop: 8,
      color: Colors.textGray200,
    },
    /* Sheet */
    sheet: {
      height: K_SCREEN_HEIGHT / 2,
      padding: 20,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 4,
      color: Colors.textGray800,
    },
  });

export default HomeScreen;
