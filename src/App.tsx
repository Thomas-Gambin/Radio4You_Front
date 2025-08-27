import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import HomePage from './pages/homePage/homePage'

export const ROUTES = {
  HOME: '/',
}

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  )
}
