# Community Occasion Messaging - MVP Frontend

A modern, responsive web application for managing community members and automatically sending greeting messages on special occasions like birthdays, anniversaries, and other important dates.

## 🌟 Features

### Public Features
- **Member Registration**: Simple form for community members to join via invite links
- **Event Management**: Members can add birthdays, anniversaries, memorials, and custom events
- **Pending Status**: Clear feedback after registration submission

### Admin Features
- **Dashboard**: Overview of community statistics and recent activity
- **Member Approval**: Review and approve/reject pending registrations
- **Member Management**: Full CRUD operations for members and their events
- **Message Templates**: Create and manage personalized message templates
- **Message Logs**: View sent messages and delivery status
- **Settings**: Configure community preferences and sending schedules

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit: `http://localhost:8080`

### Demo Credentials

For admin access, use these demo credentials:
- **Email**: admin@community.com
- **Password**: admin123

## 📱 Routes & Navigation

### Public Routes
- `/` - Member registration form (also `/join/:inviteToken`)
- `/join/pending` - Post-registration confirmation page

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin` - Dashboard with statistics and overview
- `/admin/pending` - Review pending member registrations
- `/admin/members` - Manage all community members
- `/admin/members/:id` - Individual member details
- `/admin/templates` - Message template management
- `/admin/messages` - Message logs and delivery status
- `/admin/settings` - Community configuration

## 🎨 Design System

### Accessibility Features
- ✅ WCAG 2.1 AA compliant color contrast ratios (4.5:1+)
- ✅ Visible focus rings on all interactive elements
- ✅ Semantic HTML5 structure with proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Screen reader friendly markup
- ✅ Responsive design for mobile and desktop

## 🛠 Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI primitives with ShadCN/UI
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📝 Usage Examples

### Member Registration Flow
1. Member receives invitation link: `/join/abc123token`
2. Fills out registration form with personal info and events
3. Submits form and sees pending confirmation
4. Admin reviews and approves/rejects in admin dashboard

### Admin Workflow
1. Login with admin credentials
2. Review dashboard for pending registrations
3. Approve/reject new members
4. Manage message templates and settings
5. Monitor message logs for delivery issues

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Setup
The app currently uses mock data and hardcoded authentication. For production:

1. Replace mock data with actual API calls
2. Implement proper authentication (JWT, OAuth, etc.)
3. Set up environment variables for configuration
4. Configure backend API endpoints

---

**Live Demo**: Visit `http://localhost:8080` after running the development server to explore both public and admin functionality!
