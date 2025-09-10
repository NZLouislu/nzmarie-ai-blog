const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    return console.error('Database connection error:', err.message);
  }
  console.log('Connected to SQLite database');
  
  // Query post_stats table
  db.all("SELECT * FROM post_stats", (err, rows) => {
    if (err) {
      console.error('Error querying post_stats:', err);
    } else {
      console.log('\npost_stats table:');
      console.log(rows.length > 0 ? rows : 'No records found');
    }
    
    // Query comments table
    db.all("SELECT * FROM comments", (err, rows) => {
      if (err) {
        console.error('Error querying comments:', err);
      } else {
        console.log('\ncomments table:');
        console.log(rows.length > 0 ? rows : 'No records found');
      }
      
      db.close();
    });
  });
});