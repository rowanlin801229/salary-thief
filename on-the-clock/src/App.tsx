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
  return (
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
                    <Route
                      path="/timer"
                      element={
                        <ProtectedRoute>
                          <TimerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/result"
                      element={
                        <ProtectedRoute>
                          <ResultPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <ProtectedRoute>
                          <HistoryPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/achievement"
                      element={
                        <ProtectedRoute>
                          <AchievementPage />
                        </ProtectedRoute>
                      }
                    />
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
  )
}

export default App
