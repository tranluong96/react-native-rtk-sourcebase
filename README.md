# React Native Base (Dipro)

Bộ khung (base) React Native dùng chung cho các dự án tại Dipro. Dựng sẵn theo kiến trúc module hóa: theme/dark-mode, đa ngôn ngữ, state management, cancel request, push notification, điều hướng và CI/CD — bắt đầu dự án mới chỉ việc clone và viết feature.

| | |
|---|---|
| **React Native** | 0.86.0 (New Architecture / Fabric) |
| **React** | 19.2.3 |
| **Node** | >= 22.11.0 |

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Mô hình](#2-mô-hình)
3. [Struct folder](#3-struct-folder)
4. [State management](#4-state-management)
5. [Cancel request](#5-cancel-request)
6. [Install](#6-install)
7. [Run](#7-run)
8. [Build & Deploy](#8-build--deploy)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Tổng quan

| Hạng mục | Công nghệ |
|----------|-----------|
| Core | React Native **0.86.0**, React **19**, TypeScript, **New Architecture (Fabric)** |
| State management | **Redux Toolkit** + **RTK Query** + **redux-persist** (lưu qua **MMKV**) |
| Networking | RTK Query `fetchBaseQuery` + **cancel bằng `AbortSignal`** (xem [mục 5](#5-cancel-request)) |
| Navigation | `@react-navigation` — Stack + Bottom Tabs |
| Theming | Design system tự viết (`src/theme`) — hỗ trợ **light/dark** & đa theme |
| i18n | `i18next` + `react-i18next` — sẵn **en** / **jp** |
| Push notification | `@react-native-firebase/messaging` + `@notifee/react-native` |
| Native module | Component Fabric mẫu **DPButton** (`src/specs`, `src/components/Button`) |
| Khác | Biometrics, Permissions, Bottom Sheet, Keyboard Controller, App update checker |
| CI/CD | **Fastlane** (DeployGate / Play Store / TestFlight / App Store) |

Alias import: `@/*` → `src/*`, `types/*` → `@types/*` (cấu hình ở `babel.config.js` & `tsconfig.json`).

---

## 2. Mô hình

### 2.1. Kiến trúc phân tầng

Dữ liệu chỉ đi theo **một chiều**. Screen không bao giờ gọi thẳng `fetch`; mọi request đều xuống qua RTK Query để được hưởng cache, offline-guard và cancel.

```
┌──────────────────────────────────────────────────────────┐
│  screens/          Chỉ render + gọi hook. Không fetch.   │
└─────────────┬────────────────────────────────────────────┘
              │  useTheme  useScreenRequest  useFileTransfer
┌─────────────▼────────────────────────────────────────────┐
│  hooks/            Vòng đời request, cancel, side-effect │
└─────────────┬────────────────────────────────────────────┘
              │  useLazyXxxQuery()  useXxxMutation()
┌─────────────▼────────────────────────────────────────────┐
│  services/modules/<resource>/     Endpoint theo resource │
│  services/api.ts                  baseQuery dùng chung   │
│      ├── chặn request khi offline  (đọc slice network)   │
│      ├── xử lý 401 / refresh token                       │
│      └── chuẩn hoá lỗi cancel  → CANCELLED               │
└─────────────┬────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────┐
│  store/            Redux Toolkit + redux-persist (MMKV)  │
└──────────────────────────────────────────────────────────┘
```

### 2.2. Vòng đời một request

Điểm khác biệt của base này so với một app RTK Query thông thường: **mọi request đều gắn với vòng đời của màn hình**, và huỷ giữa chừng là trạng thái hợp lệ chứ không phải lỗi.

```
   Screen gọi run(trigger(arg))
              │
              ├─ hook lưu lại request  →  isPending = true
              │
              ▼
   baseQuery ─── signal đã abort? ──yes──►  { status: 'CANCELLED' }
              │                                      │
              no                                     │
              ▼                                      │
        offline? ──yes──►  { FETCH_ERROR }           │
              │                                      │
              no                                     │
              ▼                                      │
           fetch(signal)                             │
              │                                      │
    ┌─────────┼─────────┐                            │
    ▼         ▼         ▼                            │
 success   lỗi thật   bị abort ─────────────────────►┤
    │         │                                      │
    │         ▼                                      ▼
    │   Alert(message)                      im lặng, không Alert
    ▼
 render data
```

Ba nguồn phát sinh cancel, tất cả dùng chung một đường:

| Nguồn | Ai kích hoạt |
|-------|--------------|
| User bấm nút **Cancel** | `cancelAll()` |
| User **chuyển tab** / rời màn hình | `useScreenRequest` (theo focus) |
| Component **unmount** | `useCancellableRequest` (cleanup) |

### 2.3. Quy tắc khi viết feature

- Screen **không** chứa logic gọi API — đẩy vào `services/modules/<resource>/`.
- Request có thể bị huỷ → luôn dùng **lazy query** hoặc **mutation** (không dùng `useQuery`).
- Lỗi cancel **không phải lỗi** → không hiện Alert/Toast. Chi tiết ở [mục 5](#5-cancel-request).
- State dùng chung nhiều màn hình → tạo slice trong `store/`; state cục bộ → `useState`.

---

## 3. Struct folder

```
react-native-base/
├── @types/                     # Type declarations toàn cục (navigation, theme, i18next)
├── android/  ios/              # Native project
├── fastlane/                   # Lanes build & deploy (DEV/PROD, iOS/Android)
├── scripts/                    # Script phụ trợ (copy_fcm_service, notify)
├── src/
│   ├── App.tsx                 # Root component (providers: Redux, SafeArea, Keyboard, ...)
│   │
│   ├── components/             # UI components tái sử dụng (export qua index.ts)
│   │   ├── ActionModal/  ConfirmModal/  BottomSheet/  Header/  Input/
│   │   ├── Button/DPButton.tsx      # Wrapper cho Fabric native component
│   │   ├── Text/NotoSansText.tsx    # Text bọc sẵn font NotoSans
│   │   ├── Alert/ShowAlert.ts       # Helper hiển thị Alert
│   │   ├── Network/                 # NetworkListener → đồng bộ slice network
│   │   └── AppUpdate/               # Kiểm tra & nhắc cập nhật app
│   │
│   ├── hooks/                  # useTheme, useNetwork
│   │   ├── useCancellableRequest.ts  # Abort request khi unmount
│   │   ├── useScreenRequest.ts       # Abort thêm khi màn hình mất focus
│   │   └── useFileTransfer.ts        # Upload/download + progress + cancel
│   │
│   ├── models/                 # Kiểu dữ liệu domain (user.d.ts, post.d.ts)
│   ├── navigators/             # Application (root stack), Main (bottom tabs), stack management
│   ├── screens/                # Mỗi màn hình 1 folder (Login, Home, Profile, Transfer, ...)
│   │
│   ├── services/
│   │   ├── api.ts              # baseQuery dùng chung của RTK Query
│   │   ├── cancellation.ts     # Nhận diện lỗi cancel + cancel token
│   │   ├── xhr.ts              # XHR có abort + progress (nền cho upload/download)
│   │   ├── firebase/           # FCM push notification
│   │   └── modules/            # Endpoint theo resource (users, posts, files)
│   │
│   ├── specs/                  # Codegen spec cho Fabric/TurboModule (DPButton)
│   ├── store/                  # Redux store + slices (theme, notification, network, transfer)
│   │
│   ├── theme/                  # Design system
│   │   ├── Variables.ts Fonts.ts Layout.ts Gutters.ts Common.ts Images.ts
│   │   ├── assets/             # fonts + images
│   │   ├── components/         # Style riêng theo component
│   │   └── themes/             # Biến thể theme (vd: default_dark)
│   │
│   ├── translations/           # i18n: index + resources/{en,jp}/*.json
│   └── utils/                  # configs (const/enum/screens), extensions, functions, helpers, permission
│       └── functions/api_error.ts   # getApiErrorMessage() — trả null khi bị cancel
│
├── babel.config.js  metro.config.js  tsconfig.json  jest.config.js
├── .env.template               # Mẫu biến môi trường (copy sang .env)
└── package.json
```

**Quy ước đặt tên**

| Thư mục | Quy ước | Ví dụ |
|---------|---------|-------|
| `components/` `screens/` `navigators/` | **PascalCase**, folder trùng tên file chính | `Header/Header.tsx` |
| `utils/` `services/` | snake_case cho file tiện ích | `date_time.ts`, `api_error.ts` |
| `hooks/` | camelCase, tiền tố `use` | `useScreenRequest.ts` |
| `models/` | khai báo kiểu, đuôi `*.d.ts` | `user.d.ts` |
| `services/modules/` | tên resource **số nhiều** | `users`, `posts`, `files` |

---

## 4. State management

Store cấu hình tại `src/store/index.ts`:

```
Redux Toolkit store
├── theme          (slice)         → src/store/theme
├── notification   (slice)         → src/store/notification
├── network        (slice)         → src/store/network    (online/offline)
├── transfer       (slice)         → src/store/transfer   (progress upload/download)
└── api            (RTK Query)     → src/services/api.ts  (+ modules/*)
        └── persist (redux-persist) → lưu bằng MMKV (reduxStorage)
```

- **Slices**: viết bằng `createSlice` trong `src/store/<name>`.
- **API / data fetching**: dùng **RTK Query**. `services/api.ts` là base; mỗi resource inject endpoint riêng trong `services/modules/<resource>/index.ts` (vd `useLazyFetchOneQuery`, `useAddPostMutation`).
- **Persist**: `redux-persist` với storage tùy biến `reduxStorage` (backed bởi **MMKV**). `whitelist` quyết định slice nào được lưu.
- **Truy cập nhanh storage**: `reduxStorage.getItem/setItem/removeItem` (vd lưu `SESSION`, `DEVICE_TOKEN` — khai báo key ở `utils/configs/const.ts`).
- **Kết nối UI**: `useSelector` / `useDispatch` (react-redux). Theme lấy qua `useTheme()`.
- **Offline**: `NetworkListener` đồng bộ slice `network`; `baseQuery` tự chặn request khi mất mạng.

---

## 5. Cancel request

React Native không có `CancelToken` như axios — primitive của nền tảng là **`AbortSignal`**. RTK Query đã tự truyền signal này vào mọi `baseQuery` / `queryFn` qua `baseQueryApi.signal`, nên base chỉ cần cung cấp cách *kích hoạt* nó và cách *nhận diện* lỗi cancel.

### 5.1. Nguyên tắc: cancel không phải là lỗi

> Khi user chủ động huỷ (bấm Cancel, rời tab, back màn hình), **không được show Alert/Toast lỗi**. Đó là hành vi họ mong muốn — báo lỗi là đổ ngược hành động của họ thành thất bại.

Vấn đề: lỗi cancel có **4 hình dạng khác nhau** tuỳ tầng phát sinh.

| Nguồn | Shape của error |
|-------|-----------------|
| `trigger(arg).abort()` | `{ name: 'AbortError', message: 'Aborted' }` |
| Request bị skip/trùng | `{ name: 'ConditionError' }` |
| `fetchBaseQuery` | `{ status: 'FETCH_ERROR', error: 'AbortError: Aborted' }` |
| `queryFn` (upload/download) | `{ status: 'CANCELLED' }` |

Tất cả được quy về một chỗ trong `src/services/cancellation.ts`:

```ts
import { isCancelledError } from '@/services/cancellation';

isCancelledError(error);   // true nếu là cancel, false nếu là lỗi thật (500, mất mạng…)
```

Và `getApiErrorMessage()` (`src/utils/functions/api_error.ts`) trả về **`null`** khi request bị cancel:

```ts
import { getApiErrorMessage } from '@/utils/functions/api_error';

const message = getApiErrorMessage(error);
if (message) Alert.alert(message);   // cancel → message = null → tự động im lặng
```

### 5.2. `useScreenRequest()` — dùng cho màn hình trong navigator

Tự động abort mọi request đang bay khi **unmount** *và* khi **màn hình mất focus**.

> **Vì sao cần cancel khi mất focus?** Bottom-tab screens **vẫn mounted** sau khi chuyển tab. Không có nó, một request dở dang ở tab Notify vẫn tiếp tục tải response về trong khi user đã sang tab Profile — tốn băng thông cho một kết quả không ai đọc.

```tsx
import { useScreenRequest } from '@/hooks';
import { isCancelledError } from '@/services/cancellation';
import { getApiErrorMessage } from '@/utils/functions/api_error';

const { run, cancelAll, isPending } = useScreenRequest();
const [fetchOne] = useLazyFetchOneQuery();

const onFetchUser = async () => {
  try {
    const user = await run(fetchOne('1')).unwrap();
    Alert.alert(user.name);
  } catch (error) {
    if (isCancelledError(error)) return;      // user huỷ → im lặng
    const message = getApiErrorMessage(error);
    if (message) Alert.alert(message);
  }
};

<Button title="Fetch"  onPress={onFetchUser} disabled={isPending} />
<Button title="Cancel" onPress={cancelAll}   disabled={!isPending} />
```

| API | Ý nghĩa |
|-----|---------|
| `run(request)` | Bọc kết quả của lazy-query / mutation trigger để hook theo dõi và abort được |
| `cancelAll()` | Huỷ tất cả request đang chạy |
| `isPending` | **Reactive** — dùng cho spinner / `disabled` |
| `hasPending()` | Bản imperative của `isPending` |

`useCancellableRequest()` giống hệt nhưng **không** cancel theo focus — dùng cho component nằm ngoài navigator.

> ⚠️ Hook `useQuery` (non-lazy) **không huỷ được** vì RTK Query không expose `.abort()` cho nó. Cần huỷ thì dùng **lazy query** (`useLazyXxxQuery`) hoặc mutation.

### 5.3. Upload / Download có progress + cancel

Nằm ở `src/services/modules/files/`. Đi qua `queryFn` + **XHR** thay vì `fetch`, vì `fetch` trong RN không báo được upload progress. Vẫn nhận `signal`, nên `.abort()` cắt kết nối thật sự giữa chừng.

Progress lưu ở slice `transfer` (`src/store/transfer`), **không** truyền callback làm endpoint argument — RTK Query đưa argument vào action và vào cache key, mà function thì không serialize được.

```tsx
import { useFileTransfer } from '@/hooks';

const upload = useFileTransfer('avatar');   // id tự đặt, dùng để đọc progress

const onUpload = async () => {
  const result = await upload.upload({ url: '/upload', file });

  if (result.status === 'error') Alert.alert(result.message);
  // 'cancelled' → bỏ qua, không show gì
  // 'success'   → result.data
};

<ProgressBar progress={upload.progress} />        {/* 0..1 */}
<Button title="Cancel" onPress={upload.cancel} disabled={!upload.isRunning} />
```

Kết quả trả về là union **tách cancel khỏi error ngay ở kiểu dữ liệu**, nên chỗ gọi không thể lỡ tay báo lỗi khi user tự huỷ:

```ts
type TransferOutcome<T> =
  | { status: 'success'; data: T }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };
```

Download dùng y hệt — gọi `useFileTransfer()` một lần nữa với **id khác** để hai tiến trình có progress độc lập:

```tsx
const download = useFileTransfer('report');
const result = await download.download({ url: '/download' });
```

Các field khác của hook: `status`, `progress`, `loaded`, `total`, `error`, `isRunning`.

Màn hình mẫu: `src/screens/Transfer/TransferScreen.tsx` (vào từ tab Profile).

> ⚠️ URL đang là **placeholder** trong `utils/configs/const.ts` (`DEMO_UPLOAD_URL`, `DEMO_DOWNLOAD_URL`) và `DEMO_UPLOAD_FILE.uri` để rỗng. Trỏ về endpoint thật và nối image picker trước khi chạy.

### 5.4. Thêm cancel cho một màn hình mới

1. Đổi endpoint sang dạng **lazy** (`useLazyFetchOneQuery`) hoặc mutation.
2. Thay lời gọi trực tiếp bằng `run(trigger(arg))` từ `useScreenRequest()`.
3. Trong `catch`: `if (isCancelledError(error)) return;` rồi mới `getApiErrorMessage()`.

Không cần đụng tới `services/api.ts` — `baseQueryWithInterceptor` đã tự bỏ qua request khi `signal` đã abort và chuẩn hoá lỗi cancel sẵn.

---

## 6. Install

**Yêu cầu môi trường**

| | |
|---|---|
| Node | **>= 22.11.0**, Yarn (Classic 1.x) |
| iOS | Xcode, Ruby + Bundler **2.4.22** (khớp `Gemfile.lock`), CocoaPods |
| Android | Android Studio + JDK 17 |

```sh
# 1. Cài JS dependencies
yarn install

# 2. Tạo file môi trường từ mẫu rồi điền giá trị
cp .env.template .env

# 3. iOS: cài Ruby gems + CocoaPods
bundle install
bundle exec pod install --project-directory=ios
# hoặc dùng script gộp:  yarn pod-install
```

> **Lưu ý khi build iOS trên Xcode 26.x / Apple Silicon**
> - Thiếu đúng bản bundler: `gem install bundler -v 2.4.22`.
> - `ios/Podfile` đã chứa sẵn workaround cho `@react-native-firebase` build dạng **static framework** (build-from-source, tắt Folly coroutines, cho phép non-modular includes). Đừng gỡ các dòng đó — có comment giải thích ngay trong Podfile.

---

## 7. Run

```sh
# Khởi động Metro (terminal riêng)
yarn start

# iOS (simulator mặc định)
yarn ios

# Android (emulator/thiết bị đang kết nối)
yarn android
```

Tiện ích khác:

```sh
yarn lint         # ESLint
yarn type-check   # TypeScript (tsc, không emit)
yarn test         # Jest
```

Reload nhanh khi dev: iOS nhấn `R` trong simulator; Android nhấn `R` hai lần hoặc mở Dev Menu (`Cmd/Ctrl + M`).

---

## 8. Build & Deploy

### Release thủ công

```sh
# iOS: mở ios/MyApp.xcworkspace bằng Xcode → chọn scheme Release → Archive

# Android:
cd android && ./gradlew assembleRelease   # APK
cd android && ./gradlew bundleRelease     # AAB (Play Store)
```

### Bằng Fastlane (khuyến nghị)

Các lane định nghĩa trong `fastlane/Fastfile`:

```sh
# iOS
bundle exec fastlane ios dev_deploy      # DEV  → DeployGate
bundle exec fastlane ios prod_deploy     # PROD → TestFlight / App Store

# Android
bundle exec fastlane android dev_deploy  # DEV  → DeployGate
bundle exec fastlane android prod_deploy # PROD → Play Store
```

> Cần cấu hình signing (iOS provisioning / Android keystore) và biến trong `.env` trước khi chạy deploy.

---

## 9. Troubleshooting

| Triệu chứng | Cách xử lý |
|-------------|------------|
| Lỗi native lạ sau khi đổi dependency | `yarn pod-install` (clean + cài lại pods) |
| Metro serve code cũ, lỗi module không tồn tại | `yarn start --reset-cache` |
| Request vẫn chạy sau khi rời màn hình | Màn hình đang dùng `useQuery` — đổi sang lazy query + `useScreenRequest` ([mục 5](#5-cancel-request)) |
| Hiện Alert lỗi khi user bấm Cancel | Thiếu `if (isCancelledError(error)) return;` trong `catch` |

Xem thêm [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting).
