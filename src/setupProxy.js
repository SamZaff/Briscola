const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(proxy({ target: 'http://localhost:4000' }));
    // app.use(proxy('/otherApi/**', { target: 'http://localhost:5000' }));
};