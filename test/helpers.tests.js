import expect from 'expect';
import { schema } from 'normalizr';

import helpers from '../src/helpers';

const {
  configSchema,
  entitiesExceptID,
  formatErrorResponse,
} = helpers;

describe('ReduxEntityConfig - helpers', () => {
  describe('#configSchema', () => {
    it('returns an instance of normalizr schema.Entity', () => {
      const userSchema = configSchema('users');

      expect(userSchema instanceof schema.Entity).toEqual(true);
    });
  });

  describe('#entitiesExceptID', () => {
    it('returns an empty object if all ids are deleted', () => {
      const entities = {
        1: { name: 'Gnar' },
      };
      const id = 1;

      expect(entitiesExceptID(entities, id)).toEqual({});
    });

    it('removes the object with the key of the specified id', () => {
      const entities = {
        1: { name: 'Gnar' },
        2: { name: 'Dog' },
      };
      const id = 1;

      expect(entitiesExceptID(entities, id)).toEqual({
        2: { name: 'Dog' },
      });
    });
  });

  describe('#formatErrorResponse', () => {
    context('when there are no error messages', () => {
      it('returns only the http status', () => {
        const errorResponse = {
          status: 422,
          message: {
            message: 'Validation Failed',
            errors: [],
          },
        };

        expect(formatErrorResponse(errorResponse)).toEqual({ http_status: 422 });
      });
    });

    it('converts the error response to an object for redux state', () => {
      const errors = [
        { name: 'first_name',
          reason: 'is not valid',
        },
        { name: 'first_name',
          reason: 'must be something else',
        },
        { name: 'last_name',
          reason: 'must be changed or something',
        },
      ];
      const errorResponse = {
        status: 422,
        message: {
          message: 'Validation Failed',
          errors,
        },
      };

      expect(formatErrorResponse(errorResponse)).toEqual({
        first_name: 'is not valid, must be something else',
        http_status: 422,
        last_name: 'must be changed or something',
      });
    });
  });
});
