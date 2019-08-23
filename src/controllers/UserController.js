import db from '../models';

// eslint-disable-next-line import/prefer-default-export
export const signUp = async (req, res) => {
  try {
    const user = await db.User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    const status = 400;
    const error = err.errors[0].message;
    res.status(status).json({ status, error });
  }
};
