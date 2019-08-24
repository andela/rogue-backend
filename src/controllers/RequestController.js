import db from '../models';
import ResponseHandler from '../utils/ResponseHandler';

// eslint-disable-next-line import/prefer-default-export
export const bookTrip = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { body } = req;
    const { dataValues } = await db.Request.create({ ...body, userId });
    ResponseHandler.success(res, dataValues, 201);
  } catch (err) {
    let message;
    if (err instanceof db.Sequelize.ForeignKeyConstraintError) {
      if (err.index.includes('accommodationId')) {
        message = 'Accommodation does not exist.';
      }
    }

    if (!message) {
      message = err.errors ? err.errors[0].message : err.message;
    }

    ResponseHandler.error(res, message);
  }
};
