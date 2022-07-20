import React from 'react';
import axios from 'axios';
import './App.css';

class AppClass extends React.Component {
    constructor() {
		super();

		this.state = {
			gameData: [],
			loadingGameData: true,
			errorLoadingGameData: false
		};
	}

    componentDidMount() {
        const options = {
            method: 'GET',
            url: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/info',
            headers: {
              'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
              'X-RapidAPI-Key': '903a97b45fmshfc4bb309cd17b2cp16f23bjsn89247a334f3b'
            }
        };

        axios.request(options).then((response) => {
            this.setState({
                gameData: response.data,
                loadingGameData: false
            });
        }).catch((error) => {
            this.setState({
                errorLoadingGameData: true,
                loadingGameData: false
            })
        });
    }

    render() {
        const { gameData, loadingGameData, errorLoadingGameData } = this.state;

        if (loadingGameData) {
            return <div>LOADING</div>
        }
        
        if (errorLoadingGameData) {
            return <div>Error loading hearthstone game data - refresh to try again</div>
        }

        return (
            <ul className="grid grid-cols-4 gap-4">
                {gameData.classes.map((hearthstoneClass) => 
                    (
                        <li className="h-24 border border-red-500 p-4">{hearthstoneClass}</li>
                    )
                )}
            </ul>
        );
    }
}

export default AppClass;