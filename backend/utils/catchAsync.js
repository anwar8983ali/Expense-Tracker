// Wraps an async route handler so any rejected promise (thrown error)
// is automatically passed to next(), reaching our central error handler.
// This removes the need to write try/catch in every controller function.
module.exports = function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};
