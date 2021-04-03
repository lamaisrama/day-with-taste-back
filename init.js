import express from "express";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;
const handleListening = () => {
  console.log(`✅ Listening on : https://day-with-taste.herokuapp.com:${PORT}`);
};
app.listen(PORT, handleListening);
