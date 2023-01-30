exports.generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

exports.generateLocationMsg = (username, url) => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};
