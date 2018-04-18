import expect from 'expect';

import ReduxEntityConfig, { configSchema } from '../src/config';
import stubs from './stubs';

const userStub = stubs.users.valid;

const schemas = {
  USERS: configSchema('users'),
};

describe('ReduxEntityConfig - reducer', () => {
  const state = {
    loading: false,
    sortedIds: [userStub.id],
    errors: {},
    data: {
      [userStub.id]: userStub,
    },
  };

  describe('initial state', () => {
    it('is set to the ReduxEntityConfig initial state', () => {
      const action = { type: 'FOOBAR' };
      const config = new ReduxEntityConfig({ entityName: 'users', schema: schemas.USERS });

      expect(config.reducer(undefined, action)).toEqual(ReduxEntityConfig.initialState);
    });
  });

  describe('creating an entity', () => {
    const config = new ReduxEntityConfig({
      entityName: 'users',
      schema: schemas.USERS,
    });
    const { actions, reducer } = config;

    describe('request action', () => {
      it('sets the loading attribute', () => {
        const newState = reducer(ReduxEntityConfig.initialState, actions.createRequest());

        expect(newState).toEqual({
          ...ReduxEntityConfig.initialState,
          loading: true,
        });
      });
    });

    describe('successful action', () => {
      it('adds the user to state', () => {
        const createSuccessAction = actions.successAction([userStub], actions.createSuccess);

        const newState = reducer(ReduxEntityConfig.initialState, createSuccessAction);

        expect(newState).toEqual({
          loading: false,
          errors: {},
          sortedIds: [userStub.id],
          data: {
            [userStub.id]: userStub,
          },
        });
      });

      it('appends the id to sortedIds', () => {
        const createSuccessAction = actions.successAction([userStub], actions.createSuccess);
        const initialState = { ...ReduxEntityConfig.initialState, sortedIds: [0, 2] };

        const newState = reducer(initialState, createSuccessAction);

        expect(newState.sortedIds).toEqual([0, 2, 1]);
      });
    });

    describe('unsuccessful action', () => {
      it('adds the errors to state', () => {
        const errors = { base: 'User is not authenticated' };
        const createFailureAction = actions.createFailure(errors);

        const newState = reducer(ReduxEntityConfig.initialState, createFailureAction);

        expect(newState).toEqual({
          loading: false,
          errors,
          sortedIds: [],
          data: {},
        });
      });
    });
  });

  describe('destroying an entity', () => {
    const config = new ReduxEntityConfig({
      entityName: 'users',
      schema: schemas.USERS,
    });
    const { actions, reducer } = config;

    describe('successful action', () => {
      it('removes the user from state', () => {
        const destroySuccessAction = actions.destroySuccess({ id: userStub.id });

        const newState = reducer(state, destroySuccessAction);

        expect(newState).toEqual({
          loading: false,
          errors: {},
          sortedIds: [],
          data: {},
        });
      });

      it('removes the id from sortedIds', () => {
        const destroySuccessAction = actions.destroySuccess({ id: userStub.id });
        const initialState = { ...ReduxEntityConfig.initialState, sortedIds: [userStub.id, 2, 3] };

        const newState = reducer(initialState, destroySuccessAction);

        expect(newState.sortedIds).toEqual([2, 3]);
      });
    });

    describe('unsuccessful action', () => {
      it('adds the errors to state', () => {
        const errors = { base: 'User is not authenticated' };
        const destroyFailureAction = actions.destroyFailure(errors);

        const newState = reducer(state, destroyFailureAction);

        expect(newState).toEqual({
          ...state,
          errors,
        });
      });
    });
  });

  describe('loading an entity', () => {
    const config = new ReduxEntityConfig({
      entityName: 'users',
      schema: schemas.USERS,
    });
    const { actions, reducer } = config;

    describe('successful action', () => {
      it('adds the user to state', () => {
        const loadSuccessAction = actions.successAction([userStub], actions.loadSuccess);

        const newState = reducer(ReduxEntityConfig.initialState, loadSuccessAction);

        expect(newState).toEqual({
          loading: false,
          errors: {},
          sortedIds: [userStub.id],
          data: {
            [userStub.id]: userStub,
          },
        });
      });

      it('appends a new user to the end of sortedIds', () => {
        const loadSuccessAction = actions.successAction([userStub], actions.loadSuccess);

        const initialState = { ...ReduxEntityConfig.initialState, sortedIds: [0, 2] };
        const newState = reducer(initialState, loadSuccessAction);

        expect(newState.sortedIds).toEqual([0, 2, 1]);
      });

      it('leaves an existing user in place in sortedIds', () => {
        const loadSuccessAction = actions.successAction([userStub], actions.loadSuccess);

        const initialState = { ...ReduxEntityConfig.initialState, sortedIds: [0, 1, 2] };
        const newState = reducer(initialState, loadSuccessAction);

        expect(newState.sortedIds).toEqual([0, 1, 2]);
      });
    });

    describe('unsuccessful action', () => {
      it('adds the errors to state', () => {
        const errors = { base: 'User is not authenticated' };
        const loadFailureAction = actions.loadFailure(errors);

        const newState = reducer(ReduxEntityConfig.initialState, loadFailureAction);

        expect(newState).toEqual({
          loading: false,
          errors,
          sortedIds: [],
          data: {},
        });
      });
    });
  });

  describe('loading all entities', () => {
    const config = new ReduxEntityConfig({
      entityName: 'users',
      schema: schemas.USERS,
    });
    const { actions, reducer } = config;
    const newUser = { id: 101, name: 'Joe Schmoe' };

    describe('successful action', () => {
      it('replaces the users in state', () => {
        const loadAllSuccessAction = actions.successAction([newUser], actions.loadAllSuccess);

        const newState = reducer(state, loadAllSuccessAction);

        expect(newState).toEqual({
          loading: false,
          errors: {},
          sortedIds: [101],
          data: {
            101: newUser,
          },
        });
      });
    });
  });

  describe('updating an entity', () => {
    const config = new ReduxEntityConfig({
      entityName: 'users',
      schema: schemas.USERS,
    });
    const { actions, reducer } = config;
    const newUser = { ...userStub, name: 'Kolide', something: 'else' };

    describe('successful action', () => {
      const updateSuccessAction = actions.successAction([newUser], actions.updateSuccess);

      it('replaces the user in state', () => {
        const newState = reducer(state, updateSuccessAction);

        expect(newState).toEqual({
          loading: false,
          errors: {},
          sortedIds: [userStub.id],
          data: {
            [userStub.id]: newUser,
          },
        });
      });

      it('leaves the id in place in sortedIds', () => {
        const newState = reducer({ ...state, sortedIds: [0, 1, 2] }, updateSuccessAction);

        expect(newState.sortedIds).toEqual([0, 1, 2]);
      });
    });

    describe('unsuccessful action', () => {
      const errors = { base: 'User is not authenticated' };
      const updateFailureAction = actions.updateFailure(errors);

      const newState = reducer(state, updateFailureAction);

      it('adds the errors to state', () => {
        expect(newState).toEqual({
          ...state,
          errors,
        });
      });
    });
  });

  describe('clear errors', () => {
    const errorState = {
      loading: false,
      errors: {
        base: 'User is not authenticated',
      },
      sortedIds: [userStub.id],
      data: {
        [userStub.id]: userStub,
      },
    };
    const config = new ReduxEntityConfig({
      entityName: 'users',
      schema: schemas.USERS,
    });
    const { actions, reducer } = config;

    it('resets the entity errors', () => {
      const newState = reducer(errorState, actions.clearErrors());

      expect(newState).toEqual({
        ...errorState,
        errors: {},
      });
    });
  });
});
