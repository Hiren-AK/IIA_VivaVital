import React from 'react';

function LandingPage() {
  return (
    <div>
      <header>
        <h1>Welcome to VivaVital</h1>
        <nav>
          <a href="/login">Login</a> | <a href="/register">Register</a>
        </nav>
      </header>

      <section>
        <h2>Track and Improve Your Health and Diet</h2>
        <p>Join VivaVital to start managing your health and nutritional intake effectively.</p>
      </section>

      <footer>
        <p>&copy; 2023 VivaVital</p>
      </footer>
    </div>
  );
}

export default LandingPage;