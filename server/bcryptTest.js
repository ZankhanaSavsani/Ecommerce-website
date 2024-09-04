const bcrypt = require('bcryptjs');

console.time('bcrypt');
bcrypt.hash('testpassword', 10, (err, hash) => {  // Hash the password
  console.timeEnd('bcrypt');  // End the timer
  if (err) {
    console.log('Error:', err);  // Log any error
  } else {
    console.log('Hash:', hash);  // Log the resulting hash
  }
});