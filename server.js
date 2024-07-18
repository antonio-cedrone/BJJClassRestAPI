const express = require('express');
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions.js")
const swaggerUi = require('swagger-ui-express');
const connect = require('./mongodb/dbConnection.js');
const mongoose = require('mongoose');
require('dotenv').config();
require("./mongodb/dbEventListeners.js");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;

/* 
    Currently etags are turned off as they are not yet implemented.  But as there can technically be more than 1 editor
    this is necessary to avoid lost updates.
*/
app.set("etag", false);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require("./config/swaggerJsdocOptions")));

connect();

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use(require("./middleware/validationHandlers/allRequestHeaderValidator.js"));

app.use("/register", require("./routes/register.js"));
app.use("/login", require("./routes/login.js"));
app.use('/refresh', require('./routes/refresh.js'));
app.use('/logout', require('./routes/logout.js'));

app.use(require("./middleware/validationHandlers/JWTValidator.js"));

app.use("/admin", require("./routes/admin.js"));

app.use("/position", require("./routes/api/positions.js"));
app.use("/technique", require("./routes/api/techniques.js"));
app.use("/class", require("./routes/api/classes.js"));

app.use(require("./middleware/finalizeResponse.js"));

app.use(require("./middleware/ErrorHandlers/undefinedRouteHandler.js"));
app.use(require("./middleware/ErrorHandlers/jsonErrorHandler.js"));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

const exit = () => {
    mongoose.connection.close();
    console.log("connection closed at app termination");
}

process
    .on('SIGINT', exit)
    .on('SIGTERM', exit);