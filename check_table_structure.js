const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
  try {
    // Check daily_stats table structure
    console.log('Checking daily_stats table structure...');
    
    // Try to get table info
    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Error querying daily_stats:', error);
    } else {
      console.log('Sample daily_stats record:', data[0]);
      console.log('Fields in daily_stats:', Object.keys(data[0] || {}));
    }

    // Check if post_id column exists
    const { data: postData, error: postError } = await supabase
      .from('daily_stats')
      .select('post_id')
      .limit(1);

    if (postError) {
      console.log('post_id column does not exist or is not accessible');
    } else {
      console.log('post_id column exists');
    }

    // Check if userId column exists
    const { data: userData, error: userError } = await supabase
      .from('daily_stats')
      .select('userId')
      .limit(1);

    if (userError) {
      console.log('userId column does not exist or is not accessible');
    } else {
      console.log('userId column exists');
    }

  } catch (error) {
    console.error('Error checking table structure:', error);
  }
}

checkTableStructure();