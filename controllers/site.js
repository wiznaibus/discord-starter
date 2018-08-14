/**
 * GET /
 * Site portal.
 */
exports.index = (req, res) => {
  res.render('index', {
    title: 'Portal'
  });
};
