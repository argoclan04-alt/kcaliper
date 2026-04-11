import "@/v2/App.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import LandingPage from "./pages/LandingPage";
import CoachesLandingPage from "./components/landing/CoachesLandingPage";
import NosotrosPage from "./pages/NosotrosPage";

// Exporting components so main App.tsx can render them directly
export { LandingPage, CoachesLandingPage, NosotrosPage };

function App({ children }) {
  return (
    <LanguageProvider>
      <div className="App v2-scope">
        {children}
      </div>
    </LanguageProvider>
  );
}

export default App;
