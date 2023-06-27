const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const ShortUrl = require('./models/shortURL');
const validator = require('validator');
const helmet = require('helmet');
const csurf = require('csurf');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(limiter);
app.use(helmet()); // Enable various security headers

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Enable proxy trust when running behind a reverse proxy
  app.use(csurf()); // Enable CSRF protection
}

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  const fullUrl = req.body.fullUrl;
  if (!isValidUrl(fullUrl)) {
    return res.status(400).send('Invalid URL');
  }

  await ShortUrl.create({ full: fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) {
    return res.sendStatus(404);
  }

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

function isValidUrl(url) {
  return validator.isURL(url, { require_protocol: true });
}
