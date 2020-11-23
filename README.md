# react-ghost-test
Test utilities for [react-ghost](https://www.npmjs.com/package/react-ghost)

# Usage
```jsx
import { crate, getTestUtils } from 'react-ghost-test'

const { waitForState, checkDispatch } = getTestUtils;

describe('init', () => {
  test('create app actor', async () => {
    await waitForState(
      () => create(ghost(
        StoreProvider,
        { value: store },
        ghost(AppActor),
      )),
      [
        (state) => expect(state).toHaveProperty('main'),
      ],
    );
  });

  test('boot', async () => {
    await checkDispatch(
      mainActions.boot('main'),
      [
        (state) => state.toHaveProperty('main.booting', true),
        (state) => state.toMatchObject({
          main: {
            booted: true,
            booting: false,
          },
          history: {
            location: { pathname: '/' },
          },
        }),
        (state) => state.toMatchObject({
          homePage: {
            title: 'Home Page',
          },
        }),
      ],
    );
  });
});
```
