import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './pages/homePage/homePage';
import ArticlesPage from './pages/articlesPage/ArticlesPage';
import PodcastsPage from './pages/podcastsPage/PodcastsPage';
import ArticleDetailPage from './pages/articleDetailPage/ArticleDetailPage';
import PodcastDetailPage from './pages/podcastDetailPage/PodcastDetailPage';
import AboutPage from './pages/aboutPage/AboutPage';
import ContactPage from './pages/contactPage/ContactPage';
import LegalPage from './pages/legalPage/LegalPage';

export const ROUTES = {
  HOME: '/',
  ARTICLES: '/articles',
  PODCASTS: '/podcasts',
  ARTICLE: '/articles/:idslug',
  PODCAST: '/podcasts/:idslug',
  ABOUT: '/a-propos',
  CONTACT: '/devenir-sponsor',
  LEGAL: '/mention-legale'
}

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.ARTICLES} element={<ArticlesPage />} />
        <Route path={ROUTES.PODCASTS} element={<PodcastsPage />} />
        <Route path={ROUTES.ARTICLE} element={<ArticleDetailPage />} />
        <Route path={ROUTES.PODCAST} element={<PodcastDetailPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.LEGAL} element={<LegalPage />} />
      </Route>
    </Routes>
  )
}
