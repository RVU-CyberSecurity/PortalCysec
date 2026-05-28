# InternTrack Pro - GitHub Integration Setup Guide

## 📋 Overview

InternTrack Pro is a complete project management system with GitHub organizational repository integration. The system consists of two main files:

1. **interntrack-login.html** - Authentication & Admin Configuration
2. **interntrack-pro-app.html** - Main Application

## 🚀 Quick Start

### Step 1: Download Files
- `interntrack-login.html` (Login & Admin Config)
- `interntrack-pro-app.html` (Main Application)

Save both files in the same folder.

### Step 2: Start with Login
1. Open `interntrack-login.html` in your browser
2. Sign in with demo credentials OR register a new account

### Step 3: Admin Configuration (Important!)
1. Click "Admin Config" tab
2. Login as admin: `admin@rvu.edu` / `admin123`
3. Enter GitHub Organization details:
   - **Organization Name:** `rvu-cybersecurity`
   - **OAuth Client ID:** (get from GitHub)
   - **OAuth Client Secret:** (get from GitHub)
   - **Personal Access Token:** (get from GitHub)
4. Click "Save Configuration"

---

## 🔐 Demo Credentials

**Admin Account:**
```
Email: admin@rvu.edu
Password: admin123
Role: Admin
```

**Mentor Account:**
```
Email: mentor@rvu.edu
Password: pass123
Role: Faculty/Mentor
```

**Student Account:**
```
Email: student@rvu.edu
Password: pass123
Role: Student
```

---

## 📦 GitHub Setup Instructions

### Create GitHub Organization

1. Go to https://github.com/organizations/new
2. Create organization: `rvu-cybersecurity`
3. Add team members as needed

### Register OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** InternTrack Pro
   - **Homepage URL:** https://yourdomain.com
   - **Authorization callback URL:** https://yourdomain.com/interntrack-login.html
4. Copy **Client ID** and **Client Secret**

### Create Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `read:org`, `admin:repo_hook`
4. Copy the token (save securely!)

### In InternTrack Pro Admin Panel

1. Login as admin
2. Click "Admin Config" tab
3. Enter all GitHub credentials
4. Click "Save Configuration"

---

## 👥 User Roles & Permissions

### Admin
- ✅ Create/edit projects
- ✅ Manage users
- ✅ Configure GitHub
- ✅ View all submissions
- ✅ Access all settings

### Faculty/Mentor
- ✅ View assigned projects
- ✅ View student submissions
- ✅ Provide feedback
- ❌ Create projects
- ❌ Configure GitHub

### Student
- ✅ View assigned projects
- ✅ Submit work via GitHub
- ✅ Track submissions
- ❌ Manage projects
- ❌ View other submissions

---

## 📝 Project Management

### For Admin: Create Project

1. Login as Admin
2. Go to Dashboard → "Add Project" button
3. Fill in:
   - **Project Name:** (required)
   - **Faculty Guide:** (select from dropdown)
   - **GitHub Repository:** (e.g., rvu-proj-security)
   - **Description:** (optional)
   - **Max Students:** (default 20)
4. Click "Create"

### Projects Included

1. 802.1X Port-Based Authentication - Dr. Manish Kumar
2. Q-Learning Based IoT Routing - Sunilkumar J
3. AI Cyber Crime Prediction - Evlin Vidyu Latha P
4. Network Traffic Anomaly Detection - Dr.Sarasvathi V
5. AI-Driven Intrusion Detection - Dr. Manish Kumar

---

## 💾 Student Submissions

### How Students Submit Work

1. Student logs in to InternTrack Pro
2. Goes to "Projects" tab
3. Clicks "Submit" button on project
4. Enters GitHub repository link:
   ```
   https://github.com/rvu-cybersecurity/[repository-name]
   ```
5. Adds assignment title and description
6. Clicks "Submit to GitHub"

### Where Submissions Go

