import { Outlet } from 'react-router-dom'
import { BossKeyButton } from '../components/BossKeyButton'
import { FakeInboxOverlay } from '../components/FakeInboxOverlay'
import { Header } from '../components/Header'
import { useBossKey } from '../context/BossKeyContext'

export function AppLayout() {
  const { isActive } = useBossKey()

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <BossKeyButton />
      {isActive ? <FakeInboxOverlay /> : null}
    </div>
  )
}
