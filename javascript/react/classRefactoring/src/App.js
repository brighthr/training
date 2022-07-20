import React, { useState, useEffect } from 'react';
import http from './services/http';
import config from './config';
import './App.css';

const App = () => {
    const [hearthstoneClasses, setHearthstoneClasses] = useState([]);
    const [loadingGameData, setLoadingGameData] = useState(true);
    const [errorLoadingGameData, setErrorLoadingGameData] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const { HEARTHSTONE_API_URL } = config;
            const { get } = http;
            const { success, error, response } = await get(HEARTHSTONE_API_URL);

            if(success) {
                setHearthstoneClasses(response.data.classes);
                setLoadingGameData(false);
            }

            if(error) {
                setErrorLoadingGameData(true);
                setLoadingGameData(false);
            }
        }
        loadData();
    })

    if (loadingGameData) {
        return <div>LOADING</div>
    }

    if (errorLoadingGameData) {
        return <div>Error loading hearthstone game data - refresh to try again</div>
    }

    return (
            <ul className="grid grid-cols-4 gap-4">
                {hearthstoneClasses.map((hearthstoneClass) => 
                    (
                        <li className="h-24 border border-red-500 p-4">{hearthstoneClass}</li>
                    )
                )}
            </ul>
        );
}

export default App;
