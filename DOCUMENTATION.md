# Adviserve Website CMS - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [Features & Modules](#features--modules)
5. [Admin Panel Guide](#admin-panel-guide)
6. [Implementation Guide](#implementation-guide)
7. [Security & Best Practices](#security--best-practices)

---

## Overview

The Adviserve Website CMS is a comprehensive content management system built for consulting and service-based businesses. It provides a complete admin panel for managing all aspects of a professional website including content, services, blog, email marketing, and legal documents.

### Key Highlights
- Full-featured admin panel
- Dynamic content management
- Email marketing system
- Legal document management
- SEO optimization tools
- Menu and navigation management
- Real-time content updates

---

## Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router DOM 6.22.0** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React** - Icon library
- **TipTap** - Rich text editor
- **Recharts** - Data visualization

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication system

### Deployment
- Static site deployment compatible
- Environment variables for configuration
- Built-in redirects for SPA routing

---

## Database Schema

### Core Tables

#### 1. `admin_users`
Stores admin user accounts.

```sql
- id (uuid, primary key)
- email (text, unique)
- password_hash (text)
- full_name (text)
- role (text) - admin, editor, viewer
- is_active (boolean)
- last_login (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 2. `website_settings`
Global website configuration.

```sql
- id (uuid, primary key)
- site_name (text)
- site_tagline (text)
- logo_url (text)
- favicon_url (text)
- primary_color (text)
- secondary_color (text)
- contact_email (text)
- contact_phone (text)
- social_media (jsonb)
- footer_text (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 3. `pages`
Dynamic page content.

```sql
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- content (text)
- meta_title (text)
- meta_description (text)
- is_published (boolean)
- template (text)
- created_by (uuid)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 4. `services`
Service offerings.

```sql
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- description (text)
- content (text)
- icon (text)
- image_url (text)
- is_featured (boolean)
- sort_order (integer)
- meta_description (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 5. `blog_posts`
Blog articles.

```sql
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- excerpt (text)
- content (text)
- author (text)
- image_url (text)
- category (text)
- tags (text[])
- status (text) - draft, published, archived
- published_at (timestamptz)
- meta_description (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 6. `contact_inquiries`
Contact form submissions.

```sql
- id (uuid, primary key)
- name (text)
- email (text)
- phone (text)
- company (text)
- message (text)
- status (text) - new, in_progress, resolved
- notes (text)
- created_at (timestamptz)
```

### Navigation Tables

#### 7. `navigation_menus`
Menu containers.

```sql
- id (uuid, primary key)
- name (text)
- location (text) - header, footer, sidebar
- is_active (boolean)
- created_at (timestamptz)
```

#### 8. `menu_items`
Individual menu entries.

```sql
- id (uuid, primary key)
- menu_id (uuid)
- parent_id (uuid, nullable)
- label (text)
- url (text)
- icon (text)
- target (text) - _self, _blank
- sort_order (integer)
- is_visible (boolean)
```

### Email Marketing Tables

#### 9. `email_subscribers`
Subscriber list.

```sql
- id (uuid, primary key)
- email (text, unique)
- first_name (text)
- last_name (text)
- status (text) - active, unsubscribed, bounced
- source (text)
- tags (text[])
- subscribed_at (timestamptz)
- unsubscribed_at (timestamptz)
```

#### 10. `email_lists`
Segmented subscriber groups.

```sql
- id (uuid, primary key)
- name (text)
- description (text)
- subscriber_count (integer)
- is_active (boolean)
- created_at (timestamptz)
```

#### 11. `email_list_subscribers`
Many-to-many relationship between lists and subscribers.

```sql
- id (uuid, primary key)
- list_id (uuid)
- subscriber_id (uuid)
- added_at (timestamptz)
```

#### 12. `email_templates`
Email design templates.

```sql
- id (uuid, primary key)
- name (text)
- subject (text)
- content (text)
- preview_text (text)
- template_type (text)
- variables (jsonb)
- is_active (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 13. `email_campaigns`
Email campaign management.

```sql
- id (uuid, primary key)
- name (text)
- template_id (uuid)
- list_id (uuid)
- status (text) - draft, scheduled, sending, sent, failed
- scheduled_at (timestamptz)
- sent_at (timestamptz)
- recipient_count (integer)
- sent_count (integer)
- failed_count (integer)
- created_by (uuid)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### 14. `email_campaign_recipients`
Campaign delivery tracking.

```sql
- id (uuid, primary key)
- campaign_id (uuid)
- subscriber_id (uuid)
- email (text)
- status (text) - pending, sent, failed, bounced
- sent_at (timestamptz)
- error_message (text)
- created_at (timestamptz)
```

### Legal Documents Table

#### 15. `legal_documents`
Policy and legal document management.

```sql
- id (uuid, primary key)
- document_type (text) - privacy_policy, terms_of_service, data_policy, etc.
- title (text)
- slug (text)
- content (text)
- version (text)
- status (text) - draft, published, archived
- effective_date (date)
- is_current (boolean)
- meta_description (text)
- created_by (uuid)
- created_at (timestamptz)
- updated_at (timestamptz)
- published_at (timestamptz)
```

### SEO Table

#### 16. `seo_metadata`
SEO settings per page.

```sql
- id (uuid, primary key)
- page_path (text, unique)
- meta_title (text)
- meta_description (text)
- og_title (text)
- og_description (text)
- og_image (text)
- keywords (text[])
- canonical_url (text)
- robots (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

---

## Features & Modules

### 1. Website Content Management
**Location**: `/admin/website`

**Features**:
- Edit site name, tagline, and branding
- Upload and manage logo and favicon
- Configure contact information
- Set color scheme
- Manage social media links
- Edit footer content

**Use Case**: Update your website's global appearance and contact details.

---

### 2. Menu Management
**Location**: `/admin/menu`

**Features**:
- Create multiple menus (header, footer, sidebar)
- Add/edit/delete menu items
- Hierarchical menu structure (parent-child)
- Drag-and-drop reordering
- Set visibility and link targets
- Icon support

**Use Case**: Build your website navigation with dropdown menus for service categories.

---

### 3. Services Management
**Location**: `/admin/services`

**Features**:
- Add service offerings
- Rich text content editor
- Featured services
- Custom icons
- Image uploads
- SEO metadata
- Reorder services

**Use Case**: Showcase HR & Recruitment, Corporate Training, and other service offerings.

---

### 4. Blog Management
**Location**: `/admin/blog`

**Features**:
- Create/edit/delete blog posts
- Rich text editor
- Categories and tags
- Featured images
- Draft/publish workflow
- SEO optimization
- Author attribution

**Use Case**: Publish thought leadership articles and company updates.

---

### 5. Contact Inquiries
**Location**: `/admin/inquiries`

**Features**:
- View all contact form submissions
- Status tracking (new, in progress, resolved)
- Add internal notes
- Search and filter
- Export data

**Use Case**: Manage and respond to customer inquiries efficiently.

---

### 6. Page Management
**Location**: `/admin/pages`

**Features**:
- Create custom pages
- URL slug management
- Template selection
- Rich content editor
- SEO settings
- Publish/unpublish

**Use Case**: Create custom pages like "Leadership Training" under Corporate Training.

---

### 7. SEO Management
**Location**: `/admin/seo`

**Features**:
- Centralized SEO control
- Meta titles and descriptions
- Open Graph tags
- Keywords management
- Canonical URLs
- Robots directives

**Use Case**: Optimize all pages for search engines from one interface.

---

### 8. Email Subscribers
**Location**: `/admin/email-subscribers`

**Features**:
- View all subscribers
- Import/export CSV
- Tag subscribers
- Manage status (active/unsubscribed)
- Track subscription source
- Manual add/remove

**Use Case**: Build and maintain your email marketing list.

---

### 9. Email Lists
**Location**: `/admin/email-lists`

**Features**:
- Create segmented lists
- Add subscribers to lists
- Track subscriber count
- List descriptions
- Active/inactive status

**Use Case**: Segment audience by interest (e.g., "HR Professionals", "Training Managers").

---

### 10. Email Templates
**Location**: `/admin/email-templates`

**Features**:
- Design email layouts
- Rich text editor
- Template variables
- Preview functionality
- Subject line management
- Template categories

**Use Case**: Create reusable email designs for newsletters, promotions, and updates.

---

### 11. Email Campaigns
**Location**: `/admin/email-campaigns`

**Features**:
- Create campaigns
- Select template
- Choose recipients (lists or individual)
- Add custom email addresses
- Track delivery status
- Campaign history

**Use Case**: Send targeted email campaigns to subscribers or prospect leads.

**How to Send Emails**:
1. Create a campaign
2. Select an email template
3. Click "Send" on draft campaign
4. Choose recipients:
   - **Email List**: Send to all subscribers in a list
   - **Individual**: Select specific subscribers or add custom emails
5. Confirm and send

---

### 12. Legal Documents
**Location**: `/admin/legal`

**Features**:
- Create policy documents
- Version control
- Document types:
  - Privacy Policy
  - Terms of Service
  - Data Policy
  - Cookie Policy
  - Refund Policy
  - Disclaimer
  - Acceptable Use Policy
- Rich text editor
- Effective date tracking
- Draft/publish workflow
- Set current version

**Use Case**: Maintain up-to-date legal policies and terms.

**How to Add/Update Policies**:
1. Go to Admin → Legal Documents
2. Click "Add Document"
3. Select document type (Privacy Policy, Terms of Service, Data Policy, etc.)
4. Enter title, content, and version
5. Set effective date
6. Check "Set as Current Version" to make it live
7. Save and publish

---

## Admin Panel Guide

### Accessing the Admin Panel

**URL**: `https://your-domain.com/admin/login`

**Login Credentials**: Set up via Supabase Authentication

### Dashboard Overview

The dashboard (`/admin/dashboard`) provides:
- Quick stats (services, blog posts, inquiries)
- Quick action cards for all features
- Organized sections:
  - Content Management
  - Email Marketing
  - Settings & Configuration

### Navigation Structure

All admin pages follow a consistent structure:
- Top navigation with breadcrumbs
- User email and sign-out button
- Main content area
- Action buttons (Create, Edit, Delete)
- Data tables or forms

---

## Implementation Guide

### Initial Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd adviserve-website
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

### Database Setup

All migrations are in `supabase/migrations/` directory:

1. `20260312121835_create_website_content_management.sql` - Core tables
2. `20260312175041_add_logo_favicon_management.sql` - Asset management
3. `20260312184355_fix_infinite_recursion_policies.sql` - RLS fixes
4. `20260312184631_make_created_by_nullable.sql` - User reference fixes
5. `20260312185501_create_email_campaigns.sql` - Email marketing
6. `create_email_campaigns.sql` - Campaign recipient tracking
7. `create_legal_documents.sql` - Legal document management

Migrations are automatically applied via Supabase.

### Adding New Admin Users

```typescript
// Via Supabase Auth
await supabase.auth.signUp({
  email: 'admin@example.com',
  password: 'secure_password'
});
```

### Deployment

1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting provider
3. Ensure `_redirects` file is included for SPA routing
4. Configure environment variables on hosting platform

---

## Security & Best Practices

### Row Level Security (RLS)

All tables have RLS enabled with policies:

**Authenticated Users** (Admin):
- Full CRUD access to all tables
- Policies check `auth.uid()` for authentication

**Public Users**:
- Read-only access to published content
- No access to admin tables
- View published legal documents

### Data Safety

1. **Never use DROP or DELETE without WHERE clause**
2. **Always backup before major changes**
3. **Use transactions for related operations**
4. **Validate user input on frontend and backend**

### Authentication

- Email/password authentication via Supabase
- Session management handled automatically
- Sign out clears all auth tokens
- Protected routes redirect to login

### Content Security

- XSS protection via React's built-in escaping
- SQL injection prevented by Supabase parameterized queries
- CORS properly configured
- Environment variables never exposed to client

### Email Marketing Compliance

- Unsubscribe functionality required
- Store consent records
- Respect subscriber preferences
- Track bounce and complaint rates

---

## Common Tasks

### Adding a Submenu Item Under Corporate Training

1. Go to `/admin/menu`
2. Click "Add Menu Item"
3. Fill in:
   - **Label**: "Leadership Training"
   - **URL**: "/services/corporate-training/leadership"
   - **Parent Item**: Select "Corporate Training"
   - **Sort Order**: Set display order
4. Save the menu item
5. Go to `/admin/pages` to create the actual page
6. Enter same URL path: "/services/corporate-training/leadership"
7. Add content and publish

### Updating Terms of Service

1. Go to `/admin/legal`
2. Find existing "Terms of Service" or create new
3. Click "Edit"
4. Update content with rich text editor
5. Increment version number (e.g., 1.0 → 2.0)
6. Set new effective date
7. Check "Set as Current Version"
8. Change status to "Published"
9. Save

### Sending an Email Campaign

1. Create email template at `/admin/email-templates`
2. Add subscribers at `/admin/email-subscribers`
3. Optionally create lists at `/admin/email-lists`
4. Go to `/admin/email-campaigns`
5. Click "Create Campaign"
6. Select template and optionally a list
7. Click "Send" on draft campaign
8. Choose recipients:
   - Email List: Send to entire list
   - Individual: Select specific subscribers or add custom emails
9. Confirm and send

### Adding a New Service

1. Go to `/admin/services`
2. Click "Add Service"
3. Fill in title, description, content
4. Add icon and image
5. Set SEO metadata
6. Check "Featured" if applicable
7. Save and publish

---

## File Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── RichTextEditor.tsx
├── pages/              # Page components
│   ├── admin/          # Admin panel pages
│   │   ├── Dashboard.tsx
│   │   ├── ServicesManagement.tsx
│   │   ├── BlogManagement.tsx
│   │   ├── EmailCampaigns.tsx
│   │   ├── LegalDocuments.tsx
│   │   └── ...
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── Blog.tsx
│   └── Contact.tsx
├── lib/                # Utilities and config
│   ├── supabase.ts     # Supabase client
│   ├── AuthContext.tsx # Auth provider
│   └── types.ts        # TypeScript types
├── hooks/              # Custom React hooks
│   └── useSiteAssets.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

---

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review and respond to inquiries
2. **Monthly**: Check email campaign performance
3. **Quarterly**: Update legal documents if needed
4. **As Needed**: Publish blog posts and update services

### Troubleshooting

**Issue**: Can't log in
- **Solution**: Check Supabase authentication settings, verify email/password

**Issue**: Changes not appearing
- **Solution**: Check published status, clear browser cache

**Issue**: Email campaigns not sending
- **Solution**: Verify recipients are selected, check campaign status

**Issue**: Menu not updating
- **Solution**: Check menu is set to "Active", verify menu items are visible

---

## Version History

- **v1.0** (March 2026) - Initial release
  - Core CMS functionality
  - Email marketing system
  - Legal document management
  - SEO tools
  - Complete admin panel

---

## Credits

Built with:
- React + TypeScript
- Supabase
- Tailwind CSS
- TipTap Editor
- Lucide Icons

---

*This documentation is comprehensive and covers all aspects of the Adviserve Website CMS. For additional support or questions, refer to the codebase or contact the development team.*
