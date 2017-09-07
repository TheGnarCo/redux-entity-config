import { pickBy } from 'lodash';
import { schema } from 'normalizr';

export const configSchema = (entityName) => {
  return new schema.Entity(entityName);
};

export const entitiesExceptID = (entities, id) => {
  return pickBy(entities, (entity, key) => {
    return String(key) !== String(id);
  });
};

export default { configSchema, entitiesExceptID };
