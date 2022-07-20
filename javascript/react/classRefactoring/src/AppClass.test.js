/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/prefer-find-by */
import { render, screen, waitFor } from '@testing-library/react';
import http from './services/http';
import App from './App';

jest.mock('./services/http');

const mockHearthstoneApi = {
    data: {
        classes: [
            'Death Knight',
            'Hunter',
            'Mage'
        ]
    }
}

describe('<AppClass />', () => {
    it('renders a loading spinner when the app is loading', () => {
        http.get.mockImplementation(() => new Promise(() => {}));
        render(<App />);
        expect(screen.getByText('LOADING')).toBeTruthy();
    });

    it('renders an error message when the app throws an error loading data', async () => {
        http.get.mockResolvedValue({
            success: false,
            error: true
        });

        render(<App />);

        await waitFor(() => expect(screen.getByText('Error loading hearthstone game data - refresh to try again')).toBeTruthy())
    });

    it('renders game data when the api successfully returns data', async () => {
        http.get.mockResolvedValue({
            success: true,
            response: mockHearthstoneApi
        });

        render(<App />);

        await waitFor(() => expect(screen.getByText('Death Knight')).toBeTruthy());
    });
    
})