# DSA Playground 🚀

An interactive platform for learning and practicing Data Structures and Algorithms with real-time code execution, built with Next.js, Express.js, and Monaco Editor.

## ✨ Features

### 🎯 Core Features
- **Interactive Code Editor** - Monaco Editor with syntax highlighting and autocomplete
- **Real-time Code Execution** - Safe JavaScript code execution with sandboxing
- **Question Management** - Dynamic question creation and management
- **User Authentication** - Secure login/register system with JWT
- **Progress Tracking** - Track your progress across different questions
- **Test Case Validation** - Automatic test case execution and validation
- **Responsive Design** - Modern UI that works on all devices

### 🛠 Technical Features
- **Backend API** - Express.js server with SQLite database
- **Code Sandboxing** - VM2 for safe code execution
- **Authentication** - JWT-based authentication system
- **Database** - SQLite with automatic schema initialization
- **Real-time Feedback** - Instant execution results and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsa-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:3001
   DATABASE_URL=./backend/database.sqlite
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000

### Alternative: Run Frontend and Backend Separately

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

## 📁 Project Structure

```
dsa-playground/
├── app/                    # Next.js app directory
│   ├── api/               # Next.js API routes (legacy)
│   ├── questions/         # Question pages
│   ├── admin/            # Admin interface
│   └── layout.tsx        # Root layout
├── backend/              # Express.js backend
│   └── server.js         # Main server file
├── components/           # React components
│   ├── ui/              # UI components
│   ├── code-editor.tsx  # Monaco Editor component
│   └── auth/            # Authentication components
├── lib/                 # Utilities and contexts
│   └── auth-context.tsx # Authentication context
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🎮 Usage

### For Students/Learners

1. **Register/Login** - Create an account to track your progress
2. **Browse Questions** - View available DSA questions by difficulty and category
3. **Solve Questions** - Use the integrated code editor to write solutions
4. **Run Code** - Execute your code against test cases in real-time
5. **Track Progress** - Monitor your completion status and performance

### For Administrators

1. **Add Questions** - Create new DSA questions with test cases
2. **Manage Content** - Edit existing questions and test cases
3. **Monitor Usage** - View user submissions and progress

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Questions
- `GET /api/questions` - List all questions
- `GET /api/questions/:id` - Get specific question
- `POST /api/admin/questions` - Create new question (admin)

### Code Execution
- `POST /api/execute` - Execute code against test cases

### User Progress
- `GET /api/user/progress` - Get user's question progress
- `GET /api/user/submissions` - Get user's submission history

## 🛡 Security Features

- **Code Sandboxing** - VM2 for safe JavaScript execution
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive input sanitization
- **Rate Limiting** - Protection against abuse
- **CORS Configuration** - Proper cross-origin resource sharing

## 🎨 Customization

### Adding New Programming Languages

1. Update the `getLanguageConfig` function in `components/code-editor.tsx`
2. Add language-specific syntax highlighting
3. Update the backend execution logic if needed

### Adding New Question Types

1. Extend the database schema in `backend/server.js`
2. Update the frontend question components
3. Modify the execution logic for new question formats

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing Node processes
   taskkill /f /im node.exe  # Windows
   pkill node                # Mac/Linux
   ```

2. **Database Errors**
   ```bash
   # Delete and recreate database
   rm backend/database.sqlite
   npm run dev
   ```

3. **Monaco Editor Not Loading**
   - Check if `@monaco-editor/react` is installed
   - Clear browser cache
   - Check console for errors

### Development Tips

- Use browser dev tools to debug frontend issues
- Check backend logs in the terminal for API errors
- Use the health check endpoint: `GET http://localhost:3000/api/health`

## 📈 Performance

- **Code Execution**: Limited to 5 seconds per execution
- **Database**: SQLite for simplicity, can be upgraded to PostgreSQL
- **Frontend**: Optimized with Next.js 14 features
- **Caching**: Implemented for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Backend framework
- [VM2](https://github.com/patriksimek/vm2) - Code sandboxing
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🎉** 