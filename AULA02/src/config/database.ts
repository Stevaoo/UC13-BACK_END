// src/config/database.ts
import mysql from 'mysql2/promise';

export const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'banco_do_tevinho'
});