# Port Configuration - Fixed to 8081

## ✅ Configuration Updated

The Vite development server has been configured to run on port **8081** to match your project setup.

## Configuration File

**File**: `vite.config.ts`

```typescript
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,  // Changed from 8080 to 8081
  },
  // ... rest of config
}));
```

## Application URLs

### Frontend (Vite Dev Server)
- **URL**: `http://localhost:8081`
- **Login**: `http://localhost:8081/login`
- **Admin Dashboard**: `http://localhost:8081/admin`
- **Browse**: `http://localhost:8081/browse`
- **Profile**: `http://localhost:8081/profile`

### Backend (Express Server)
- **URL**: `http://localhost:3000`
- **API Base**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/health`

## How to Start

### 1. Start Backend
```bash
cd campus-marketplace/backend
npm start
```
**Expected Output**:
```
Server running on port 3000
MongoDB Connected: ...
```

### 2. Start Frontend
```bash
npm run dev
```
**Expected Output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8081/
➜  Network: use --host to expose
```

### 3. Access Application
Open browser and go to: `http://localhost:8081`

## Admin Access

### Login as Admin
1. Navigate to: `http://localhost:8081/login`
2. Enter credentials:
   - Email: `admin@chitkara.edu.in`
   - Password: `admin123`
3. Click "Sign In"
4. Auto-redirected to: `http://localhost:8081/admin`

## Port Configuration Details

### Why Port 8081?
- Matches your existing project setup
- Avoids conflicts with other services
- Consistent across development team

### Port Conflicts
If port 8081 is already in use:

**Option 1: Kill existing process**
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8081 | xargs kill -9
```

**Option 2: Change port**
Edit `vite.config.ts`:
```typescript
server: {
  port: 8082,  // or any available port
}
```

### Environment Variables
The API URL is configured in `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

This is used by the frontend to connect to the backend.

## Verification

### Check Frontend is Running
```bash
curl http://localhost:8081
```
Should return HTML content.

### Check Backend is Running
```bash
curl http://localhost:3000/api/health
```
Should return:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Check Admin Access
1. Open: `http://localhost:8081/login`
2. Login with admin credentials
3. Should redirect to: `http://localhost:8081/admin`
4. Dashboard should load with data

## Troubleshooting

### Issue: Port 8081 already in use
**Error**: `Port 8081 is already in use`

**Solution**:
1. Find and kill the process using port 8081
2. Or change to a different port in `vite.config.ts`

### Issue: Cannot connect to backend
**Error**: `Failed to fetch` or `Network error`

**Solution**:
1. Verify backend is running on port 3000
2. Check `.env` has correct API URL
3. Check CORS is enabled in backend

### Issue: Admin dashboard not loading
**Solution**:
1. Clear browser cache
2. Clear localStorage
3. Re-login as admin
4. Check browser console for errors

## Development Workflow

### Standard Startup
1. **Terminal 1** - Backend:
   ```bash
   cd campus-marketplace/backend
   npm start
   ```

2. **Terminal 2** - Frontend:
   ```bash
   npm run dev
   ```

3. **Browser**:
   - Open `http://localhost:8081`
   - Start developing!

### Hot Reload
- Frontend: Vite hot reload enabled (instant updates)
- Backend: Restart required for changes (or use nodemon)

## Notes
- Port 8081 is now the default for frontend
- Backend remains on port 3000
- All documentation updated to reflect port 8081
- No code changes needed - just restart dev server
- Configuration is in `vite.config.ts`
