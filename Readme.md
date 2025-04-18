# Express Backend

A simple and robust Express.js backend server.

## Features

- RESTful API endpoints
- MongoDB database integration
- JWT authentication
- Error handling middleware
- Environment configuration
- Logging

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/express-backend.git

# Navigate to the project directory
cd express-backend

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Usage

```bash
# Start development server
npm run dev

# Start production server
npm start
```

The server will be running at `http://localhost:3000`.

## API Endpoints

- **GET** `/api/v1/users` - Get all users
- **GET** `/api/v1/users/:id` - Get user by ID
- **POST** `/api/v1/users` - Create a new user
- **PUT** `/api/v1/users/:id` - Update user by ID
- **DELETE** `/api/v1/users/:id` - Delete user by ID

- **POST** `/api/v1/auth/login` - User login
- **POST** `/api/v1/auth/register` - User registration

## Project Structure

```
express-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.