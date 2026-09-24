# VincyTravel

VincyTravel is a travel and tourism platform designed to showcase destinations, travel packages, blog content, and user-facing booking workflows. The repository combines a static marketing website with a Node.js + Express backend and a MongoDB data layer, enabling the frontend to fetch and display curated travel content dynamically.

## 1. Project Overview

The project is structured around a three-layer architecture:

- Frontend presentation layer: static HTML, CSS, and JavaScript under `docs/`
- Backend application layer: Express API and business logic under `backend/`
- Data persistence layer: MongoDB via Mongoose schemas and models

This architecture is suitable for a lightweight tourism website that needs dynamic catalog content while keeping the public-facing experience fast and simple to host.

## 2. Technical Stack

### Core Runtime
- Node.js
- Express 4.x
- MongoDB
- Mongoose ODM

### Frontend
- Plain HTML5
- CSS
- Vanilla JavaScript
- Static site architecture for GitHub Pages deployment

### Supporting Libraries
- `cors` for cross-origin request handling
- `dotenv` for environment-driven configuration
- `multer` for image uploads
- `nodemailer` for email-related workflows
- `bcryptjs` and `jsonwebtoken` for authentication support

### Repository Metadata
- Primary language: JavaScript
- Default branch: `main`
- Package manager: npm
- Deployment target: GitHub Pages for static frontend, Node server for API backend

## 3. Repository Structure

```text
vincytravel/
├── README.md
├── backend/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── models/
│   │   ├── Blog.js
│   │   ├── Booking.js
│   │   ├── Comment.js
│   │   ├── Destination.js
│   │   └── Package.js
│   ├── routes/
│   │   ├── Package.js
│   │   ├── admin.js
│   │   ├── blog.js
│   │   ├── bookings.js
│   │   ├── comments.js
│   │   ├── destinations.js
│   │   └── upload.js
│   └── uploads/
│       └── runtime-generated asset directory
├── docs/
│   ├── index.html
│   ├── admin/
│   │   ├── index.html
│   │   └── admin.js
│   ├── css/
│   ├── js/
│   │   ├── admin.js
│   │   └── main.js
│   └── images/
└── .gitignore
```

## 4. Backend Architecture

The backend entry point is `backend/server.js`. It initializes the Express application, configures middleware, and exposes REST API routes under versionless resources such as `/api/destinations`, `/api/packages`, and `/api/blog`.

### Server Responsibilities
- CORS configuration for local development use (`http://127.0.0.1:5500`)
- JSON body parsing via `express.json()`
- URL-encoded request parsing
- Static serving of uploaded files under `/uploads`
- MongoDB connection bootstrap using Mongoose
- Modular route registration

### Example server configuration

```javascript
const app = express();
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve('uploads')));
```

This is a lightweight but serviceable configuration for local development and static-site integration.

## 5. Data Model Design

### Destination Model
The `Destination` model represents travel destinations and includes metadata such as:
- `name`
- `description`
- `location`
- `image`
- `bestTimeToVisit`
- `activities`
- `priceRange`
- `featured`

This supports destination cards and filtering for featured landings.

### Package Model
The `Package` model captures trip bundles and travel offerings. It includes:
- `title`
- `description`
- `destinations` as a reference array to `Destination`
- `duration.days` and `duration.nights`
- `price`
- `inclusions` / `exclusions`
- `itinerary`
- `images`
- `featured` / `available`

This is the central data object for curated travel packages.

### Booking Model
The `Booking` model supports reservation workflows:
- `package` reference
- customer details (`name`, `email`, `phone`, `address`)
- traveler counts (`adults`, `children`)
- `travelDate`
- `totalAmount`
- `status` with enum values: `pending`, `confirmed`, `cancelled`, `completed`

### Blog and Comment Models
The blog functionality stores published content, author metadata, and editorial flags such as `featured` and `published`, while comments are stored with a `page` field and moderation state (`approved`).

## 6. API Surface

The backend exposes a REST API designed for the frontend website and admin interface.

