import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

/*
Tests should follow how a user would use the component/screen

- user interacts with something (click, selection dropdown, typing, tab)
- user waits for something
- user expects to see (or NOT see) something
*/

describe('<App />', () => {
  it('does something', () => {
    expect(true).toBe(true);
  })

  it('searches for pokemon based off what the user types in the box when they click to search', async () => {
    render(<App />);
    userEvent.type(screen.getByLabelText('Name of pokemon'), 'Charmander');
    userEvent.click(screen.getByRole('button', { name: 'Search' }));
  });
})