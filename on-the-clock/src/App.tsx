import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateContext'
import { BossKeyProvider } from './context/BossKeyContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { LanguageProvider } from './context/LanguageContext'
import { AppLayout } from './layout/AppLayout'
import { AchievementPage } from './pages/AchievementPage'
import { HistoryPage } from './pages/HistoryPage'
import { ResultPage } from './pages/ResultPage'
import { SetupPage } from './pages/SetupPage'
import { TimerPage } from './pages/TimerPage'

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AppStateProvider>
          <BossKeyProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Navigate to="/setup" replace />} />
                  <Route path="/setup" element={<SetupPage />} />
                  <Route path="/timer" element={<TimerPage />} />
                  <Route path="/result" element={<ResultPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/achievement" element={<AchievementPage />} />
                  <Route path="/milestones" element={<Navigate to="/achievement" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </BossKeyProvider>
        </AppStateProvider>
      </CurrencyProvider>
    </LanguageProvider>
  )
}

export default App
