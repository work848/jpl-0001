import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VerbPage from './pages/VerbPage';
import AdjectivePage from './pages/AdjectivePage';
import PracticePage from './pages/PracticePage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<VerbPage />} />
            <Route path="/adjective" element={<AdjectivePage />} />
            <Route path="/practice" element={<PracticePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
