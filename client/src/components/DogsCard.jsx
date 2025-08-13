export default function DogCard ({ dog }) {
  return (
    <div className="dog-card">
      <h4 className="dog-name">{dog.name}</h4>
      <p className="dog-meta">
        City: <strong>{dog.city ?? 'Unknown'}</strong><br />
        Walker: <strong>{dog.walker ?? 'Unassigned'}</strong>
      </p>
    </div>
  )
}
