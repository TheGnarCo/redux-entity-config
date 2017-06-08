import expect from 'expect';
import { noop } from 'lodash';

import ReduxEntityConfig, { configSchema } from '../index';
import stubs from './stubs';

const userStub = stubs.users.valid;

describe('ReduxEntityConfig - class', () => {
  it('sets properties when created', () => {
    const createFunc = noop;
    const entityName = 'users';
    const config = new ReduxEntityConfig({ createFunc, entityName });

    expect(config.createFunc).toEqual(createFunc);
    expect(config.entityName).toEqual(entityName);
  });

  it('sets the default schema', () => {
    const entityName = 'users';
    const config = new ReduxEntityConfig({ entityName });

    expect(config.schema).toEqual(configSchema(entityName));
  });

  describe('#actionTypes', () => {
    it('returns action types prefixed with the entity name', () => {
      const config = new ReduxEntityConfig({ entityName: 'users' });
      const { actionTypes } = config;

      expect(actionTypes).toEqual({
        CLEAR_ERRORS: 'users_CLEAR_ERRORS',
        CREATE_FAILURE: 'users_CREATE_FAILURE',
        CREATE_REQUEST: 'users_CREATE_REQUEST',
        CREATE_SUCCESS: 'users_CREATE_SUCCESS',
        DESTROY_FAILURE: 'users_DESTROY_FAILURE',
        DESTROY_REQUEST: 'users_DESTROY_REQUEST',
        DESTROY_SUCCESS: 'users_DESTROY_SUCCESS',
        LOAD_ALL_SUCCESS: 'users_LOAD_ALL_SUCCESS',
        LOAD_FAILURE: 'users_LOAD_FAILURE',
        LOAD_REQUEST: 'users_LOAD_REQUEST',
        LOAD_SUCCESS: 'users_LOAD_SUCCESS',
        UPDATE_FAILURE: 'users_UPDATE_FAILURE',
        UPDATE_REQUEST: 'users_UPDATE_REQUEST',
        UPDATE_SUCCESS: 'users_UPDATE_SUCCESS',
      });
    });
  });

  describe('#_genericRequest', () => {
    it('throws an error when the type is not recognized', () => {
      const config = new ReduxEntityConfig({ entityName: 'users' });

      expect(() => config._genericRequest('foobar')).toThrow('Unknown request type: foobar');
    });
  });

  describe('#_parse', () => {
    const apiResponse = {
      users: [userStub],
    };

    context('when there is no parseApiResponseFunc or parseEntityFunc', () => {
      const config = new ReduxEntityConfig({ entityName: 'users' });

      it('returns the api response', () => {
        expect(config._parse(apiResponse)).toEqual(apiResponse);
      });
    });

    context('when there is a parseApiResponseFunc and no parseEntityFunc', () => {
      const parseApiResponseFunc = r => r.users;
      const config = new ReduxEntityConfig({
        entityName: 'users',
        parseApiResponseFunc,
      });

      it('returns the result of the parseApiResponseFunc', () => {
        expect(config._parse(apiResponse)).toEqual([userStub]);
      });
    });

    context('when there is a parseEntityFunc and no parseApiResponseFunc', () => {
      const parseEntityFunc = u => u.name;
      const config = new ReduxEntityConfig({
        entityName: 'users',
        parseEntityFunc,
      });

      it('returns the result of the parseEntitiesFunc when the response is an array', () => {
        const { users } = apiResponse;

        expect(config._parse(users)).toEqual(['Gnar Mike']);
      });

      it('throws an error when the response is not an array', () => {
        expect(() => config._parse(apiResponse)).toThrow('parseEntityFunc must be called on an array. Use the parseApiResponseFunc to format the response correctly.');
      });
    });
  });

  describe('#actions', () => {
    const config = new ReduxEntityConfig({ entityName: 'users' });
    const { actions } = config;

    it('returns all actions', () => {
      expect(actions).toEqual({
        clearErrors: config._clearErrors,
        create: config._genericThunkAction('CREATE'),
        createFailure: config._genericFailure('CREATE'),
        createRequest: config._genericRequest('CREATE'),
        createSuccess: config._genericSuccess('CREATE'),
        destroy: config._genericThunkAction('DESTROY'),
        destroyFailure: config._genericFailure('DESTROY'),
        destroyRequest: config._genericRequest('DESTROY'),
        destroySuccess: config._genericSuccess('DESTROY'),
        load: config._genericThunkAction('LOAD'),
        loadAll: config._genericThunkAction('LOAD_ALL'),
        loadAllSuccess: config._genericSuccess('LOAD_ALL'),
        loadFailure: config._genericFailure('LOAD'),
        loadRequest: config._genericRequest('LOAD'),
        loadSuccess: config._genericSuccess('LOAD'),
        silentCreate: config._genericThunkAction('CREATE', { silent: true }),
        silentDestroy: config._genericThunkAction('DESTROY', { silent: true }),
        silentLoad: config._genericThunkAction('LOAD', { silent: true }),
        silentLoadAll: config._genericThunkAction('LOAD_ALL', { silent: true }),
        silentUpdate: config._genericThunkAction('UPDATE', { silent: true }),
        successAction: config.successAction,
        update: config._genericThunkAction('UPDATE'),
        updateFailure: config._genericFailure('UPDATE'),
        updateRequest: config._genericRequest('UPDATE'),
        updateSuccess: config._genericSuccess('UPDATE'),
      });
    });

    describe('#clearErrors', () => {
      it('returns an action with the correct type', () => {
        expect(actions.clearErrors()).toEqual({
          type: 'users_CLEAR_ERRORS',
        });
      });
    });

    describe('create actions', () => {
      describe('#createRequest', () => {
        it('returns the correct action type', () => {
          expect(actions.createRequest()).toEqual({
            type: 'users_CREATE_REQUEST',
          });
        });
      });

      describe('#createFailure', () => {
        it('sets the errors in the payload', () => {
          const errors = { base: 'something went wrong' };

          expect(actions.createFailure(errors)).toEqual({
            type: 'users_CREATE_FAILURE',
            payload: { errors },
          });
        });
      });

      describe('#createSuccess', () => {
        it('sets the data in the payload', () => {
          const data = { id: 1, name: 'Mike' };

          expect(actions.createSuccess(data)).toEqual({
            type: 'users_CREATE_SUCCESS',
            payload: { data },
          });
        });
      });
    });

    describe('destroy actions', () => {
      describe('#destroyRequest', () => {
        it('returns the correct action type', () => {
          expect(actions.destroyRequest()).toEqual({
            type: 'users_DESTROY_REQUEST',
          });
        });
      });

      describe('#destroySuccess', () => {
        it('sets the data in the payload', () => {
          const data = { id: 1, name: 'Mike' };

          expect(actions.destroySuccess(data)).toEqual({
            type: 'users_DESTROY_SUCCESS',
            payload: { data },
          });
        });
      });

      describe('#destroyFailure', () => {
        it('sets the errors in the payload', () => {
          const errors = { base: 'something went wrong' };

          expect(actions.destroyFailure(errors)).toEqual({
            type: 'users_DESTROY_FAILURE',
            payload: { errors },
          });
        });
      });
    });

    describe('load actions', () => {
      describe('#loadRequest', () => {
        it('returns the correct action type', () => {
          expect(actions.loadRequest()).toEqual({
            type: 'users_LOAD_REQUEST',
          });
        });
      });

      describe('#loadAllSuccess', () => {
        it('sets the data in the payload', () => {
          const data = { id: 1, name: 'Mike' };

          expect(actions.loadAllSuccess(data)).toEqual({
            type: 'users_LOAD_ALL_SUCCESS',
            payload: { data },
          });
        });
      });

      describe('#loadSuccess', () => {
        it('sets the data in the payload', () => {
          const data = { id: 1, name: 'Mike' };

          expect(actions.loadSuccess(data)).toEqual({
            type: 'users_LOAD_SUCCESS',
            payload: { data },
          });
        });
      });

      describe('#loadFailure', () => {
        it('sets the errors in the payload', () => {
          const errors = { base: 'something went wrong' };

          expect(actions.loadFailure(errors)).toEqual({
            type: 'users_LOAD_FAILURE',
            payload: { errors },
          });
        });
      });
    });

    describe('update actions', () => {
      describe('#updateRequest', () => {
        it('returns the correct action type', () => {
          expect(actions.updateRequest()).toEqual({
            type: 'users_UPDATE_REQUEST',
          });
        });
      });

      describe('#updateSuccess', () => {
        it('sets the data in the payload', () => {
          const data = { id: 1, name: 'Mike' };

          expect(actions.updateSuccess(data)).toEqual({
            type: 'users_UPDATE_SUCCESS',
            payload: { data },
          });
        });
      });

      describe('#updateFailure', () => {
        it('sets the errors in the payload', () => {
          const errors = { base: 'something went wrong' };

          expect(actions.updateFailure(errors)).toEqual({
            type: 'users_UPDATE_FAILURE',
            payload: { errors },
          });
        });
      });
    });
  });
});
