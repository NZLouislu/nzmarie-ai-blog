require('dotenv').config();
const { Client } = require('pg');

// 从 .env 文件读取数据库连接信息
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function checkActualConstraints() {
  try {
    await client.connect();
    console.log('Connected to database successfully');

    // 查询所有约束信息
    const query = `
      SELECT 
        tc.table_name, 
        tc.constraint_name, 
        tc.constraint_type,
        kcu.column_name
      FROM 
        information_schema.table_constraints AS tc 
      JOIN 
        information_schema.key_column_usage AS kcu 
        ON tc.constraint_name = kcu.constraint_name 
        AND tc.table_schema = kcu.table_schema
      WHERE 
        tc.table_schema = 'public' 
        AND tc.table_name IN ('users', 'posts', 'post_stats', 'daily_stats', 'feature_toggles', 'comments')
      ORDER BY 
        tc.table_name, tc.constraint_name, kcu.ordinal_position;
    `;

    const res = await client.query(query);
    
    console.log('\nDatabase Constraints:');
    console.log('====================');
    
    let currentTable = '';
    let currentConstraint = '';
    
    for (const row of res.rows) {
      if (row.table_name !== currentTable) {
        console.log(`\nTable: ${row.table_name}`);
        currentTable = row.table_name;
        currentConstraint = '';
      }
      
      if (row.constraint_name !== currentConstraint) {
        console.log(`  Constraint: ${row.constraint_name} (${row.constraint_type})`);
        currentConstraint = row.constraint_name;
      }
      
      console.log(`    Column: ${row.column_name}`);
    }
    
    // 检查索引信息
    console.log('\n\nDatabase Indexes:');
    console.log('=================');
    
    const indexQuery = `
      SELECT 
        tablename, 
        indexname, 
        indexdef
      FROM 
        pg_indexes
      WHERE 
        schemaname = 'public' 
        AND tablename IN ('users', 'posts', 'post_stats', 'daily_stats', 'feature_toggles', 'comments')
      ORDER BY 
        tablename, indexname;
    `;
    
    const indexRes = await client.query(indexQuery);
    
    currentTable = '';
    for (const row of indexRes.rows) {
      if (row.tablename !== currentTable) {
        console.log(`\nTable: ${row.tablename}`);
        currentTable = row.tablename;
      }
      
      console.log(`  Index: ${row.indexname}`);
      console.log(`    Definition: ${row.indexdef}`);
    }
    
    await client.end();
  } catch (err) {
    console.error('Error:', err);
    await client.end();
  }
}

checkActualConstraints();