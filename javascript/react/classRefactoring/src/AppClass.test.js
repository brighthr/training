/* eslint-disable testing-library/await-async-query */
/* eslint-disable testing-library/prefer-find-by */
import { render, screen, waitFor } from '@testing-library/react';
import http from './services/http';
import AppClass from './AppClass';

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

    
})