import { useEffect, useState } from "react";
import { getCities, getWalkers } from "./apiManager";
import { Link } from "react-router-dom";

export default function Walkers() {
  const [city, setCity] = useState([])
  const [walkers, setWalkers] = useState([]);
  const [cityId, setCityId] = useState("");

  useEffect(() => {
    getCities().then(setCity)
  }, [])

   useEffect(() => {
    const id = cityId ? Number(cityId) : undefined;
    getWalkers(id).then(setWalkers);
  }, [cityId]);

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Walkers</h2>
      <p><Link to="/">Back Home</Link></p>

      <label style={{ display: "block", marginBottom: 8 }}>
        Filter by City:
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
        >
          <option value="">All Cities</option>
          {city.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <ul>
        {walkers.map((w) => (
          <li key={w.id}>{w.name}</li>
        ))}
      </ul>
    </main>
  );
}
