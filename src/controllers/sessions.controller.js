const deleteSession = (req, res) => {
  req.session.destroy();
  res.send({
    message: `Ok !`,
  });
};

export default {
  delete: deleteSession,
};
