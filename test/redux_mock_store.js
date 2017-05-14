import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

export default (store = {}) => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  return mockStore(store);
};
