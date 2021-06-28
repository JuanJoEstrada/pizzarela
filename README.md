# PizzarelaArtesanal-pern-app
PERN app to provide typical functionality found in an ecommerce website.  Users can select pizzas and add it to the CART (MAX: 20 units per PIZZAS), add their information to order a pizza.

# Running the app locally
To run locally after `npm install`, write in the bash `yarn start` or `npm run start`.

In pizzarela-client, go to "PizzarelaArtesanal\pizzarela-client JS\src\apis\client.j"s and set baseURL to `http://localhost:3005`, 3005 is the port which the server will be listening. The cliant was built with create react app, thus client will be listening on port 3000.

Then, you need to populate the DB with the command `yarn create-db`. Of course, you need to establish the connection to de DB in "PizzarelaArtesanal\pizzarela-server\config\setupDatabase.js" to populate the DB and in "PizzarelaArtesanal\pizzarela-server\config\db.js" for each request from the client.

# Running the app on Heroku
Before deploying the app to Heroku. You must configure the app locally.

In pizzarela-client, go to "PizzarelaArtesanal\pizzarela-client JS\src\apis\client.js" and set baseURL to `https://pizzarelaartesanal.herokuapp.com` or whatever name you'll choose on Heroku (`https://HERE_NAME_CHOOSED.herokuapp.com`). Do not forget do the same for /pizzarela-admin inside client.js and in OnlineOrders.jsx (`const sse = new EventSource("https://HERE_NAME_CHOOSED.herokuapp.com")`)
Run the command `yarn build` inside the directory "PizzarelaArtesanal\pizzarela-client JS" and copy what is INSIDE of fild "build" into "PizzarelaArtesanal\pizzarela-server\public" (need to create "public" file).

Now, write this code `app.use(express.static('public')` in "PizzarelaArtesanal\pizzarela-server\loaders\express.js", at the top inside of moduel.exports = app => {...} Then uncomment `app.set('trust proxy', 1);`. Then make const whitelist = ['https://pizzarelaartesanal.herokuapp.com', 'https://static.micuentaweb.pe'].

To configure DB, copy this code `const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});` in "PizzarelaArtesanal\pizzarela-server\config\db.js" and remove const pool = new Pool(config);
And this other code `const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});` in "PizzarelaArtesanal\pizzarela-server\config\setupDatabase.js" and remove const client = new Client(config);

Finally, in "PizzarelaArtesanal\pizzarela-server\package.json", replace "nodemon" for "node" in scripts.start

Set up Heroku [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)

