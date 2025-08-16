import { Link } from "react-router-dom"

export default function DogCard ({ dog }) {
  return (
    <div className="dog-card">
      <h4 className="dog-name">{dog.name}</h4>
      <h3>
        <Link to={`/dogs/${dog.id}`}>View Details</Link>
      </h3>
      <p className="dog-meta">
      </p>
    </div>
  )
}
