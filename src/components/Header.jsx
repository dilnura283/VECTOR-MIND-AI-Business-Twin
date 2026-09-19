export default function Header({ view, setView, theme, toggleTheme }) {
  const tabs = [
    { id: "home", label: "Bosh sahifa" },
    { id: "credit", label: "Kredit olish" },
    { id: "twin", label: "AI" }
  ];

  return (
    <header>
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark" />
          AI Business Twin
        </div>
        <div className="view-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`view-tab ${view === t.id ? "active" : ""}`}
              onClick={() => setView(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Mavzuni almashtirish">
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </nav>
    </header>
  );
}
