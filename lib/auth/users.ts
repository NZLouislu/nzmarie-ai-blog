export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "user";
  languagePreferences: string;
}

export const USERS: Record<string, User> = {
  admin: {
    id: "admin",
    username: "admin",
    name: "Administrator",
    role: "admin",
    languagePreferences: "both",
  },
  nzmarie: {
    id: "nzmarie",
    username: "nzmarie",
    name: "Marie Nian",
    role: "user",
    languagePreferences: "both",
  },
};

export function getUserById(id: string): User | null {
  return USERS[id] || null;
}

export function getAllUsers(): User[] {
  return Object.values(USERS);
}
