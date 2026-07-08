# 【Phase 3-Step 1：登入頁面 Wireframe + Firebase 認證】

## 任務概述

**目標**：快速驗證登入邏輯（Apple Kit 簡約風格 Wireframe）  
**時間估計**：5-7 天  
**優先級**：P0  
**階段**：Wireframe 邏輯驗證（Phase 3b 再升級手繪風格）

---

## 現在的階段說明

**現在是 Wireframe 驗證階段，不是精美設計階段**

✅ **重點**：邏輯 100% 正確、所有按鈕可用、流程無誤
❌ **暫不做**：手繪涂鴉、精美設計、動畫、微交互

使用 **Apple iOS Kit 簡約風格** 快速驗證，確認一切正常後，Phase 3b 再升級視覺設計到手繪風格。

---

## 背景

- 應用已完成 Phase 1-2：計時器、設定、結果、紀錄、成就頁面
- 現在要加入 **多人競賽功能**，需要用戶認證 + 朋友系統
- 使用 **Firebase Authentication + Firestore** 作為後端
- 為朋友邀請、排行榜等功能做準備
- 部署在 Vercel（用 Apple Kit 簡約風格快速測試）

---

## Firebase 配置

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxGz7oVzfdm5hQIk5n4AoPAoi3u7kfRKs",
  authDomain: "on-the-clock-production.firebaseapp.com",
  projectId: "on-the-clock-production",
  storageBucket: "on-the-clock-production.firebasestorage.app",
  messagingSenderId: "138828683769",
  appId: "1:138828683769:web:c077b2dd22fcfca4980528"
};
```

**Firestore 位置**：asia-east1 (Taiwan)  
**安全規則**：測試模式（30 天內改生產規則）  
**啟用的登入方式**：
- ✅ Google OAuth2
- ✅ Email/密碼（無密碼驗證方式）

---

## 技術架構

### 1. 新增 src/lib/firebase.ts

初始化 Firebase 並導出必要的服務。

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { /* ... */ };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 2. 新增 src/context/AuthContext.tsx

管理全局認證狀態。

**Context 提供的值**：
- `user` - 當前登入用戶（FirebaseUser | null）
- `isEmailVerified` - email 是否已驗證
- `loading` - 加載狀態
- `signInWithGoogle()` - Google 登入
- `signInWithEmail(email)` - 發送驗證碼到 email
- `verifyEmailCode(code)` - 驗證 6 位碼
- `signOut()` - 登出
- `updateUserProfile(displayName)` - 更新用戶昵稱

**效果**：
- 自動建立 Firestore `users/{userId}` 文檔
- 持久化登入狀態（刷新頁面不丟失）
- 支援中英文

### 3. 新增 src/pages/LoginPage.tsx

登入頁面（Apple Kit 簡約風格 Wireframe）。

**功能**：
- 標題：「On The Clock」/ 「薪水小偷」
- 按鈕 1：「使用 Google 登入」（藍色、16px 圓角）
- 分隔線 + 文字「或用 Email 登入」
- Email 輸入框 + 「發送驗證碼」按鈕（灰色）
- 誤信息提示（如 email 無效）

**流程**：
- 點「Google 登入」→ 彈 OAuth 選擇帳戶 → 自動驗證 → 進入 /setup-profile
- 輸入 Email + 點「發送驗證碼」→ 進入 /verify-email

**UI 設計**（Apple Kit 簡約）：
```
┌──────────────────────────┐
│                          │
│     On The Clock         │  (標題、24px、黑色、700 粗)
│      薪水小偷             │  (副標、14px、灰 #666)
│                          │
│  [使用 Google 登入]      │  (16px 圓角、#0066ff 藍、白字)
│                          │
│  ──────────────────      │  (淡灰分隔線)
│  或用 Email 登入          │  (14px、灰 #999)
│                          │
│  [輸入你的 Email]        │  (輸入框、黑邊、0px 圓角)
│  [發送驗證碼]            │  (16px 圓角、灰 #ccc)
│                          │
└──────────────────────────┘
```

**色彩**：
- 背景：白 #fff
- 文字（標題）：黑 #111
- 文字（標籤）：灰 #666
- 按鈕（主）：藍 #0066ff
- 按鈕（次）：灰 #ccc
- 邊框：#ddd
- 錯誤：紅 #e63946

**字體**：系統無襯線（-apple-system, BlinkMacSystemFont, "Segoe UI"）

### 4. 新增 src/pages/VerifyEmailPage.tsx

驗證碼輸入頁面（Apple Kit 簡約風格 Wireframe）。

**功能**：
- 顯示郵箱：「驗證碼已寄到 user@example.com」
- 6 個數字輸入框（auto-focus、自動轉移焦點）
- 「驗證」按鈕
- 「重新發送」按鈕（灰色）
- 倒數計時器：「60 秒後可重新發送」

**流程**：
- 用戶輸入 6 位碼 → 點「驗證」 → 成功進 /setup-profile
- 失敗：顯示「驗證碼錯誤」並清空
- 點「重新發送」：重新發送郵件 + 重啟計時器

**UI 設計**：
```
┌──────────────────────────┐
│                          │
│ 驗證碼已寄到              │  (16px、黑)
│ rowan@example.com        │  (14px、灰)
│                          │
│ [__] [__] [__]           │  (6 個輸入框、中心對齐)
│ [__] [__] [__]           │
│                          │
│  [驗證]  [重新發送]      │  (按鈕)
│                          │
│  60 秒後可重新發送        │  (倒數計時器)
│                          │
└──────────────────────────┘
```

### 5. 新增 src/pages/SetupProfilePage.tsx

首次登入設定昵稱頁面（Apple Kit 簡約風格 Wireframe）。

**功能**：
- 顯示 Google 頭像（如有）
- 昵稱輸入框（預填 Google displayName）
- 「完成」按鈕 → 進入 /result

**Firestore 操作**：
- 更新 `users/{userId}.displayName`

**UI 設計**：
```
┌──────────────────────────┐
│                          │
│  [圓形頭像]              │  (64px、中心)
│                          │
│  設定你的昵稱              │  (14px、灰)
│  [輸入昵稱]              │  (輸入框)
│                          │
│  [完成]                  │  (藍色按鈕)
│                          │
└──────────────────────────┘
```

### 6. 新增 src/components/UserMenu.tsx

Header 右側用戶菜單（已登入時）。

**功能**：
- 顯示用戶昵稱（左對齐）
- 小頭像（圓形、32px、右邊）
- 點擊展開菜單：
  - 「用戶檔案」 → /user-profile
  - 「登出」 → 登出 + 回到 /login

**效果**：
```
Header 右側：
[用戶名] [圓形頭像] ▼
  ├─ 用戶檔案
  └─ 登出
```

### 7. 新增 src/pages/UserProfilePage.tsx

用戶檔案頁面（簡單版）。

**功能**：
- 顯示昵稱、Email、頭像
- 「編輯昵稱」按鈕
- 「登出」按鈕
- 「返回」按鈕 → /result

**UI 設計**：
```
┌──────────────────────────┐
│  [圓形頭像]              │
│                          │
│  昵稱：Rowan Lin          │  (可編輯)
│  Email：rowan@...        │  (唯讀)
│                          │
│  [編輯昵稱]  [登出]      │
│  [返回]                  │
│                          │
└──────────────────────────┘
```

### 8. 更新路由 (src/main.tsx)

```typescript
const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/setup-profile", element: <SetupProfilePage /> },
  { path: "/user-profile", element: <UserProfilePage /> },
  // 已有的頁面（需要認證保護）
  { path: "/result", element: <ProtectedRoute><ResultPage /></ProtectedRoute> },
  { path: "/timer", element: <ProtectedRoute><TimerPage /></ProtectedRoute> },
  { path: "/history", element: <ProtectedRoute><HistoryPage /></ProtectedRoute> },
  { path: "/achievement", element: <ProtectedRoute><AchievementPage /></ProtectedRoute> },
];
```

**ProtectedRoute**：檢查 `auth.currentUser`，未登入則導向 /login

### 9. 更新 App.tsx

```typescript
// 根據 auth 狀態決定顯示
if (loading) return <LoadingScreen />;
if (!user) return <Routes ...login routes... />;
return <Routes ...main app routes... />;
```

### 10. 建立 Firestore 集合結構

為 Phase 3 多人競賽準備。

```
users/
├─ {userId}
│  ├─ email (string)
│  ├─ displayName (string)
│  ├─ photoURL (string, 可選)
│  ├─ currency (string, default: "NT$")
│  ├─ language (string, default: "zh")
│  ├─ createdAt (timestamp)
│  └─ stats
│     ├─ monthlyStats: { "2026-07": { best: 150, total: 2450 } }
│     └─ allTimeStats: { best: 180, total: 8920 }

sessions/
├─ {userId}
│  └─ {sessionId}
│     ├─ startAt (timestamp)
│     ├─ elapsedMs (number)
│     ├─ stolenAmount (number)
│     ├─ currency (string)
│     ├─ timestamp (timestamp)
│     └─ date (string, "2026-07-07" for grouping)

friends/  (暫不實裝，為 Phase 3b 預留)
├─ {userId}
│  └─ {friendUserId}: true

leaderboards/  (暫不實裝，為 Phase 3b 預留)
├─ "friends-{userId}-{monthId}"
│  ├─ friendUserId_1: stolenAmount
│  └─ ...
```

### 11. 安全規則（暫時）

測試模式規則（30 天內改生產規則）：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 測試模式：允許所有讀寫
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 完整登入流程圖

### 未登入用戶

```
進入應用
  ↓
檢查 auth.currentUser
  ↓
無用戶 → 導向 /login
  ↓
【LoginPage】
  ├─ 選「Google 登入」
  │  ├─ 彈 Firebase OAuth 對話框
  │  ├─ 用戶選帳戶並同意
  │  ├─ Firebase 自動驗證
  │  └─ 自動建立 users/{userId} 文檔
  │
  └─ 或選「Email 登入」
     ├─ 輸入 email
     ├─ 點「發送驗證碼」
     └─ 進入 /verify-email
        ↓
      【VerifyEmailPage】
        ├─ 輸入 6 位碼
        ├─ 點「驗證」
        └─ Firebase 驗證 + 自動建立用戶
           ↓
         【SetupProfilePage】
         ├─ 設定昵稱
         ├─ 點「完成」
         └─ 更新 displayName → /result
```

### 已登入用戶

```
進入應用
  ↓
檢查 auth.currentUser
  ↓
有用戶 → 直接進入主應用 (/result)
  ↓
Header 顯示用戶名 + 登出按鈕
```

---

## UI 設計原則（Wireframe 階段）

### ✅ 現在要做

- 白底、清晰排版
- 系統無襯線字體
- 16px 圓角按鈕（區別於輸入框的 0px）
- 標準 iOS 交互
- 所有流程 100% 可用

### ❌ 暫不做（Phase 3b）

- 手繪涂鴉風格（rough.js）
- 動畫 / 轉場效果
- 貓咪插圖
- 精細的色彩微調
- 自訂 Logo / Icon

---

## 日期和時間格式

**中文**：
- 日期：7月3日
- 時間：0:05

**英文**：
- 日期：Jul 03, 2026
- 時間：0:05

---

## 測試清單（邏輯驗證）

完成後請逐項確認：

- [ ] Google 登入流程完整（選帳戶 → 同意 → 進 /setup-profile）
- [ ] Email 驗證碼發送正常
- [ ] 驗證碼輸入框 auto-focus 可用
- [ ] 驗證碼驗證成功 → /setup-profile
- [ ] 驗證碼錯誤顯示提示
- [ ] 倒數計時器 60 秒正常
- [ ] 「重新發送」可用
- [ ] 設定昵稱後進入 /result
- [ ] 用戶檔案寫入 Firestore 正確
- [ ] Header 顯示用戶名
- [ ] 點登出回到 /login
- [ ] 刷新頁面保持登入狀態（auth 持久化）
- [ ] 已登入用戶直接進 /result（不再進 /login）
- [ ] Protected Route 守衛正常（未登入進 /timer 轉向 /login）
- [ ] 中英文切換正常
- [ ] 響應式設計 ≤520px（Header 標題上、按鈕下）
- [ ] 所有按鈕 hover 效果一致

---

## 完成交付

1. **代碼**：推送到 main 分支（帶清晰 commit 訊息）
2. **截圖**：
   - /login 頁面
   - /verify-email 頁面（輸入碼中）
   - /setup-profile 頁面
   - Header（已登入）+ 用戶菜單
3. **測試清單**：全部勾選 ✓
4. **Firestore 檢查**：確認 users/{userId} 文檔結構正確

---

## 下一步（Phase 3-Step 2）

完成 Step 1 後，準備：
- 朋友邀請機制（邀請碼 / 分享連結）
- 月度排行榜（本月 vs 全時間）
- 個人 vs 朋友排名對比

---

## 參考資源

- Firebase Auth 文檔：https://firebase.google.com/docs/auth
- Firestore 文檔：https://firebase.google.com/docs/firestore
- React Router v7：https://reactrouter.com/
- Apple Human Interface Guidelines：https://developer.apple.com/design/human-interface-guidelines

---

**準備好了！祝實作順利！** 🚀
