# URL Shortener
### Made with Node.js, Express.js, Handlebars.js and Mongoose

The project is a simple Node.js Application using the Express Framework and MongoDB to create a URL Shortener Service.

## Modules used
+ **express** : The Express framework for building web applications.
+ **mongoose** : A MongoDB object modeling tool to interact with the database.
+ **rateLimit** : A middleware for rate limiting requests to prevent abuse or DDoS attacks.
+ **ShortUrl** : A custom model/schema for the shortened URLs.
+ **validator** : A library for URL validation.
+ **helmet** : A middleware that sets various HTTP headers for enhanced security.
+ **csurf** : A middleware for providing CSRF protection.
+ **dotenv** : A module to load environment variables from a .env file.

## Configuration and Setup:
+ **dotenv.config()**: Loads environment variables from the .env file.
+ Creating an instance of the Express application and setting the port number.

## Database Connection:
+ **mongoose.connect()**: Connects to the MongoDB database specified in the MONGODB_URI environment variable.

## Rate Limiting:
+ **limiter**: Configures a rate limit of 100 requests per 15 minutes using the express-rate-limit middleware.

## View Engine and Middleware Setup:
+ **app.set('view engine', 'ejs')**: Sets the view engine to EJS (Embedded JavaScript).
+ **app.use(express.urlencoded({ extended: false }))**: Parses incoming request bodies in URL-encoded format.
+ **app.use(limiter)**: Applies the rate limiter to all routes.
+ **app.use(helmet())**: Adds various security headers to the HTTP responses.
  
## Production Environment Setup:
If the application is running in a production environment:
+ **app.set('trust proxy', 1)**: Enables trust for the reverse proxy.
+ **app.use(csurf())**: Adds CSRF protection using the csurf middleware.
  
## Route Definitions:
+ **app.get('/')**: Retrieves all the short URLs from the database and renders them in the 'index' view.
+ **app.post('/shortUrls')**: Accepts a POST request to create a new short URL.
  - Validates the fullUrl provided in the request body.
  - If the URL is invalid, returns a 400 (Bad Request) response.
  - Creates a new document in the ShortUrl collection with the provided fullUrl.
  - Redirects the user back to the homepage ('/') after creating the short URL.
+ **app.get('/:shortUrl')**: Retrieves the original URL corresponding to the provided shortUrl.
  - Finds the document in the ShortUrl collection based on the shortUrl parameter.
  - If the document is not found, returns a 404 (Not Found) response.
  - Increments the clicks counter for the short URL and saves the updated document.
  - Redirects the user to the original URL.

## Start the Server:
+ **app.listen()**: Starts the server and listens for incoming requests on the specified port.
+ The server logs a message to the console indicating that it is running.

## Additional Helper Function:
**isValidUrl(url)**: A helper function that uses the validator.isURL() method to check if a URL is valid.

