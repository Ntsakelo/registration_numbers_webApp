import express from "express";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import pgPromise from "pg-promise";
import flash from "express-flash";
import session from "express-session";
import Routes from "./routes/regRoutes.js";
import RegNumbers from "./regNumbers.js";
import RegistrationData from "./database.js";

const pgp = pgPromise();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://coder:pg123@localhost:5432/registration_numbers";

const config = {
  connectionString: DATABASE_URL,
};

if (process.env.NODE_ENV == "production") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const db = pgp(config);

const app = express();

app.use(
  session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));
const regNumbers = RegNumbers();
const registrationData = RegistrationData(db);
const regRoutes = Routes(regNumbers, registrationData);
app.get("/", function (req, res) {
  res.render("index");
});
app.post("/reg_numbers", regRoutes.regNumberRoute);
app.get("/clear", regRoutes.clearRoute);
app.get("/reg_numbers", regRoutes.showReg);
app.get("/reg_numbers/:regNum", regRoutes.currentRegRoute);
app.post("/filter", regRoutes.filterRoute);

var PORT = process.env.PORT || 3020;

app.listen(PORT, function () {
  console.log("app started on port:", PORT);
});
