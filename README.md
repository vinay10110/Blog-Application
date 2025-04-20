# MyBlog - Full Stack Blog Application

## What is the project about?
MyBlog is a modern, full-stack blogging platform that allows users to create, read, update, and delete blog posts. It provides a clean and intuitive interface for users to share their thoughts and stories with rich text formatting and image support.

## What does it do?
- User Authentication (Register/Login/Logout)
- Create and publish blog posts with rich text editing
- Upload images for blog posts
- Edit and delete your own posts
- View all posts on the homepage
- Responsive design for both desktop and mobile devices
- Real-time content updates
- Secure user sessions with JWT authentication

## How does it help in real-life?
- Enables content creators to share their knowledge and experiences
- Provides a platform for building an online presence
- Helps businesses maintain a blog for marketing and customer engagement
- Facilitates knowledge sharing within communities
- Allows writers to maintain a digital portfolio of their work
- Creates opportunities for networking through content sharing

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- React Quill for rich text editing
- Date-fns for date formatting
- Lottie React for animations
- CSS for styling and responsive design

### Backend
- Node.js
- Express.js for REST API
- MongoDB for database
- Mongoose for data modeling
- JWT for authentication
- bcrypt for password hashing

### DevOps
- Docker for containerization
- Environment variables for configuration
- CORS enabled for secure cross-origin requests

## API Endpoints

### Authentication
- POST `/register` - Register new user
- POST `/login` - User login
- POST `/logout` - User logout
- GET `/profile` - Get user profile

### Blog Posts
- GET `/post` - Get all posts
- GET `/post/:id` - Get single post
- POST `/post` - Create new post
- PUT `/post` - Update existing post
- DELETE `/post` - Delete post

## Libraries and Dependencies

### Frontend Dependencies
- react
- react-dom
- react-router-dom
- react-quill
- react-file-base64
- date-fns
- lottie-react
- axios
- dotenv

### Backend Dependencies
- express
- mongoose
- jsonwebtoken
- bcrypt
- cors
- cookie-parser
- body-parser
- dotenv
- multer

## Getting Started

1. Clone the repository
2. Set up environment variables:
   - Create `.env` in api folder for backend configuration
   - Create `.env` in client folder for frontend configuration

3. Install dependencies:
```bash
# Install backend dependencies
cd api
npm install

# Install frontend dependencies
cd ../client
npm install
```

4. Run the application:
```bash
# Run backend
cd api
npm start

# Run frontend
cd ../client
npm start
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Docker Support
The application includes Dockerfile configurations for both frontend and backend services, allowing for containerized deployment.

- Build frontend: `docker build -t blog-frontend ./client`
- Build backend: `docker build -t blog-backend ./api`