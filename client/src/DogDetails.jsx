import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getADog } from "./apiManager";

export default function DogDetails() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);

  useEffect(() => {
    getADog(id).then(setDog)
  }, [id])

  {/* This is to prevent accessing dog.name before dog even existed so it doesn't throw errors at us. Simple way to fix the issue. Dont render fields until the data is ready */}
  if (dog === null) return <p>Loading Dogs</p>;
  if (dog == undefined) return <p>Couldn't Load Dog</p>

  return (
    <main style={{ padding: "1rem"}}>
      <h2>{dog.name}</h2>
      <Link to="/">Back Home</Link>

      <div className="dog-card" style={{ maxWidth: 480 }}>
        <p>
          <strong>City:</strong> {dog.city ?? "Unknown"}
        </p>
        <p>
          <strong>Walker:</strong> {dog.walker ?? "Unassigned"}
        </p>
      </div>
    </main>
  )
}
