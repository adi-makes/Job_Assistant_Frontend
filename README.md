# Job Assistant Frontend

A modern, responsive web application for job seekers to manage their job search process. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and ease of deployment.

## Features

### User Authentication
- User registration with email verification
- Secure login with token-based authentication
- Password management with visibility toggle
- Profile management with editable fields

### Profile Management
- Personal information (first name, last name, username, email)
- Professional bio
- Social links (LinkedIn, GitHub, Portfolio)
- Secure password updates

### Job Search Tools
- Application tracker dashboard
- Resume scoring and feedback
- Interview answer generator
- Multi-step preference setup

### User Preferences
- Role preferences and values
- Location and company size preferences
- Industry and skill selection
- Customizable job search criteria

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite (for development server)
- **Authentication**: Token-based (localStorage)
- **Styling**: Custom CSS with CSS variables
- **Icons**: Inline SVG

## Project Structure

```
Job_Assistant_Frontend/
├── assets/
│   ├── css/           # Stylesheets
│   │   ├── style.css          # Global styles
│   │   ├── auth.css           # Authentication pages
│   │   ├── dashboard.css      # Dashboard styles
│   │   ├── landing.css        # Landing page
│   │   └── preferences.css    # Onboarding flow
│   └── js/            # JavaScript files
│       ├── auth.js            # Authentication module
│       ├── main.js            # Main application logic
│       ├── preferences.js     # Preferences handling
│       └── profile.js         # Profile management
├── icons/             # Icon assets
├── images/            # Image assets
├── index.html         # Landing page
├── login.html         # Login page
├── signup.html        # Registration page
├── dashboard.html     # Main dashboard
├── profile.html       # User profile
├── preferences-step*.html  # Onboarding steps
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A running backend API (see Backend Integration section)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Job_Assistant_Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
   - Open `assets/js/auth.js`
   - Update the `API_BASE_URL` constant with your backend URL
   ```javascript
   const API_BASE_URL = 'http://your-backend-url.com';
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Backend Integration

This frontend application requires a backend API to function. The backend must implement the following endpoints:

### Authentication Endpoints

#### User Registration
- **Endpoint**: `POST /api/users/register/`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "token": "string",
    "user_id": "integer",
    "username": "string"
  }
  ```

#### User Login
- **Endpoint**: `POST /api/users/login/`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "token": "string",
    "user_id": "integer",
    "username": "string"
  }
  ```

### Profile Endpoints

#### Get User Profile
- **Endpoint**: `GET /api/users/profile/`
- **Headers**: `Authorization: Token <token>`
- **Success Response**: `200 OK`
  ```json
  {
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "bio": "string",
    "linkedin_url": "string",
    "github_url": "string",
    "portfolio_url": "string"
  }
  ```

#### Update User Profile
- **Endpoint**: `PUT /api/users/profile/`
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "bio": "string",
    "linkedin_url": "string",
    "github_url": "string",
    "portfolio_url": "string",
    "password": "string (optional)"
  }
  ```
- **Success Response**: `200 OK`

### Authentication Flow

1. **Registration**: User submits registration form → API returns token → Token saved to localStorage → Redirect to preferences
2. **Login**: User submits credentials → API returns token and user data → Data saved to localStorage → Redirect to dashboard
3. **Protected Pages**: Page loads → Check for token in localStorage → If exists, allow access → If not, redirect to login
4. **API Requests**: All authenticated requests include header: `Authorization: Token <token>`
5. **Logout**: Clear localStorage → Redirect to login page

### CORS Configuration

Your backend must allow CORS requests from the frontend domain. Example configuration needed:

- Allow origin: Your frontend domain
- Allow methods: GET, POST, PUT, DELETE, OPTIONS
- Allow headers: Content-Type, Authorization
- Allow credentials: true

### Token Management

- Tokens are stored in browser localStorage
- Token is sent with every API request in the Authorization header
- Expired or invalid tokens trigger automatic logout and redirect to login

## Configuration

### API Base URL

Update the API endpoint in `assets/js/auth.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000'; // Change this
```

### Styling

Global CSS variables are defined in `assets/css/style.css`:

```css
:root {
    --primary-color: #1FB6D6;
    --text-dark: #1F2937;
    /* ... more variables */
}
```

Customize these to match your brand.

## Development

### Development Server

```bash
npm run dev
```

Runs on `http://localhost:3000` with hot reload.

### Code Organization

- **HTML Files**: Each page is a separate HTML file with semantic structure
- **CSS Files**: Modular stylesheets for different sections
- **JavaScript Modules**: Separated by functionality (auth, profile, preferences)

### Authentication Testing

For development without a backend, you can temporarily disable authentication:

1. Comment out `Auth.requireAuth()` in protected page scripts
2. Test UI and functionality
3. Re-enable before deployment

## Deployment

### Static Hosting

This app can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting provider
3. Ensure your backend API is accessible
4. Update `API_BASE_URL` to production URL

### Recommended Hosting Platforms

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

### Environment Variables

For production, consider using environment variables for the API URL. Update `vite.config.js`:

```javascript
export default defineConfig({
    define: {
        'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
    }
});
```

Then use in code:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Considerations

- All passwords are transmitted over HTTPS (ensure backend uses HTTPS)
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Input validation on all forms
- XSS protection through proper escaping
- CSRF protection recommended on backend

## Troubleshooting

### Common Issues

**Issue**: "Network error" on login/signup
- **Solution**: Check if backend API is running and CORS is configured

**Issue**: Redirected to login on protected pages
- **Solution**: Verify token is stored in localStorage and is valid

**Issue**: Profile data not loading
- **Solution**: Check Authorization header is being sent with requests

**Issue**: Vite server not starting
- **Solution**: Delete `node_modules` and `package-lock.json`, run `npm install` again

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

See LICENSE file for details.

## Support

For issues and questions, please open an issue in the repository.

## Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Designed with modern UI/UX principles
- Optimized for performance and accessibility
