exports.generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

exports.generateLocationMsg = (url) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};
