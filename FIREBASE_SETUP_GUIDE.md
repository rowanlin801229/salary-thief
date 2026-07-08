# Firebase 設定指南（設計師專用）

**預計時間：30–40 分鐘**  
**難度：⭐ 容易（只需點擊 + 複製）**

---

## 概覽

你要設定的 Firebase 服務：
- ✅ **Authentication**（Google 登入 + Email 驗證碼）
- ✅ **Firestore Database**（存用戶資料、朋友關係、排行榜）
- ✅ **Firebase Hosting**（可選，或用 Vercel 部署）

完成後，你會得到一份「Firebase Config」，給 Cursor 貼進代碼。

---

## Step 1：建立 Firebase 項目

### 1.1 進入 Firebase Console

1. 打開瀏覽器，去 **[firebase.google.com](https://firebase.google.com)**
2. 點右上角「**進入 Console**」（或「Go to console」）
3. 用你的 Google 帳號登入（可以用 rowanlin801229@gmail.com）

### 1.2 建立新項目

1. 在 Firebase Console 首頁，點「**+ 建立項目**」（藍色按鈕）
2. 輸入專案名稱：
   ```
   on-the-clock-production
   ```
3. 選擇「**停用 Google Analytics**」（小團隊不需要）
4. 點「**建立專案**」

⏳ 等待 1–2 分鐘，直到看到「你的新專案已準備好」。

---

## Step 2：啟用 Google 登入

### 2.1 進入 Authentication 頁面

1. 在 Firebase Console 左側菜單，點「**Build**」→「**Authentication**」
2. 點「**開始**」（或「Get started」）
3. 選擇「**Google**」作為登入方式
4. 打開開關 ✓
5. 在「**專案公開名稱**」欄位輸入：
   ```
   On The Clock
   ```
6. 在「**支持電郵地址**」輸入：
   ```
   rowanlin801229@gmail.com
   ```
7. 點「**儲存**」

✅ Google 登入已啟用。

---

## Step 3：啟用 Email 登入（驗證碼）

### 3.1 設定 Email 驗證

1. 在 Authentication 頁面，點「**登入方式**」標籤
2. 找到「**Email/Password**」
3. 點「**編輯**」（鉛筆圖示）
4. 打開「**Email/Password**」的開關 ✓
5. **找到「Email link (passwordless sign-in)」** → 打開開關 ✓
   - 這是發驗證碼的方式

6. 點「**儲存**」

✅ Email 驗證已啟用。

---

## Step 4：設定 Google OAuth2 凭證（重要！）

這一步**最容易出問題**，要仔細做。

### 4.1 找到 OAuth 同意畫面

1. 在 Authentication 頁面，找到「**Google**」登入方式的「**Web SDK 設定**」
2. 點「**開啟 Google Cloud Console**」（或自己打開 [console.cloud.google.com](https://console.cloud.google.com)）
3. 確保**上方選擇的是剛剛建立的項目**（on-the-clock-production）
4. 在左側菜單，點「**APIs & Services**」→「**OAuth consent screen**」

### 4.2 設定同意畫面

1. 選擇「**外部**」（External）
2. 點「**建立**」

**填寫以下資訊：**
- **應用程式名稱**：On The Clock
- **使用者支援電郵**：rowanlin801229@gmail.com
- **開發者聯絡資訊 - 電郵**：rowanlin801229@gmail.com
- 點「**儲存並繼續**」

3. **Scopes 頁面**（範圍）
   - 不用改，直接點「**儲存並繼續**」

4. **測試使用者**（可選）
   - 不用加，直接點「**儲存並完成**」

✅ OAuth 同意畫面已設定。

---

## Step 5：取得 Firebase Config（給 Cursor 用）

### 5.1 找到 Web App 設定

1. 回到 Firebase Console（[console.firebase.google.com](https://console.firebase.google.com)）
2. 在 Project Overview 頁面，找到「**新增應用**」或「**</> Web**」（程式碼圖示）
3. 選擇「**Web**」

### 5.2 註冊應用

1. 輸入應用名稱：
   ```
   on-the-clock-web
   ```
2. 勾選「**也為此應用設定 Firebase Hosting**」（可選，我們用 Vercel）
3. 點「**註冊應用**」

### 5.3 複製 Firebase Config

你會看到一個代碼片段，像這樣：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "on-the-clock-xxx.firebaseapp.com",
  projectId: "on-the-clock-xxx",
  storageBucket: "on-the-clock-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};
```

**複製整個 `firebaseConfig` 對象**（包括花括號）。

📋 **貼進這個備忘錄：**
```
FIREBASE_CONFIG = {
  [粘贴在这里]
}
```

你需要把這個交給 Cursor。

---

## Step 6：建立 Firestore Database

### 6.1 進入 Firestore

1. 在 Firebase Console 左側菜單，點「**Build**」→「**Firestore Database**」
2. 點「**建立資料庫**」

### 6.2 選擇位置和規則

1. **位置**：選擇「**asia-southeast1**」（新加坡，亞洲最近）
2. **安全規則**：選擇「**以測試模式啟動**」
   - ⚠️ 這只是為了快速開始，後期需要改成「生產模式」
3. 點「**建立**」

⏳ 等待 1–2 分鐘。

✅ Firestore 已建立。

---

## Step 7：設定 Firestore 安全規則（暫時版）

### 7.1 進入 Firestore Rules 頁面

1. 在 Firestore 頁面，點「**Rules**」標籤
2. 看到預設規則：
   ```
   match /{document=**} {
     allow read, write: if request.time < timestamp.date(2026, 7, 12);
   }
   ```

### 7.2 臨時規則（測試用）

將規則改成：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 測試階段：允許所有讀寫
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. 點「**發佈**」

⚠️ **重要**：這個規則**只在開發階段用**。上線前一定要改成生產規則。

---

## Step 8：驗證設定（快速檢查清單）

在 Firebase Console 檢查以下項目：

- ✅ **Authentication** → 「登入方式」
  - [ ] Google 已啟用
  - [ ] Email/Password 已啟用
  - [ ] Email link (passwordless) 已啟用

- ✅ **Firestore Database**
  - [ ] 數據庫已建立（位置：asia-southeast1）
  - [ ] Rules 已發佈（測試規則）

- ✅ **OAuth Consent Screen**
  - [ ] 應用名稱、支援郵箱已填
  - [ ] 狀態：Published（或 In development）

- ✅ **Web App Config**
  - [ ] 已複製 `firebaseConfig`

---

## Step 9：給 Cursor 的信息清單

準備以下信息，等下給 Cursor：

```markdown
### Firebase Setup 完成清單

**Project ID:**
on-the-clock-xxx  （從 firebaseConfig 複製）

**Firebase Config:**
```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

**Authentication Methods:**
- Google Sign-in: ✓ Enabled
- Email (passwordless): ✓ Enabled

**Firestore:**
- Database created: ✓
- Location: asia-southeast1
- Rules: Test mode (temporary)

**Next Steps:**
1. Cursor installs firebase SDK
2. Create src/lib/firebase.ts with config
3. Create src/context/AuthContext.tsx
4. Create login pages
```

---

## 🆘 常見問題

### Q1: 「為什麼 Google 登入沒有出現選項？」
**A:** 你可能漏掉了 Step 4（Google OAuth2 凭証）。回到 Firebase Console → Authentication → Google 登入 → 點「Web SDK 設定」。

### Q2: 「Firestore Rules 發佈失敗？」
**A:** 確保格式正確。試試複製我上面提供的規則，一字不差。

### Q3: 「我的 Firebase 項目怎麼找不到？」
**A:** 確保你在正確的 Google 帳號登入。用 rowanlin801229@gmail.com 試試。

### Q4: 「Firebase Config 在哪裡複製？」
**A:** Firebase Console → Project Settings（左下角齒輪）→ 「您的應用」→ 找到 Web 應用 → 複製整個 config。

---

## 下一步

完成上述 9 步後，告訴我：

1. ✅ **已複製 Firebase Config**
2. ✅ **Firestore Database 已建立**
3. ✅ **Google + Email 登入已啟用**

然後我會準備「Cursor Prompt 登入頁面實作」。

---

## 參考資源

- Firebase Docs: https://firebase.google.com/docs
- Google Cloud Console: https://console.cloud.google.com
- Firestore Rules: https://firebase.google.com/docs/firestore/security/start

---

**估計完成時間：30 分鐘**  
**開始吧！**

