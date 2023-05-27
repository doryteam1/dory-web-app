const path = require('path');
const express = require('express');
const app = express();

// Middleware para redirigir HTTP a HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect(`https://${req.hostname}${req.originalUrl}`);
  } else {
    next();
  }
});

// Serve static files
app.use(express.static(__dirname + '/dist/web-app-dory'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/web-app-dory/index.html'));
});

// default Heroku port
app.listen(process.env.PORT || 5000);