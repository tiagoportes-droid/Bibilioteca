import express from "express";
import cors from "cors";
import mysql from "mysql";
import "dotenv/config";// pegando as informações do arquivo .env

const app = express();

app.use(express.json());
app.use(express.static('./'))
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const PORT = 3000;
