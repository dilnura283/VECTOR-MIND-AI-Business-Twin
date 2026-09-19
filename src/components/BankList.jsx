import { useEffect, useState } from "react";
import { api } from "../api.js";

function formatSom(n) {
  return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}

export default function BankList() {
  const [banks, setBanks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getBanks().then(setBanks).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="band">
      <div className="wrap">
        <div className="section-head">
          <h2>Hamkor banklar</h2>
          <p>Har bir bankning minimal talablari — bular bizning skoring bilan avtomatik solishtiriladi.</p>
        </div>
        {error && <div className="status-line error">{error}</div>}
        <div className="bank-grid">
          {banks.map((b) => (
            <div className="bank-card" key={b.id}>
              <h3>{b.name}</h3>
              <div className="min">Min. ball: {b.minScore} · Min. daromad: {formatSom(b.minMonthlyRevenue)}</div>
              <span className="bank-status pass">{(b.rate * 100).toFixed(0)}% yillik stavka</span>
              <ul className="bank-reqs">
                {b.reqs.map((r) => <li key={r}>— {r}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
