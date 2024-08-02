module.exports = {
  bodyParserConfig: {
    extended: false,
  },
  corsConfig: {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    path: '/public',
  },
  dbConfig: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'ecommerce',
  },
};
