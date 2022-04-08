# Testing

## Why?

To test that our app is behaving in the way we want.

    Note: Not "correctly" - the way we want; what's important to US

That means different things for different circumstances, businesses and teams. 

If clicking a button on a page does something and its important to us that it KEEPS doing that thing, we should write a test around it. 

If a user doing something on a page breaks it and we didnt realise, we should write a test around it.

## Good tests?

With that in mind, what makes a good test? Again in it's simplest terms we want to be able to test the things our users will see, and emulate the way they would interact with our app.

## Writing tests

You could argue in it's most simple terms, you can expect to write 2 types of tests in frontend.

Pure logic - "Does 1 + 2 equal 3 like I expect?"
User interaction - "When a user clicks this button, do they see the thing I expect?"

Jest has always been good at pure logic, user interation is a more complicated story

## Enzyme vs RTL

Enzyme used to be the de-facto standard for front-end unit testing, it exists in our codebase in more legacy files and there is work being done to migrate all the old files into RTL.

Why did we switch? The core principals of the two libraries differed in a crucial way:

Enzyme, tests implementation
RTL, tests interaction

```js
// Enzyme tests

beforeEach(() => {
    element = shallow(<CopyModal {...props}>Some text</CopyModal>);
});

it('displays a CopyUserList on the second modal screen', () => {
    element.setState({ modal: 'confirm' });
    element.update();
    expect(element.find(CopyUserList)).toHaveLength(1);
});
```
The test is hard-coupled to implementation details, we aren't testing how the user would use this component, we're testing that WHEN we call setState with a certain state value, and then force the component to update, then we expect another component file to exist within it.

Not ideal...

```js
/// RTL test
it('shouldnt render a "Create a job post" button if recruitment is disabled', () => {
    renderWithRouter(<FabButton />);
    userEvent.click(screen.getByRole('button'));

    expect(
        screen.queryByRole('link', { name: 'Create a job post' })
    ).toBeNull();
});
```
Much better - we render the component, we emulate the users interaction (them clicking on it) and we assert the thing doesnt exist on the screen. Simple!

## Writing RTL tests

Tests should follow how a user would use the component/screen

1. user interacts with something (click, selection dropdown, typing, tab)
2. user waits for something
3. user expects to see (or NOT see) something