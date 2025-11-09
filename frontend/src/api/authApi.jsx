import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

// Function to register a new user
export const registerUser = async (name, email, password, role) => {
  try {
    if (!navigator.onLine) {
      throw new Error("No internet connection. Please check your network and try again.");
    }

    console.log("📤 Sending registration request:", { name, email, role });
    const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password, role });
    
    if (!response.data || !response.data.token) {
      throw new Error("Invalid response format from server");
    }

    console.log("✅ Registration successful:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Registration error:", error);
    
    if (error.response) {
      // Server responded with an error status
      throw error;
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Unable to connect to the server. Please check if the server is running.");
    } else if (error.message) {
      // Error in request setup or custom error
      throw error;
    } else {
      // Unexpected error
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

// Function to log in a user
export const loginUser = async (email, password) => {
  try {
    console.log("📤 Sending login request:", { email });
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    console.log("✅ Login successful:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    if (error.response) {
      // Server responded with an error
      throw error;
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Unable to connect to the server. Please check your connection.");
    } else {
      // Error in request setup
      throw new Error("An error occurred while setting up the request.");
    }
  }
};