### Public Routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/destinations` | Retrieve all destinations |
| GET | `/api/destinations/featured` | Retrieve highlighted destinations |
| GET | `/api/destinations/:id` | Retrieve a single destination |
| GET | `/api/packages` | Retrieve all travel packages |
| GET | `/api/packages/featured` | Retrieve top featured packages |
| GET | `/api/packages/:id` | Retrieve a single package with populated destinations |
| GET | `/api/blog` | Retrieve all published blog posts |
| GET | `/api/blog/featured` | Retrieve featured blog posts |
| GET | `/api/blog/:id` | Retrieve a single blog entry |
| POST | `/api/comments` | Submit a new comment |
| GET | `/api/comments/:page` | Retrieve approved comments for a page |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/:id` | Retrieve a booking by ID |
| POST | `/api/upload/image` | Upload a single image |

### Administrative Routes

The admin router implements CRUD-style management for destination, package, blog, comment, and booking resources. This is secured by a minimal header-based auth check:

```javascript
const adminAuth = (req, res, next) => {
  if (req.headers.authorization === 'admin-secret-key') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
```

This is a straightforward development control and should be replaced with a more robust authentication model in production.

## 7. Frontend Implementation

The `docs/` directory contains the customer-facing experience and admin dashboard.

### Public Site Features
- Hero section and landing page
- Featured destination cards
- Travel package listing
- Blog tiles and content previews
- Contact form placeholders
- Gallery section

### JavaScript Behavior
The frontend logic in `docs/js/main.js` performs fetch requests against the local backend API at:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

It loads featured destinations, packages, and blog posts on page render and dynamically renders them into the DOM with template strings. This keeps the site lightweight and avoids server-side templating complexity.

## 8. Runtime Configuration

The backend uses environment variables through `dotenv`.

### Expected environment values

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vincyweb-travel
```

The application defaults to a local MongoDB instance if no `MONGODB_URI` is supplied.

## 9. Local Setup

### Prerequisites
- Node.js installed
- MongoDB running locally or accessible remotely
- npm available

### Install and run backend

```bash
cd backend
npm install
npm run dev
```

This starts the Node server using `nodemon` as configured in `package.json`.

### Serve the frontend

The static website is served from the `docs/` directory. A local static server is typically used to access assets, for example:

```bash
cd docs
python -m http.server 8000
```

Then open the browser at the local static server URL while the backend runs on port `5000`.

## 10. Security and Operational Considerations

The current implementation is functional for prototype and learning purposes, but a few areas should be hardened before production deployment:

- Replace the static admin secret with proper JWT or session-based authentication
- Restrict CORS to the actual production origin
- Move all secrets to a secure environment management system
- Validate uploaded files more strictly in production
- Add structured logging and monitoring
- Use MongoDB Atlas or a managed database for production environments
- Add rate limiting and input validation for public API endpoints

## 11. Production Readiness Notes

For a production rollout, the architecture would benefit from the following improvements:

- Separate frontend and backend hosting
- API versioning (`/api/v1/...`)
- Centralized error handling middleware
- Validation framework like `Joi` or `Zod`
- Authentication/authorization with role-based access control
- CI/CD pipeline and automated testing
- Static asset optimization and CDN hosting for media

## 12. Conclusion

VincyTravel is a clean and modular travel platform built around a static frontend and a MongoDB-backed Express API. It demonstrates a practical implementation of content-driven tourism website architecture, including destination listings, package management, blog publishing, comment moderation, and booking workflows.

The repository is especially suitable for:
- prototype travel websites
- portfolio projects
- educational full-stack application development
- small-scale tourism booking platforms

With a few production hardening measures, this project can evolve into a robust real-world travel commerce application.

## 13. Suggested Next Improvements

1. Add authentication for admin and user sessions
2. Implement payment integration for bookings
3. Introduce multi-page blog detail views
4. Standardize API error response schemas
5. Add automated tests for models and routes
6. Introduce environment-based deployment configuration

This project already demonstrates a solid backend/frontend split and a clear domain model, making it a strong base for further product development.
