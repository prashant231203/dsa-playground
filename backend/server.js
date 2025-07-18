const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const vm = require('vm');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' }
});
const executeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 code executions per minute
  message: { success: false, error: 'Too many code executions, slow down!' }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./backend/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Questions table
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      category TEXT NOT NULL,
      test_cases TEXT NOT NULL,
      solution_template TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Submissions table
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      status TEXT NOT NULL,
      execution_time INTEGER,
      memory_used INTEGER,
      test_cases_passed INTEGER,
      total_test_cases INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (question_id) REFERENCES questions (id)
    )`);

    // User progress table
    db.run(`CREATE TABLE IF NOT EXISTS user_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      status TEXT NOT NULL,
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (question_id) REFERENCES questions (id)
    )`);

    // Concepts table
    db.run(`CREATE TABLE IF NOT EXISTS concepts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Blogs table
    db.run(`CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert sample questions
    const sampleQuestions = [
      {
        id: uuidv4(),
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        category: 'Array',
        test_cases: JSON.stringify([
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
        ]),
        solution_template: `function twoSum(nums, target) {
  // Your code here
  // Return array of two indices
}`,
      },
      {
        id: uuidv4(),
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
        difficulty: 'Easy',
        category: 'Stack',
        test_cases: JSON.stringify([
          { input: { s: "()" }, output: true },
          { input: { s: "()[]{}" }, output: true },
          { input: { s: "(]" }, output: false },
          { input: { s: "([)]" }, output: false }
        ]),
        solution_template: `function isValid(s) {
  // Your code here
  // Return boolean
}`,
      },
      {
        id: uuidv4(),
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'Easy',
        category: 'Linked List',
        test_cases: JSON.stringify([
          { input: { head: [1, 2, 3, 4, 5] }, output: [5, 4, 3, 2, 1] },
          { input: { head: [1, 2] }, output: [2, 1] },
          { input: { head: [] }, output: [] }
        ]),
        solution_template: `function reverseList(head) {
  // Your code here
  // Return reversed linked list head
}`,
      }
    ];

    const insertQuestion = db.prepare(`INSERT OR IGNORE INTO questions 
      (id, title, description, difficulty, category, test_cases, solution_template) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`);

    sampleQuestions.forEach(q => {
      insertQuestion.run(q.id, q.title, q.description, q.difficulty, q.category, q.test_cases, q.solution_template);
    });
    insertQuestion.finalize();
  });
}

// Zod schemas
const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(6).max(128)
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128)
});
const questionSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().min(2),
  testCases: z.array(z.object({ input: z.any(), output: z.any() })),
  solutionTemplate: z.string().optional()
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes with rate limiting and validation
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: parse.error.errors.map(e => e.message).join(', ') });
    }
    const { username, email, password } = parse.data;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    db.run(
      'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
      [userId, username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        const token = jwt.sign(
          { userId, username, email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { id: userId, username, email }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Questions routes
app.get('/api/questions', (req, res) => {
  const { difficulty, category, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM questions';
  let params = [];

  if (difficulty || category) {
    query += ' WHERE';
    if (difficulty) {
      query += ' difficulty = ?';
      params.push(difficulty);
    }
    if (category) {
      query += difficulty ? ' AND category = ?' : ' category = ?';
      params.push(category);
    }
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, questions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM questions';
    let countParams = [];

    if (difficulty || category) {
      countQuery += ' WHERE';
      if (difficulty) {
        countQuery += ' difficulty = ?';
        countParams.push(difficulty);
      }
      if (category) {
        countQuery += difficulty ? ' AND category = ?' : ' category = ?';
        countParams.push(category);
      }
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        questions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    });
  });
});

app.get('/api/questions/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM questions WHERE id = ?', [id], (err, question) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Parse test cases
    question.test_cases = JSON.parse(question.test_cases);

    res.json(question);
  });
});

// Code execution route with rate limiting
app.post('/api/execute', executeLimiter, authenticateToken, (req, res) => {
  try {
    const { code, language, questionId } = req.body;

    if (!code || !language || !questionId) {
      return res.status(400).json({ error: 'Code, language, and question ID are required' });
    }

    // Get question details
    db.get('SELECT * FROM questions WHERE id = ?', [questionId], (err, question) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const testCases = JSON.parse(question.test_cases);
      const results = [];
      let allPassed = true;
      let totalExecutionTime = 0;

      // --- Refactored code execution for robust function name and argument handling ---
      // Extract function name from solution_template or question title
      let functionName = null;
      // Try to extract from solution_template
      if (question.solution_template) {
        const match = question.solution_template.match(/function\s+([a-zA-Z0-9_]+)/);
        if (match) functionName = match[1];
      }
      // Fallback to sanitized question title
      if (!functionName) {
        functionName = question.title.replace(/\s+/g, '');
      }

      for (let index = 0; index < testCases.length; index++) {
        const testCase = testCases[index];
        try {
          const startTime = Date.now();
          let userResult;
          let error = null;
          // Prepare the context and code
          const context = vm.createContext({
            console: {
              log: (...args) => results.push({ type: 'log', data: args.join(' ') })
            }
          });

          // Prepare argument list for function call
          let argList = [];
          if (Array.isArray(testCase.input)) {
            argList = testCase.input;
          } else if (typeof testCase.input === 'object' && testCase.input !== null) {
            // If input is an object, spread its values (for destructured args)
            argList = Object.values(testCase.input);
          } else {
            argList = [testCase.input];
          }

          // Build the code to execute
          const executionCode = `
            ${code}
            if (typeof ${functionName} !== 'function') throw new Error('Function ${functionName} is not defined.');
            const __result = ${functionName}.apply(null, ${JSON.stringify(argList)});
            __result;
          `;

          const script = new vm.Script(executionCode);
          userResult = script.runInContext(context, { timeout: 5000 });
          const executionTime = Date.now() - startTime;
          totalExecutionTime += executionTime;

          // Compare result
          const passed = JSON.stringify(userResult) === JSON.stringify(testCase.output);
          allPassed = allPassed && passed;

          results.push({
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.output,
            actual: userResult,
            passed,
            executionTime
          });
        } catch (error) {
          allPassed = false;
          results.push({
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.output,
            error: error.message,
            passed: false
          });
        }
      }

      // Save submission
      const submissionId = uuidv4();
      db.run(
        `INSERT INTO submissions 
        (id, user_id, question_id, code, language, status, execution_time, test_cases_passed, total_test_cases) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          submissionId,
          req.user.userId,
          questionId,
          code,
          language,
          allPassed ? 'Accepted' : 'Wrong Answer',
          totalExecutionTime,
          results.filter(r => r.passed).length,
          testCases.length
        ]
      );

      // Update user progress
      if (allPassed) {
        db.run(
          `INSERT OR REPLACE INTO user_progress (id, user_id, question_id, status, completed_at) 
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), req.user.userId, questionId, 'completed', new Date().toISOString()]
        );
      }

      res.json({
        success: allPassed,
        results,
        executionTime: totalExecutionTime,
        testCasesPassed: results.filter(r => r.passed).length,
        totalTestCases: testCases.length,
        submissionId
      });

    });
  } catch (error) {
    res.status(500).json({ error: 'Code execution error', details: error.message });
  }
});

// User progress routes
app.get('/api/user/progress', authenticateToken, (req, res) => {
  db.all(
    `SELECT q.*, up.status, up.completed_at 
     FROM questions q 
     LEFT JOIN user_progress up ON q.id = up.question_id AND up.user_id = ?
     ORDER BY q.difficulty, q.title`,
    [req.user.userId],
    (err, progress) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(progress);
    }
  );
});

app.get('/api/user/submissions', authenticateToken, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(
    `SELECT s.*, q.title as question_title 
     FROM submissions s 
     JOIN questions q ON s.question_id = q.id 
     WHERE s.user_id = ? 
     ORDER BY s.created_at DESC 
     LIMIT ? OFFSET ?`,
    [req.user.userId, parseInt(limit), offset],
    (err, submissions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(submissions);
    }
  );
});

// Admin routes
app.post('/api/admin/questions', authenticateToken, (req, res) => {
  // TODO: Add admin role check
  const { title, description, difficulty, category, testCases, solutionTemplate } = req.body;

  if (!title || !description || !difficulty || !category || !testCases) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const questionId = uuidv4();
  db.run(
    `INSERT INTO questions (id, title, description, difficulty, category, test_cases, solution_template) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [questionId, title, description, difficulty, category, JSON.stringify(testCases), solutionTemplate || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({
        message: 'Question created successfully',
        questionId
      });
    }
  );
});

