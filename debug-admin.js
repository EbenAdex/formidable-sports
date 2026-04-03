// Debug script to check admin login setup
// Run this in browser console (F12 > Console tab)

// Check if admin user exists in localStorage
console.log("=== ADMIN LOGIN DEBUG ===");
const users = JSON.parse(localStorage.getItem('formidableSportsUsers') || '[]');
console.log("All users:", users);

const adminUser = users.find(u => u.email.toLowerCase() === 'ebenadex3008@gmail.com');
console.log("Admin user found:", adminUser);

if (adminUser) {
  console.log("Admin email:", adminUser.email);
  console.log("Admin password:", adminUser.password);
  console.log("Admin role:", adminUser.role);
} else {
  console.log("Admin user not found! Creating...");
  const defaultAdmin = {
    fullName: "Formidable Admin",
    email: "ebenadex3008@gmail.com",
    department: "Philosophy",
    level: "400",
    password: "Admin@123",
    role: "admin",
  };
  users.push(defaultAdmin);
  localStorage.setItem('formidableSportsUsers', JSON.stringify(users));
  console.log("Admin user created:", defaultAdmin);
}

// Test login function
console.log("=== TESTING LOGIN ===");
const testLogin = (email, password) => {
  const foundUser = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );
  return foundUser || null;
};

const testResult = testLogin('ebenadex3008@gmail.com', 'Admin@123');
console.log("Login test result:", testResult);