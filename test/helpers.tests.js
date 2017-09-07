import expect from 'expect';
import { schema } from 'normalizr';

import helpers from '../src/helpers';

const { configSchema, entitiesExceptID } = helpers;

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
});
