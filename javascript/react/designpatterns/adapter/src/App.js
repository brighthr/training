/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import './App.css';
import {get} from './http'

function App() {
  const [gameData, setGameData] = useState([]);
  const [loadingGameData, setLoadingGameData] = useState(true);
  const [errorLoadingGameData, setErrorLoadingGameData] = useState(false);



  useEffect(() => {
    const getRequest = async () => {
      const {success,error, response} = await get('https://omgvamp-hearthstone-v1.p.rapidapi.com/info')

      if (success) {
        setGameData(response.data)
      } 
      if (error) {
        setErrorLoadingGameData(true)
      }
      setLoadingGameData(false)
    }

    getRequest()
  }, [])

  if (loadingGameData) {
    return <div>LOADING</div>
  }

  if (errorLoadingGameData) {
    return <div>Error loading hearthstone game data - refresh to try again</div>
  }

  return (
    <ul className="grid grid-cols-4 gap-4">
        {gameData.classes.map((hearthstoneClass) => (<li className="h-24 border border-red-500 p-4">{hearthstoneClass}</li>))}
    </ul>
  );
}

export default App;
