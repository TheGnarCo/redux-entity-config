import { get, join, pickBy } from 'lodash';
import { schema } from 'normalizr';

export const configSchema = (entityName) => {
  return new schema.Entity(entityName);
};

export const entitiesExceptID = (entities, id) => {
  return pickBy(entities, (entity, key) => {
    return String(key) !== String(id);
  });
};

const formatServerErrors = (errors) => {
  if (!errors || !errors.length) {
    return {};
  }

  const result = {};

  errors.forEach((error) => {
    const { name, reason } = error;

    if (result[name]) {
      result[name] = join([result[name], reason], ', ');
    } else {
      result[name] = reason;
    }
  });

  return result;
};

export const formatErrorResponse = (errorResponse) => {
  const errors = get(errorResponse, 'message.errors') || [];

  return {
    ...formatServerErrors(errors),
    http_status: errorResponse.status,
  };
};

export default { configSchema, entitiesExceptID, formatErrorResponse };