All submissions are automatically:
- ✅ Recorded in InternTrack Pro
- ✅ Linked to RVU Cybersecurity organization
- ✅ Visible to mentors for review
- ✅ Tracked with timestamps

---

## 🔄 Workflow Example

### Complete Workflow

**Step 1: Admin Setup (One-time)**
```
1. Admin logs in
2. Configures GitHub organization
3. Creates projects
```

**Step 2: Faculty Assignment**
```
1. Mentor logs in
2. Sees assigned projects
3. Monitors student progress
```

**Step 3: Student Submission**
```
1. Student logs in
2. Clicks "Submit" on project
3. Enters GitHub repo link
4. Submission recorded automatically
```

**Step 4: Review**
```
1. Mentor views submissions
2. Provides feedback
3. Marks as reviewed
```

---

## 🛠️ Technical Details

### Data Storage
- Uses **Browser LocalStorage**
- Data persists across sessions
- Can be exported via browser DevTools

### GitHub Integration
- Uses **GitHub REST API**
- OAuth 2.0 authentication
- Automatic repository linking
- Submission tracking via GitHub

### No Backend Required
- Completely client-side
- No server needed
- Works offline (except GitHub features)
- Instant deployment

---

## 🔍 Features

### Dashboard
- Quick overview of active projects
- Submission count
- Role-based information

### Projects
- View all available projects
- GitHub repository links
- Project guides and descriptions
- Student enrollment status

### Submissions
- Student submission history
- Direct GitHub links
- Submission dates
- Milestone tracking

### Admin Features
- Add new projects
- Configure GitHub
- Manage users
- System settings

---

## 🚨 Troubleshooting

### Login Issues
- Verify email and password
- Check capitalization
- Clear browser cache if needed

### GitHub Not Connecting
- Verify organization name is correct
- Check token expiration
- Ensure OAuth credentials are valid
- Try re-entering configuration

### Submissions Not Saving
- Ensure GitHub link is valid
- Check repository is in RVU Cybersecurity organization
- Verify browser allows localStorage
- Try different browser

### Can't See Projects
- Verify your role has access
- Admin sees all projects
- Students see only assigned projects
- Mentors see only their projects

---

## 📱 Browser Requirements

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with JavaScript enabled

---

## 🔒 Security Notes

- GitHub credentials are stored locally
- Personal Access Token should be kept confidential
- OAuth Client Secret should not be shared
- Credentials are stored in browser localStorage
- Consider using environment variables for production

---

## 📞 Support

### Common Issues

**Q: Do students need GitHub accounts?**
A: Yes, students submit via GitHub repositories in the RVU Cybersecurity organization.

**Q: Can I change the organization name?**
A: Yes, in Admin Config panel. But existing repositories won't move automatically.

**Q: How long do submissions stay visible?**
A: Indefinitely, they're stored in browser localStorage and on GitHub.

**Q: Can multiple admins configure GitHub?**
A: Only one admin config is needed. It's shared across all users.

**Q: What if I forget the admin password?**
A: Clear browser data and re-register as admin with a new password.

---

## ✅ Checklist for Launch

Before going live:

- [ ] Download both HTML files
- [ ] Test login with demo credentials
- [ ] Create GitHub organization
- [ ] Register OAuth App
- [ ] Generate Personal Access Token
- [ ] Configure GitHub in Admin panel
- [ ] Create projects
- [ ] Test student submission
- [ ] Verify mentor access
- [ ] Share login URL with users

---

## 🎯 Next Steps

1. **Setup:**
   - Download the files
   - Open `interntrack-login.html`
   - Configure GitHub

2. **Populate:**
   - Create projects
   - Add faculty guides
   - Configure student access

3. **Launch:**
   - Share login link with students
   - Share login link with faculty
   - Start receiving submissions!

---

**You're ready to launch InternTrack Pro!** 🚀

All submissions will automatically be linked to your RVU Cybersecurity GitHub organization.

