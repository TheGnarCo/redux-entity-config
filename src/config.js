import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import BaseConfig from './base_config';
import helpers from './helpers';

const { entitiesExceptID } = helpers;

export const { configSchema } = helpers;

class ReduxEntityConfig extends BaseConfig {
  get actions () {
    return this.allActions();
  }

  get reducer () {
    const { actionTypes, entityName } = this;

    return (state = BaseConfig.initialState, { type, payload }) => {
      switch (type) {
        case actionTypes.CLEAR_ERRORS:
          return {
            ...state,
            errors: {},
          };
        case actionTypes.CREATE_REQUEST:
        case actionTypes.DESTROY_REQUEST:
        case actionTypes.LOAD_REQUEST:
        case actionTypes.UPDATE_REQUEST:
          return {
            ...state,
            errors: {},
            loading: true,
          };
        case actionTypes.LOAD_ALL_SUCCESS:
          return {
            ...state,
            loading: false,
            errors: {},
            sortedIds: payload.data.sortedIds,
            data: {
              ...payload.data[entityName],
            },
          };
        case actionTypes.CREATE_SUCCESS:
        case actionTypes.UPDATE_SUCCESS:
        case actionTypes.LOAD_SUCCESS:
          return {
            ...state,
            loading: false,
            errors: {},
            sortedIds: _uniq([...state.sortedIds, ...payload.data.sortedIds]),
            data: {
              ...state.data,
              ...payload.data[entityName],
            },
          };
        case actionTypes.DESTROY_SUCCESS: {
          return {
            ...state,
            loading: false,
            errors: {},
            sortedIds: _without(state.sortedIds, payload.data.id),
            data: {
              ...entitiesExceptID(state.data, payload.data.id),
            },
          };
        }
        case actionTypes.CREATE_FAILURE:
        case actionTypes.DESTROY_FAILURE:
        case actionTypes.UPDATE_FAILURE:
        case actionTypes.LOAD_FAILURE:
          return {
            ...state,
            loading: false,
            errors: payload.errors,
          };
        default:
          return state;
      }
    };
  }
}

export default ReduxEntityConfig;
