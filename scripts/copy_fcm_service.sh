#!/bin/bash

# Nhận biến flavor từ tham số đầu vào
FLAVOR=$1

# Kiểm tra
if [[ -z "$FLAVOR" ]]; then
  echo "❌ Vui lòng truyền flavor (ví dụ: dev hoặc product)"
  exit 1
fi

echo "📦 Bắt đầu copy file FCM cho flavor: $FLAVOR"

# Đường dẫn gốc
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
ANDROID_DEST="$ROOT_DIR/android/app/google-services.json"
IOS_DEST="$ROOT_DIR/ios/MyApp/GoogleService-Info.plist"

ANDROID_SRC="$ROOT_DIR/src/services/fcm/$FLAVOR/android/google-services.json"
IOS_SRC="$ROOT_DIR/src/services/fcm/$FLAVOR/ios/GoogleService-Info.plist"

# Xóa file cũ nếu có
echo "🧹 Xoá file cũ (nếu có)..."
echo "$ANDROID_SRC"
rm -f "$ANDROID_DEST"
rm -f "$IOS_DEST"

# nếu không tìm thấy thì dừng script
if [ ! -f "$ANDROID_SRC" ]; then
  echo "❌ Không tìm thấy $ANDROID_SRC"
  echo "kết thúc script"
  exit 0
fi

# nếu không tìm thấy thì dừng script
if [ ! -f "$IOS_SRC" ]; then
  echo "❌ Không tìm thấy $IOS_SRC"
  echo "kết thúc script"
  exit 0
fi

# Copy file mới
echo "📁 Copy android/google-services.json"
cp "$ANDROID_SRC" "$ANDROID_DEST" || { echo "❌ Không tìm thấy $ANDROID_SRC"; exit 1; }

echo "📁 Copy ios/GoogleService-Info.plist"
cp "$IOS_SRC" "$IOS_DEST" || { echo "❌ Không tìm thấy $IOS_SRC"; exit 1; }

echo "✅ Copy hoàn tất!"
