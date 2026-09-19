import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Roadmap() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getRoadmap().then(setItems).catch((e) => setError(e.message));
  }, []);

  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <h2>Yo'l xaritasi</h2>
          <p>Loyihaning hozirgi holati va keyingi bosqichlari.</p>
        </div>
        {error && <div className="status-line error">{error}</div>}
        <div className="roadmap">
          {items.map((it) => (
            <div className={`rm-item ${it.done ? "" : "future"}`} key={it.title}>
              <div className="rm-tag">{it.tag}</div>
              <h3>{it.title}</h3>
              <p>{it.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
