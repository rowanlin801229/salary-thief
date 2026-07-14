import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute'
import { AppStateProvider } from './context/AppStateContext'
import { AuthProvider } from './context/AuthContext'
import { BossKeyProvider } from './context/BossKeyContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { LanguageProvider } from './context/LanguageContext'
import { AppLayout } from './layout/AppLayout'
import { AchievementPage } from './pages/AchievementPage'
import { HistoryPage } from './pages/HistoryPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { ResultPage } from './pages/ResultPage'
import { SetupPage } from './pages/SetupPage'
import { SetupProfilePage } from './pages/SetupProfilePage'
import { TimerPage } from './pages/TimerPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'

function App() {
  const [isInApp, setIsInApp] = useState(false)
  useEffect(() => {
    const ua = navigator.userAgent

    // LINE：自動加參數讓 LINE 用外部瀏覽器開啟
    if (/Line\//i.test(ua)) {
      const url = new URL(window.location.href)
      if (!url.searchParams.get('openExternalBrowser')) {
        url.searchParams.set('openExternalBrowser', '1')
        window.location.replace(url.toString())
      }
      return
    }

    // 其他 in-app browser（FB、IG）：顯示提示 banner
    if (/FBAN|FBAV|Instagram|MicroMessenger/i.test(ua)) {
      setIsInApp(true)
    }
  }, [])

  return (
    <>
      {isInApp && (
        <div className="inapp-banner">
          請用 Safari 或 Chrome 開啟，才能使用 Google 登入
        </div>
      )}
    <LanguageProvider>
      <CurrencyProvider>
        <AppStateProvider>
          <BossKeyProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/signin"
                    element={
                      <GuestRoute>
                        <SignInPage />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <GuestRoute>
                        <SignUpPage />
                      </GuestRoute>
                    }
                  />
                  <Route path="/login" element={<Navigate to="/signin" replace />} />
                  <Route
                    path="/verify-email"
                    element={
                      <GuestRoute>
                        <VerifyEmailPage />
                      </GuestRoute>
                    }
                  />
                  <Route path="/setup-profile" element={<SetupProfilePage />} />

                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/result" replace />} />
                    <Route path="/setup" element={<SetupPage />} />
                    <Route path="/timer" element={<TimerPage />} />
                    <Route path="/result" element={<ResultPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/achievement" element={<AchievementPage />} />
                    <Route
                      path="/leaderboard"
                      element={
                        <ProtectedRoute>
                          <LeaderboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/milestones" element={<Navigate to="/achievement" replace />} />
                    <Route
                      path="/user-profile"
                      element={
                        <ProtectedRoute>
                          <UserProfilePage />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </BossKeyProvider>
        </AppStateProvider>
      </CurrencyProvider>
    </LanguageProvider>
    </>
  )
}

export default App
