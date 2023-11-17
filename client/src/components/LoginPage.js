import React from 'react';

function LoginPage() {
  return (
    <div>
      <h2>Login to VivaVital</h2>
      <form action="/login" method="post">
        <input type="email" name="email" placeholder="Email" required /><br />
        <input type="password" name="password" placeholder="Password" required /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
