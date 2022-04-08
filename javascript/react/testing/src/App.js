import React, { useState } from 'react';
import { fetchPokemonByName } from './api';

const App = () => {
  const [value, setValue] = useState('');

  return (
    <div>
      <label htmlFor="nameOfPokemon">Name of pokemon</label>
      <input id="nameOfPokemon" name="nameOfPokemon" value={value} onChange={e => setValue(e.target.value) }/>
      <button onClick={()=> fetchPokemonByName(value)}>Search</button>
      <button>Im an annoying second button</button>
    </div>
  )
}

export default App;