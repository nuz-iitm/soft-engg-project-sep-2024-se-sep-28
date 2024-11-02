export default {
    template: `
      <div class="landing-page">
  
        <main class="main-content">
          <div class="content-container">
            <header class="header text-center">
                <i style="font-size:4rem" class="bi bi-backpack4-fill"></i>
                <h1 class="app-title">EduSync</h1>
                <p class="tagline">Streamlining project tracking for instructors and students</p>
            </header>
            <div class="button-container">
              <router-link to="/login" class="btn btn-primary btn-lg mr-2">Login</router-link>
              <router-link to="/register" class="btn btn-outline-secondary btn-lg">Sign Up</router-link>
            </div>
          </div>
        </main>
      </div>
    `
  };
  
