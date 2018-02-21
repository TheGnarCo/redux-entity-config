# Redux Entity Config

[![CircleCI](https://circleci.com/gh/TheGnarCo/redux-entity-config.svg?style=svg)](https://circleci.com/gh/TheGnarCo/redux-entity-config)
[![Coverage Status](https://coveralls.io/repos/github/TheGnarCo/redux-entity-config/badge.svg?branch=master)](https://coveralls.io/github/TheGnarCo/redux-entity-config?branch=master)

The Redux Entity Config provides actions and reducers to help manage entities in
state (ie posts, users, etc.). Most entities require the same crud methods and
are stored in a similar manner in state allowing this behavior to be extracted
to a common configuration class.

## Getting Started

```bash
yarn add redux-entity-config
```

## Usage

### 1) Create an instance of the ReduxEntityConfig class

The first step to configuring an entity is to create an instance of the
`ReduxEntityConfig` class, passing it the following options:

| Option                 | Type         | Required?   | Description                                                                   |
| ---------------------- | ------------ | ----------- | ----------------------------------------------------------------------------- |
| entityName             | `String`     | true        | The name of the entity (ie users)                                             |
| createFunc             | `Function`   | false       | The function (API call) used to create an entity                              |
| destroyFunc            | `Function`   | false       | The function (API call) used to destroy an entity                             |
| loadFunc               | `Function`   | false       | The function (API call) used to load a single entity                          |
| loadAllFunc            | `Function`   | false       | The function (API call) used to load all of the entities                      |
| updateFunc             | `Function`   | false       | The function (API call) used to update an entity                              |
| parseApiResponseFunc   | `Function`   | false       | If present, it is called with the API response. More below.                   |
| parseEntityFunc        | `Function`   | false       | If present, it is called with each entity in the API response. More below.    |
| parseServerErrorsFunc  | `Function`   | false       | If present, it is called with the API error object. More below.               |
| schema                 | `Schema`     | false       | The schema, from Normalizr, for the entity.                                   |

#### parseApiResponseFunc

The actions handling successful API calls need to parse the entities in the API
response. If the API response has more data than an entity or array of entities,
this function is used to select the entity/entities from the API response.

Example:

Given the API response:

```js
{
  bearer_token: 'abc123',
  user: {
    first_name: 'Mike',
    last_name: 'Stone'
  }
}
```

The `parseApiResponseFunc` would select the user from the response:

```js
const parseApiResponseFunc = apiResponse => apiResponse.user;
```


#### parseEntityFunc

This optional function is passed each entity in the API response and can
manipulate data in the entity. For example, if the API returns user entities
with first and last names but you want to add an `initials` attribute to the
entity this function can be used as follows:


```js
const parseEntityFunc = (userEntity) => {
  return {
    ...userEntity,
    initials: `${userEntity.first_name[0]}. ${userEntity.last_name[0]}.`,
  };
};
```


### parseServerErrorsFunc

This optional function is used to parse the error object returned from an unsuccessful API request.
This allows the client to standardize how it administers error data from various API endpoints to
the rest of the system.

Example:

Given this API error response:

```js
{
  status: 422,
  message: 'Unauthenticated',
  errors: [
    {
      name: 'base',
      reason: 'User is not authenticated',
    },
  ],
}
```

`parseServerErrorsFunc` can be used to return a modified error object:

```js
const parseServerErrorsFunc = (apiError) => {
  return {
    http_status: apiError.status,
    errors: apiError.errors,
  };
};
```


### 2) Extract the actions and reducers from the ReduxEntityConfigInstance

Given the following configuration:

```js
import ReduxEntityConfig, { ConfigSchema } from 'redux-entity-config';

import usersApi from 'path-to-my-api-client';

const config = new ReduxEntityConfig({
  entityName: 'users',
  createFunc: usersApi.create,
  destroyFunc: usersApi.destroy,
  loadFunc: usersApi.load,
  loadAllFunc: usersApi.loadAll,
  updateFunc: usersApi.update,
  schema: ConfigSchema('users'),
});
```

The actions and reducer for manipulating state can be extracted from the
`config` constant:


```js
const { actions, reducer } = config;
```

The `reducer` should be combined with your other reducers. It sets the initial
state for entities to:

```js
{
  loading: false,
  errors: {},
  data: {}
}
```

The `actions` attribute is an object containing the following actions:

`clearErrors`:

This action is used to clear the errors object

`create`:

This thunk calls the `createRequest` action, makes an API call using the
`createFunc`, and then either calls the `createSuccess` or `createFailure`
actions.

`silentCreate`:

This thunk is the same as the `create` thunk but it does not call the
`createRequest` action.

`createRequest`:

This action sets the `loading` attribute to true.

`createSuccess`:

This action sets the `loading` attribute to false and adds the entity in the
payload to the `data` attribute in state.

`createFailure`:

This action sets the `loading` attribute to false.

`destroy`:

This thunk calls the `destroyRequest` action, makes an API call using the
`destroyFunc`, and then either calls the `destroySuccess` or `destroyFailure`
actions.

`silentDestroy`:

This thunk is the same as the `destroy` thunk but it does not call the
`destroyRequest` action.

`destroyRequest`:

This action sets the `loading` attribute to true.

`destroySuccess`:

This action sets the `loading` attribute to false and removes the entity in the
payload from the `data` attribute in state.

`destroyFailure`:

This action sets the `loading` attribute to false.

`load`:

This thunk calls the `loadRequest` action, makes an API call using the
`loadFunc`, and then either calls the `loadSuccess` or `loadFailure`
actions.

`silentLoad`:

This thunk is the same as the `load` thunk but it does not call the
`loadRequest` action.

`loadRequest`:

This action sets the `loading` attribute to true.

`loadSuccess`:

This action sets the `loading` attribute to false and adds the entity in the
payload to the `data` attribute in state.

`loadFailure`:

This action sets the `loading` attribute to false.

`update`:

This thunk calls the `updateRequest` action, makes an API call using the
`updateFunc`, and then either calls the `updateSuccess` or `updateFailure`
actions.

`silentUpdate`:

This thunk is the same as the `update` thunk but it does not call the
`updateRequest` action.

`updateRequest`:

This action sets the `loading` attribute to true.

`updateSuccess`:

This action sets the `loading` attribute to false and adds the entity in the
payload to the `data` attribute in state.

`updateFailure`:

This action sets the `loading` attribute to false.

`loadAll`:

This thunk calls the `loadRequest` action, makes an API call using the
`loadAllFunc`, and then either calls the `loadAllSuccess` action or the
`loadFailure` action.

`loadAllSuccess`:

This action sets the `loading` attribute to false and replaces the `data` attribute
with the entities in the payload.

`silentLoadAll`:

This thunk is the same as the `loadAll` thunk but it does not call the
`loadRequest` action.

## About The Gnar Company

![The Gnar Company](https://avatars0.githubusercontent.com/u/17011419?s=100&v=4)

The Gnar Company is a Boston-based development company that builds robust
web and mobile apps designed for the long haul.

For more information see [our website](https://www.thegnar.co/).
