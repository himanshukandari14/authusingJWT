

// context.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const MyContext = createContext({
  userData: {
    firstName: '',
    lastName: '',
     email:'',
    image:'',
 
  }
});

export const MyProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email:'',
    image:'',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
    if (!token) {
      console.error('Token not found in localStorage');
      return; // Exit early if token is not found
    }
    
    // Make authenticated API call to fetch user data
    const response = await axios.get('http://localhost:3000/api/v1/profile', {
      headers: {
        Authorization: `Bearer ${token}` // Attach JWT token to Authorization header
      }
    });
    
    // Handle successful response
    console.log('API Response:', response.data);

    // Process user data as needed, e.g., set state, display in UI, etc.
    setUserData(response.data.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Handle error, e.g., display error message to user
  }
};



  return (
    <MyContext.Provider value={{ loading,setLoading,setUserData, userData, isAuthenticated,setIsAuthenticated, fetchUserData }}>
      {children}
    </MyContext.Provider>
  );
};
