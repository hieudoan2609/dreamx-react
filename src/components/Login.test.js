import React from "react";
import { Provider } from "react-redux";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

import Login from "./Login";
import store from "../store";
import {
  APP_INITIALIZE,
  ACCOUNT_LOGIN,
  RESET_INITIAL_STATE
} from "../actions/types";

afterEach(() => {
  store.dispatch({
    type: RESET_INITIAL_STATE
  });
  global.ethereum = undefined;
  cleanup();
});

it("renders without crashing", () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
});

it("when not logged in", () => {
  const { container } = render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  expect(container).toMatchSnapshot();
});

it("when logged in", async () => {
  global.ethereum = {
    networkVersion: "3",
    isMetaMask: true,
    enable: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(["0x4e30dba9762aba125f5ab81647edebff9f9df7a7"]);
      });
    })
  };
  store.dispatch({
    type: APP_INITIALIZE,
    payload: {
      address: "0x45717b73011AD0fB45bF70a336563B32873E7b23",
      networkId: "3",
      networkName: "Ropsten"
    }
  });

  const { getByText, container } = render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  fireEvent.click(getByText(/^Connect$/i));

  expect(await waitForElement(() => getByText(/Welcome!/i))).toBeTruthy();

  expect(container).toMatchSnapshot();
});

it("when metamask is not installed", async () => {
  global.ethereum = undefined;

  const { getByText, container } = render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  fireEvent.click(getByText(/^Connect$/i));

  expect(
    await waitForElement(() => getByText(/MetaMask is not installed/i))
  ).toBeTruthy();

  expect(container).toMatchSnapshot();
});

it("when metamask is on the wrong network", async () => {
  global.ethereum = {
    networkVersion: "1",
    isMetaMask: true,
    enable: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(["0x4e30dba9762aba125f5ab81647edebff9f9df7a7"]);
      });
    })
  };
  store.dispatch({
    type: APP_INITIALIZE,
    payload: {
      address: "0x45717b73011AD0fB45bF70a336563B32873E7b23",
      networkId: "3",
      networkName: "Ropsten"
    }
  });

  const { getByText, container } = render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  fireEvent.click(getByText(/^Connect$/i));

  expect(
    await waitForElement(() => getByText(/Wrong network detected/i))
  ).toBeTruthy();

  expect(container).toMatchSnapshot();
});

// it("when log out", async () => {
//   store.dispatch({
//     type: ACCOUNT_LOGIN,
//     payload: { address: "0x4E30dBA9762ABa125f5Ab81647eDEbFF9f9DF7a7" }
//   });

//   const { getByText, container } = render(
//     <Provider store={store}>
//       <Login />
//     </Provider>
//   );

//   fireEvent.click(getByText(/Disconnect/i));

//   expect(
//     await waitForElement(() =>
//       getByText(/Connect to MetaMask to manage your account/i)
//     )
//   ).toBeTruthy();

//   expect(container).toMatchSnapshot();
// });
