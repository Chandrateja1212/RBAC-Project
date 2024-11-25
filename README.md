# Role-Based Access Control (RBAC) System

A secure authentication and authorization system built with Node.js, Express, and MongoDB that implements Role-Based Access Control (RBAC) for managing user access to protected resources.

## Features

- User authentication (register, login, logout)
- JWT-based session management
- Role-based authorization (Admin, Manager, User)
- MongoDB integration for data persistence
- Secure password hashing
- Protected API endpoints based on user roles

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Testing**: Thunder Client

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Protected Resource Endpoints

- `GET /api/users/manager` - Access manager dashboard (requires manager role)

## Authentication Flow

### 1. Login
![Login API Response](https://github.com/Chandrateja1212/RBAC-Project/raw/main/src/img/register.png)

- Send POST request to `/api/auth/login` with username and password
- Receive JWT token upon successful authentication
- Token includes user role and permissions

### 2. Access Protected Resources
![Manager Access](https://github.com/Chandrateja1212/RBAC-Project/raw/main/src/img/login.png)

- Include JWT token in Authorization header
- Server validates token and role
- Access granted based on user's role

### 3. Logout
![Logout Response](https://github.com/Chandrateja1212/RBAC-Project/raw/main/src/img/logout.png)

- Send POST request to `/api/auth/logout`
- Server invalidates the session
- User is successfully logged out


## Security Features

- Password hashing for secure storage
- JWT-based authentication
- Role-based access control
- Secure session management
- Protected API endpoints

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Chandrateja1212/RBAC-Project.git
```

2. Install dependencies:
```bash
cd nodejs-rbac-project
npm install express dotenv mongoose cookie-parser jsonwebtoken bcryptjs && npm install --save-dev nodemon

```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm run dev
```

## Usage

1. Register a new user (if registration endpoint is available)

2. Login with credentials:
```json
{
  "username": "username",
  "password": "password"
}
```

3. Use the received token in the Authorization header for subsequent requests:
```
Authorization: Bearer <your-jwt-token>
```

## Role Hierarchy

- **Admin**: Full system access
- **Manager**: Access to management features
- **User**: Basic access to protected resources

## Development

### Prerequisites

- Node.js v14 or higher
- MongoDB
- npm or yarn

### Setting Up Development Environment

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB server

3. Run in development mode:
```bash
npm run dev
```

## Testing

Use Thunder Client or Postman to test the API endpoints:

1. Login endpoint:
```
POST http://localhost:7001/api/auth/login
Content-Type: application/json

{
  "username": "username",
  "password": "password"
}
```

2. Protected endpoint example:
```
GET http://localhost:7001/api/users/manager
Authorization: Bearer <your-jwt-token>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Node.js and Express.js communities
- MongoDB team for excellent documentation
- JWT implementation based on best practices
