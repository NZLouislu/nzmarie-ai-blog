import { User, USERS } from './users';

export function validateCredentials(username: string, password: string): User | null {
  const envMap = {
    admin: { 
      user: process.env.ADMIN_USERNAME, 
      pass: process.env.ADMIN_PASSWORD 
    },
    nzmarie: { 
      user: process.env.NZMARIE_USERNAME, 
      pass: process.env.NZMARIE_PASSWORD 
    }
  };
  
  for (const [userId, creds] of Object.entries(envMap)) {
    if (creds.user === username && creds.pass === password) {
      return USERS[userId];
    }
  }
  
  return null;
}

export function isValidUser(userId: string): boolean {
  return userId in USERS;
}

export function canAccessUser(currentUserId: string, targetUserId: string): boolean {
  const currentUser = USERS[currentUserId];
  if (!currentUser) return false;
  
  if (currentUser.role === 'admin') return true;
  return currentUserId === targetUserId;
}