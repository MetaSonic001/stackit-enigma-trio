// setup-database.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Environment variables
const supabaseUrl = 'https://xyuqpskapfenamafimxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dXFwc2thcGZlbmFtYWZpbXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTMzMjUsImV4cCI6MjA2Nzg4OTMyNX0.S_P6R9lLRvRu6vEHUy2LRPypTdcVa0ou-milYeYV580';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dXFwc2thcGZlbmFtYWZpbXh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjMxMzMyNSwiZXhwIjoyMDY3ODg5MzI1fQ.gYsy2tZi9Zfq3wpQ6rZ6XQ2-4RoJUgbQz7o_Iron9OY';

// Create admin client for database operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL Schema for StackIt Q&A Platform
const sqlSchema = `
-- StackIt Q&A Platform Database Schema (Simplified)
-- This version is optimized for programmatic execution

-- Create custom types
CREATE TYPE user_role AS ENUM ('guest', 'user', 'moderator', 'admin');
CREATE TYPE question_status AS ENUM ('active', 'closed', 'flagged', 'deleted');
CREATE TYPE notification_type AS ENUM ('answer', 'vote', 'follow', 'accepted', 'mention', 'system');
CREATE TYPE vote_type AS ENUM ('up', 'down');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  role user_role DEFAULT 'user',
  reputation INTEGER DEFAULT 0,
  questions_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  votes_received INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  usage_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status question_status DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  votes_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  accepted_answer_id UUID,
  is_featured BOOLEAN DEFAULT FALSE,
  bounty_amount INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT FALSE,
  quality_score FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  votes_count INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  ai_generated BOOLEAN DEFAULT FALSE,
  quality_score FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'answer')),
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_id, target_type)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'answer')),
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id),
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  target_id UUID,
  target_type TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'answer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_id, target_type)
);

-- Create following table
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create moderation_logs table
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  moderator_id UUID REFERENCES profiles(id),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  ai_suggested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  interaction_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  quality_rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

// Function to execute SQL commands via Supabase
async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    if (error) {
      throw new Error(`SQL Error: ${error.message}`);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Split SQL into individual commands
function splitSqlCommands(sqlContent) {
  const commands = [];
  const lines = sqlContent.split('\n');
  let currentCommand = '';
  let inDollarQuote = false;
  let dollarTag = '';

  for (let line of lines) {
    line = line.trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('--')) {
      continue;
    }

    // Handle dollar quoting
    if (line.includes('$') && !inDollarQuote) {
      const dollarMatch = line.match(/\$([^$]*)\$/);
      if (dollarMatch) {
        dollarTag = dollarMatch[0];
        inDollarQuote = true;
      }
    } else if (inDollarQuote && line.includes(dollarTag)) {
      inDollarQuote = false;
      dollarTag = '';
    }

    currentCommand += line + '\n';

    // Check for command end
    if (line.endsWith(';') && !inDollarQuote) {
      commands.push(currentCommand.trim());
      currentCommand = '';
    }
  }

  // Add remaining command if any
  if (currentCommand.trim()) {
    commands.push(currentCommand.trim());
  }

  return commands;
}

async function setupDatabase() {
  try {
    console.log('🚀 Setting up StackIt database...');

    // Execute schema setup
    const commands = splitSqlCommands(sqlSchema);
    console.log(`📄 Found ${commands.length} SQL commands to execute`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      try {
        console.log(`⚡ Executing command ${i + 1}/${commands.length}: ${command.substring(0, 60)}...`);
        
        const result = await executeSQL(command);
        
        if (result.success) {
          successCount++;
          console.log(`✅ Command ${i + 1} executed successfully`);
        } else {
          console.warn(`⚠️  Warning on command ${i + 1}:`, result.error);
          errorCount++;
        }
      } catch (err) {
        console.warn(`⚠️  Error on command ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Schema setup completed! Success: ${successCount}, Errors: ${errorCount}`);
    
    // Setup indexes and constraints
    await setupIndexesAndConstraints();
    
    // Setup RLS policies
    await setupRLSPolicies();
    
    // Create sample data
    await createSampleData();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n🔑 Next steps:');
    console.log('1. Users can now sign up through Supabase Auth');
    console.log('2. User profiles will be created automatically');
    console.log('3. Start using your StackIt Q&A platform!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

async function setupIndexesAndConstraints() {
  console.log('\n🔧 Setting up indexes and constraints...');
  
  const indexCommands = [
    'CREATE INDEX IF NOT EXISTS idx_questions_author ON questions(author_id);',
    'CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);',
    'CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);',
    'CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING GIN(tags);',
    'CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);',
    'CREATE INDEX IF NOT EXISTS idx_answers_author ON answers(author_id);',
    'CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(target_id, target_type);',
    'CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);',
    'CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);',
    'CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);',
    'ALTER TABLE questions ADD CONSTRAINT IF NOT EXISTS fk_accepted_answer FOREIGN KEY (accepted_answer_id) REFERENCES answers(id);'
  ];

  for (const command of indexCommands) {
    try {
      await executeSQL(command);
      console.log(`✅ Index/constraint created: ${command.substring(0, 50)}...`);
    } catch (error) {
      console.warn(`⚠️  Warning creating index: ${error.message}`);
    }
  }
}

async function setupRLSPolicies() {
  console.log('\n🛡️  Setting up Row Level Security policies...');
  
  const rlsCommands = [
    'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE questions ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE answers ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE votes ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE comments ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE follows ENABLE ROW LEVEL SECURITY;',
    
    // Policies
    'CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);',
    'CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);',
    'CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);',
    
    'CREATE POLICY IF NOT EXISTS "Questions are viewable by everyone" ON questions FOR SELECT USING (true);',
    'CREATE POLICY IF NOT EXISTS "Authenticated users can create questions" ON questions FOR INSERT WITH CHECK (auth.role() = \'authenticated\');',
    'CREATE POLICY IF NOT EXISTS "Users can update own questions" ON questions FOR UPDATE USING (auth.uid() = author_id);',
    
    'CREATE POLICY IF NOT EXISTS "Answers are viewable by everyone" ON answers FOR SELECT USING (true);',
    'CREATE POLICY IF NOT EXISTS "Authenticated users can create answers" ON answers FOR INSERT WITH CHECK (auth.role() = \'authenticated\');',
    'CREATE POLICY IF NOT EXISTS "Users can update own answers" ON answers FOR UPDATE USING (auth.uid() = author_id);',
    
    'CREATE POLICY IF NOT EXISTS "Users can view all votes" ON votes FOR SELECT USING (true);',
    'CREATE POLICY IF NOT EXISTS "Users can manage own votes" ON votes FOR ALL USING (auth.uid() = user_id);',
    
    'CREATE POLICY IF NOT EXISTS "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);',
    'CREATE POLICY IF NOT EXISTS "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);',
    
    'CREATE POLICY IF NOT EXISTS "Comments are viewable by everyone" ON comments FOR SELECT USING (true);',
    'CREATE POLICY IF NOT EXISTS "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = \'authenticated\');',
    'CREATE POLICY IF NOT EXISTS "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);',
    
    'CREATE POLICY IF NOT EXISTS "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);',
    'CREATE POLICY IF NOT EXISTS "Users can view all follows" ON follows FOR SELECT USING (true);',
    'CREATE POLICY IF NOT EXISTS "Users can manage own follows" ON follows FOR ALL USING (auth.uid() = follower_id);'
  ];

  for (const command of rlsCommands) {
    try {
      await executeSQL(command);
      console.log(`✅ RLS policy created: ${command.substring(0, 50)}...`);
    } catch (error) {
      console.warn(`⚠️  Warning creating RLS policy: ${error.message}`);
    }
  }
}

async function createSampleData() {
  console.log('\n📝 Creating sample data...');
  
  try {
    // Insert sample tags
    const { error: tagsError } = await supabase
      .from('tags')
      .upsert([
        { name: 'JavaScript', description: 'Questions about JavaScript programming language', color: '#F7DF1E' },
        { name: 'React', description: 'React.js library and ecosystem questions', color: '#61DAFB' },
        { name: 'Python', description: 'Python programming language questions', color: '#3776AB' },
        { name: 'Node.js', description: 'Server-side JavaScript with Node.js', color: '#339933' },
        { name: 'TypeScript', description: 'TypeScript language and tooling', color: '#3178C6' },
        { name: 'Database', description: 'Database design and query questions', color: '#336791' },
        { name: 'API', description: 'Application Programming Interface questions', color: '#FF6B35' },
        { name: 'Authentication', description: 'User authentication and authorization', color: '#4CAF50' },
        { name: 'Performance', description: 'Code optimization and performance', color: '#FF9800' },
        { name: 'Testing', description: 'Software testing and quality assurance', color: '#9C27B0' },
        { name: 'CSS', description: 'Cascading Style Sheets and styling', color: '#1572B6' },
        { name: 'HTML', description: 'HyperText Markup Language questions', color: '#E34F26' },
        { name: 'Vue.js', description: 'Vue.js framework questions', color: '#4FC08D' },
        { name: 'Angular', description: 'Angular framework questions', color: '#DD0031' },
        { name: 'DevOps', description: 'Development and Operations questions', color: '#326CE5' }
      ], { 
        onConflict: 'name',
        ignoreDuplicates: true 
      });

    if (tagsError) {
      console.warn('⚠️  Warning creating tags:', tagsError.message);
    } else {
      console.log('✅ Sample tags created successfully');
    }

    // Grant final permissions
    await executeSQL('GRANT USAGE ON SCHEMA public TO anon, authenticated;');
    await executeSQL('GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;');
    await executeSQL('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;');
    await executeSQL('GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;');

    console.log('✅ Sample data and permissions setup completed!');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

// Helper function to create user profile trigger
async function createUserProfileTrigger() {
  const triggerSQL = `
    CREATE OR REPLACE FUNCTION handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, username, display_name, role)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
        'user'
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  `;

  try {
    await executeSQL(triggerSQL);
    console.log('✅ User profile trigger created');
  } catch (error) {
    console.warn('⚠️  Warning creating trigger:', error.message);
  }
}

// Test database connection
async function testConnection() {
  try {
    // Test basic connection with a simple query that should always work
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting StackIt Q&A Platform Database Setup...\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot proceed without database connection');
    process.exit(1);
  }
  
  // Setup database
  await setupDatabase();
  
  // Create user profile trigger
  await createUserProfileTrigger();
  
  console.log('\n🎉 Setup completed successfully!');
  console.log('Your StackIt Q&A platform database is ready to use.');
}

// Run the setup
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupDatabase, testConnection };