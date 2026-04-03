// Open browser console (F12) and run this to check users:
// console.log(JSON.parse(localStorage.getItem('formidableSportsUsers') || '[]'));

// To make your current user an admin, run this in browser console:
// const users = JSON.parse(localStorage.getItem('formidableSportsUsers') || '[]');
// const currentUser = JSON.parse(localStorage.getItem('formidableSportsUser'));
// if (currentUser) {
//   const userIndex = users.findIndex(u => u.email === currentUser.email);
//   if (userIndex !== -1) {
//     users[userIndex].role = 'admin';
//     localStorage.setItem('formidableSportsUsers', JSON.stringify(users));
//     localStorage.setItem('formidableSportsUser', JSON.stringify(users[userIndex]));
//     console.log('User role updated to admin. Refresh the page.');
//   }
// }