import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCities } from "./apiManager";

export default function Cities() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCities().then(setCities);
  }, []);

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Cities</h2>
      <p><Link to="/">Back Home</Link></p>

      <p>
        <Link to="/cities/new">+ Add City</Link>
      </p>

      {cities.length === 0 ? (
        <p>No cities yet.</p>
      ) : (
        <ul>
          {cities.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
