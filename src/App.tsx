import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import UniversitiesPage from './pages/UniversitiesPage'
import UniversityDetailPage from './pages/UniversityDetailPage'
import ProgramDetailPage from './pages/ProgramDetailPage'
import ComparisonPage from './pages/ComparisonPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/universities/:id" element={<UniversityDetailPage />} />
        <Route
          path="/universities/:id/programs/:programId"
          element={<ProgramDetailPage />}
        />
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
