import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { assignDogToWalker, getEligibleDogsForWalker } from "../apiManager";

export default function WalkerAssigning () {
  const { id } = useParams();
  const walkerId = Number(id);
  const [dog, setDog] = useState([])
  const nav = useNavigate();

  useEffect(() => {
      getEligibleDogsForWalker(walkerId).then(setDog);
  }, [walkerId]);

  const handleAssigning = async (dogId) => {
    await assignDogToWalker(walkerId, dogId);
    nav(`/dogs/${dogId}`);
  }

  return (
    <main style={{ padding: '1rem' }}>
      <h2>Assign a Dog</h2>
      <p><Link to="/walkers">Back to Walkers</Link></p>

      <ul>
        {dog.map(d => (
          <li key={d.id}>
            <strong>{d.name}</strong> — {d.city} {d.walker ? `(currently with ${d.walker})` : '(unassigned)'}
           <button onClick={() => handleAssigning(d.id)}>Assign</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
