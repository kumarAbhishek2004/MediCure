import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import MedicinePrediction from './pages/MedicinePrediction'
import HomeRemedies from './pages/HomeRemedies'
import Chatbot from './pages/Chatbot'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicine" element={<MedicinePrediction />} />
          <Route path="/remedies" element={<HomeRemedies />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
