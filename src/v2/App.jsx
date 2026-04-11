import "@/v2/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import LandingPage from "./pages/LandingPage";
import CoachesLandingPage from "./components/landing/CoachesLandingPage";
import NosotrosPage from "./pages/NosotrosPage";

function App() {
  return (
    <LanguageProvider>
      <div className="App v2-scope">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/coaches" element={<CoachesLandingPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
