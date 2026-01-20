# Nova Work API Documentation

## Base URL
\`\`\`
https://api.novawork.com/v1
\`\`\`

## Authentication
All API requests require authentication using Bearer tokens obtained from Supabase Auth.

\`\`\`bash
Authorization: Bearer YOUR_ACCESS_TOKEN
\`\`\`

---

## Endpoints

### Authentication

#### POST `/auth/signup`
Create a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "Juan Pérez",
  "profession": "Desarrollador"
}
\`\`\`

**Response:**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Juan Pérez"
  },
  "session": {
    "access_token": "token",
    "refresh_token": "token"
  }
}
\`\`\`

---

### Profiles

#### GET `/profiles/:id`
Get user profile by ID.

**Response:**
\`\`\`json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Juan Pérez",
  "username": "juanperez",
  "profession": "Desarrollador",
  "location_text": "Buenos Aires, Argentina",
  "is_verified": true,
  "average_rating": 4.8,
  "total_reviews": 12
}
\`\`\`

#### PATCH `/profiles/:id`
Update user profile.

**Request Body:**
\`\`\`json
{
  "full_name": "Juan Pérez Updated",
  "bio": "Desarrollador Full Stack con 5 años de experiencia",
  "profession": "Desarrollador Senior"
}
\`\`\`

---

### Jobs

#### GET `/jobs`
Get all active jobs with filters.

**Query Parameters:**
- `category` - Filter by category
- `modality` - presencial, remoto, híbrido
- `job_type` - tiempo_completo, medio_tiempo, por_proyecto, freelance
- `lat` - Latitude for location search
- `lng` - Longitude for location search
- `radius` - Search radius in km (default: 50)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "uuid",
      "title": "Desarrollador React",
      "company": {
        "name": "Tech Company",
        "logo_url": "https://...",
        "is_verified": true
      },
      "location_text": "Buenos Aires",
      "modality": "híbrido",
      "salary_min": 2000,
      "salary_max": 3500,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
\`\`\`

#### POST `/jobs`
Create a new job posting.

**Request Body:**
\`\`\`json
{
  "company_id": "uuid",
  "title": "Desarrollador React",
  "description": "Buscamos desarrollador...",
  "category": "Tecnología",
  "modality": "híbrido",
  "job_type": "tiempo_completo",
  "location_text": "Buenos Aires, Argentina",
  "salary_min": 2000,
  "salary_max": 3500,
  "requirements": ["React", "TypeScript", "3+ años experiencia"]
}
\`\`\`

---

### Applications

#### POST `/applications`
Apply to a job.

**Request Body:**
\`\`\`json
{
  "job_id": "uuid",
  "cover_letter": "Me interesa mucho esta posición...",
  "resume_url": "https://..."
}
\`\`\`

#### GET `/applications`
Get user's job applications.

**Query Parameters:**
- `status` - pending, reviewed, shortlisted, rejected, accepted

---

### Messages

#### GET `/conversations`
Get user's conversations.

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "uuid",
      "participant": {
        "id": "uuid",
        "full_name": "María González",
        "avatar_url": "https://..."
      },
      "last_message": {
        "content": "Hola, vi tu perfil...",
        "created_at": "2024-01-15T10:00:00Z",
        "is_read": false
      }
    }
  ]
}
\`\`\`

#### POST `/conversations`
Start a new conversation.

**Request Body:**
\`\`\`json
{
  "participant_id": "uuid",
  "initial_message": "Hola, me interesa tu perfil..."
}
\`\`\`

#### POST `/messages`
Send a message.

**Request Body:**
\`\`\`json
{
  "conversation_id": "uuid",
  "content": "Mensaje de texto",
  "message_type": "text"
}
\`\`\`

---

### Reviews

#### POST `/reviews`
Create a review for a user.

**Request Body:**
\`\`\`json
{
  "reviewee_id": "uuid",
  "rating": 5,
  "title": "Excelente profesional",
  "comment": "Muy profesional y puntual...",
  "category": "profesionalismo"
}
\`\`\`

#### GET `/reviews/:user_id`
Get reviews for a user.

---

### Services (Marketplace)

#### GET `/services`
Get marketplace services.

**Query Parameters:**
- `category` - Filter by category
- `pricing_type` - fixed, hourly, project
- `min_price` - Minimum price
- `max_price` - Maximum price

#### POST `/services`
Create a new service.

**Request Body:**
\`\`\`json
{
  "title": "Desarrollo de Landing Page",
  "description": "Creo landing pages responsive...",
  "category": "Desarrollo Web",
  "pricing_type": "fixed",
  "price": 500,
  "delivery_time": 7,
  "images": ["url1", "url2"]
}
\`\`\`

---

### Events

#### GET `/events`
Get upcoming events.

**Query Parameters:**
- `event_type` - presencial, virtual, híbrido
- `category` - networking, taller, conferencia, etc
- `start_date` - Filter events after this date

#### POST `/events`
Create a new event.

---

### Groups

#### GET `/groups`
Get all groups.

**Query Parameters:**
- `category` - Filter by category

#### POST `/groups/:id/join`
Join a group.

#### POST `/groups/:id/posts`
Create a post in a group.

---

## Error Responses

All errors follow this format:

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
\`\`\`

**Common Error Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

---

## Webhooks

Nova Work supports webhooks for real-time notifications.

**Supported Events:**
- `job.created`
- `application.received`
- `message.received`
- `review.received`
- `payment.completed`

---

## SDK Examples

### JavaScript/TypeScript
\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Get jobs
const { data: jobs } = await supabase
  .from('jobs')
  .select('*')
  .eq('status', 'active')
  .limit(20)
\`\`\`

### Python
\`\`\`python
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get jobs
jobs = supabase.table('jobs').select('*').eq('status', 'active').limit(20).execute()
\`\`\`

---

For more information, contact: dev@novawork.com
