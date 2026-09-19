import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import { Problem, Steps, Pricing } from "./components/StaticSections.jsx";
import CreditCalculator from "./components/CreditCalculator.jsx";
import BankList from "./components/BankList.jsx";
import Roadmap from "./components/Roadmap.jsx";
import TwinApp from "./components/TwinApp.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <>
      <Header view={view} setView={setView} theme={theme} toggleTheme={toggleTheme} />

      <div className={`view ${view === "home" ? "active" : ""}`}>
        <Hero setView={setView} />
        <Problem />
        <Steps />
        <Roadmap />
        <Pricing />
      </div>

      <div className={`view ${view === "credit" ? "active" : ""}`}>
        <CreditCalculator />
        <BankList />
      </div>

      <div className={`view ${view === "twin" ? "active" : ""}`}>
        <TwinApp />
      </div>

      <Footer />
    </>
  );
}
