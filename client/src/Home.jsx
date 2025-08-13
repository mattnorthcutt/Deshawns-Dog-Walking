import { getDogs } from "./apiManager";
import { useEffect, useState } from "react";
import DogCard from "./components/DogsCard";

export default function Home() {
  const [dogs, setDogs] = useState([]);

  const getTheDogs = () => {
    getDogs().then(setDogs)
  }

  useEffect(() => {
    getTheDogs();
  }, []);

  return (
    <main style={{ padding: "1rem"}}>
      <h2>All The Dogs</h2>
      {dogs.length ? (
        <div>
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      ) : (
        <p>No Dogs Yet</p>
      )}
    </main>
  );

}
