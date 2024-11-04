export default {
  template: `
    <div style="height: 100%; width:100%; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white;">
      <router-link to="/" style="color: #fff; text-decoration: underline;position:absolute; font-size:2.5rem; margin-left:1rem;"><i class="bi bi-arrow-left-circle"></i></router-link>
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <header style="text-align: center; margin-bottom: 2rem;">
          <i class="bi bi-person-plus-fill" style="font-size:4rem; color: white;"></i>
          <h1 style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">User Registration</h1>
          <p style="font-size: 1.25rem; color: #e0e0e0; margin-bottom: 2rem;">Create your account to start tracking projects</p>
        </header>

        <main style="max-width: 400px; width: 100%; padding: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; text-align: center;">
          <div>
            <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Sign Up</h2>
            <p style="margin-bottom: 1rem;">Fill in your details to create an account.</p>
            <form @submit.prevent="submitForm" style="display: flex; flex-direction: column; align-items: center;">
              <label for="user-name" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Name</label>
              <input type="text" id="user-name" v-model="userDetails.name" placeholder="Your Name" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />

              <label for="user-email" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Email Address</label>
              <input type="email" id="user-email" v-model="userDetails.email" placeholder="name@example.com" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />
  <div>
    <p><router-link to="/"><i style="font-size:2.5rem" class="bi bi-arrow-left-short"></i></router-link></p>
    <h1 style="text-align:center">Registration</h1>
      <div class='d-flex justify-content-center' style="margin-top: 10vh">
        <div class="mb-3 p-5 bg-light">
          <form @submit.prevent='checkForm'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
            </p>
            
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" required>

              <label for="user-password" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Password</label>
              <input type="password" id="user-password" v-model="userDetails.password" placeholder="Create a password" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />

              <label style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Role</label>
              <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                <label style="flex: 1;">
                  <input type="radio" v-model="userDetails.role" value="student" required />
                  Student
                </label>
                <label style="flex: 1;">
                  <input type="radio" v-model="userDetails.role" value="instructor" required />
                  Instructor
                </label>
              </div>

              <button type="submit" style="background-color: #4a90e2; border: none; color: white; padding: 10px 20px; font-size: 1rem; border-radius: 8px; transition: all 0.3s ease; margin-top: 1rem;">Register</button>
            </form>
            <p v-if="registrationMessage" style="margin-top: 1rem;">{{ registrationMessage }}</p>
            <p style="margin-top: 1rem;">Already have an account? <router-link to="/login" style="color: #fff; text-decoration: underline;">Login</router-link></p>
          </div>
        </main>
      </div>
    </div>
  `,

  data() {
    return {
      userDetails: {
        name: '',
        email: '',
        password: '',
        role: ''
      },
      registrationMessage: '' // Feedback message for registration status
    };
  },

  methods: {
    submitForm() {
      fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.userDetails)
      })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
          if (status === 201) {
            this.registrationMessage = "Registration successful! You can now log in.";
          } else {
            this.registrationMessage = body.message || "Registration failed. Please try again.";
          }
        })
        .catch(error => {
          console.error("There was an error with the registration request!", error);
          this.registrationMessage = "An error occurred. Please try again later.";
        });
    }
  }
};
