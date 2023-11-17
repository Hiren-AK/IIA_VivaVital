import React from 'react';

function RegisterPage() {
  return (
    <div>
      <h2>Register for VivaVital</h2>
      <form action="/register" method="post">
        <input type="text" name="username" placeholder="Username" required /><br />
        <input type="email" name="email" placeholder="Email" required /><br />
        <input type="password" name="password" placeholder="Password" required /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