// --- Concepts Endpoints ---
const conceptSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

// List all concepts
app.get('/api/concepts', (req, res) => {
  db.all('SELECT * FROM concepts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.json({ success: true, concepts: rows });
  });
});

// Get a single concept
app.get('/api/concepts/:id', (req, res) => {
  db.get('SELECT * FROM concepts WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    if (!row) return res.status(404).json({ success: false, error: 'Concept not found' });
    res.json({ success: true, concept: row });
  });
});

// Create a concept (admin only)
app.post('/api/concepts', authenticateToken, (req, res) => {
  // TODO: Replace with real admin check
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  const parse = conceptSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ success: false, error: parse.error.errors.map(e => e.message).join(', ') });
  const { title, description } = parse.data;
  const id = uuidv4();
  db.run('INSERT INTO concepts (id, title, description) VALUES (?, ?, ?)', [id, title, description], function(err) {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.status(201).json({ success: true, id });
  });
});

// Update a concept (admin only)
app.put('/api/concepts/:id', authenticateToken, (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  const parse = conceptSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ success: false, error: parse.error.errors.map(e => e.message).join(', ') });
  const { title, description } = parse.data;
  db.run('UPDATE concepts SET title = ?, description = ? WHERE id = ?', [title, description, req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.json({ success: true });
  });
});

// Delete a concept (admin only)
app.delete('/api/concepts/:id', authenticateToken, (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  db.run('DELETE FROM concepts WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.json({ success: true });
  });
});

// --- Blogs Endpoints ---
const blogSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  author: z.string().min(2),
});

app.get('/api/blogs', (req, res) => {
  db.all('SELECT * FROM blogs ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.json({ success: true, blogs: rows });
  });
});

app.get('/api/blogs/:id', (req, res) => {
  db.get('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    if (!row) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.json({ success: true, blog: row });
  });
});

app.post('/api/blogs', authenticateToken, (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  const parse = blogSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ success: false, error: parse.error.errors.map(e => e.message).join(', ') });
  const { title, content, author } = parse.data;
  const id = uuidv4();
  db.run('INSERT INTO blogs (id, title, content, author) VALUES (?, ?, ?, ?)', [id, title, content, author], function(err) {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.status(201).json({ success: true, id });
  });
});

app.put('/api/blogs/:id', authenticateToken, (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  const parse = blogSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ success: false, error: parse.error.errors.map(e => e.message).join(', ') });
  const { title, content, author } = parse.data;
  db.run('UPDATE blogs SET title = ?, content = ?, author = ? WHERE id = ?', [title, content, author, req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.json({ success: true });
  });
});

app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  db.run('DELETE FROM blogs WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    res.json({ success: true });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}); 