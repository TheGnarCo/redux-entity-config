import expect from 'expect';

import BaseConfig from '../src/base_config';

describe('BaseConfig - class', () => {
  describe('.failureActionTypeFor', () => {
    it('throws an error if the type is not recognized', () => {
      const actionTypes = {};

      expect(() => BaseConfig.failureActionTypeFor(actionTypes, 'foobar'))
        .toThrow('Unknown failure type: foobar');
    });
  });
});
