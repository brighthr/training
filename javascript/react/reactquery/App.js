import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [species, setSpecies] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const [errorLoadingSpecies, setErrorLoadingSpecies] = useState(false);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon-species/')
            .then(res=>res.json())
            .then(data => {
              setSpecies(data.results);
              setLoadingSpecies(false);
            })
            .catch(() => {
              setErrorLoadingSpecies(true);
              setLoadingSpecies(false);
            });
  }, [])

  if (loadingSpecies) {
    return <div>LOADING</div>
  }

  if (errorLoadingSpecies) {
    return <div>Error loading the things - refresh to try again</div>
  }

  return (
    <ul className="grid grid-cols-4 gap-4">
        {species.map((pok) => (<li className="h-24 border border-red-500 p-4">{pok.name}</li>))}
    </ul>
  );
}

export default App;
