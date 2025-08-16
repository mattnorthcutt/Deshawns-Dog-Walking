import { Link } from "react-router-dom"
import { deleteDog } from "../apiManager";
import { useState } from "react";

export default function DogCard ({ dog }) {
  const [dogs, setDogs] = useState([])
  return (
    <div className="dog-card">
      <h4 className="dog-name">{dog.name}</h4>
      <h3>
        <Link to={`/dogs/${dog.id}`}>View Details</Link>
      </h3>
      <button
        onClick={async () => {
          await deleteDog(dog.id);
          setDogs(prev => prev.filter(x => x.id !== d.id));
        }}
      >
        Remove
      </button>
      <p className="dog-meta">
      </p>
    </div>
  )
}
