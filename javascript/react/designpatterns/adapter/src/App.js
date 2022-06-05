/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [gameData, setGameData] = useState([]);
  const [loadingGameData, setLoadingGameData] = useState(true);
  const [errorLoadingGameData, setErrorLoadingGameData] = useState(false);

  const options = {
      method: 'GET',
      url: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/info',
      headers: {
        'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '903a97b45fmshfc4bb309cd17b2cp16f23bjsn89247a334f3b'
      }
  };

  useEffect(() => {
      axios.request(options).then(function (response) {
          setGameData(response.data);
          setLoadingGameData(false);
          console.log(response.data);
      }).catch(function (error) {
          setErrorLoadingGameData(true);
          setLoadingGameData(false);
          console.error(error);
      });
  }, [options])

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
