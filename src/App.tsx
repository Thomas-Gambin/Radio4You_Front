import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './pages/homePage/homePage';
import ArticlesPage from './pages/articlesPage/ArticlesPage';
import PodcastsPage from './pages/podcastsPage/PodcastsPage';

export const ROUTES = {
  HOME: '/',
  ARTICLES: '/articles',
  PODCASTS: '/podcasts',
}

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.ARTICLES} element={<ArticlesPage />} />
        <Route path={ROUTES.PODCASTS} element={<PodcastsPage />} />
      </Route>
    </Routes>
  )
}
