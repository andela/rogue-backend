/* eslint-disable no-underscore-dangle */
import passport from 'passport';

/**
 * MockStrategy Class
 */
class MockStrategy extends passport.Strategy {
  /**
   * @param {*} name
   * @param {*} callback
   * @param {*} user
   */
  constructor(name, callback, user) {
    super(name, callback);
    this.name = name;
    this._cb = callback;
    this._user = {
      ...user,
      provider: name
    };
  }

  /**
   * @memberof MockStrategy
   * @returns {undefined}
   */
  authenticate() {
    this._cb(null, null, this._user, (error, user) => {
      this.success(user);
    });
  }
}

export default MockStrategy;
