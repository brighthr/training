import React from 'react';
import http from './services/http';
import config from './config';
import './App.css';

class AppClass extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
			hearthstoneClasses: [],
			loadingGameData: true,
			errorLoadingGameData: false
		};
	}

    async componentDidMount() {
        const { HEARTHSTONE_API_URL } = config;
        const { get } = http;
        const { success, error, response } = await get(HEARTHSTONE_API_URL);

        if(success) {
            this.setState({
                hearthstoneClasses: response.data.classes,
                loadingGameData: false
            });
        }

        if(error) {
            this.setState({
                errorLoadingGameData: true,
                loadingGameData: false
            })
        }
    }

    render() {
        const { hearthstoneClasses, loadingGameData, errorLoadingGameData } = this.state;

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
}

export default AppClass;