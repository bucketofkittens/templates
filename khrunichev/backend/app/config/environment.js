var config = {
  /*
  metrics: {
    port: 4001
  }
  */

  realtime: true,
  passport: {
	  successRedirect: '/'
	, failureRedirect: '/login'
	}
};

module.exports = config;
