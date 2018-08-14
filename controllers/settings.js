/**
 * GET /
 * Site portal.
 */
exports.index = (req, res) => {
  res.render('settings', {
    title: 'Settings'
  });
};
