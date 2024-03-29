import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const CreatePostForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
      'http://localhost:3000/api/v1/posts', // Endpoint to create a new post
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}` // Attach JWT token to Authorization header
        }
      }
    );
      toast.success('Post Created Succesfully')
    // If the request is successful, return the response data
    return response.data;
    
            
        } catch (error) {
            console.error('Error creating post:', error.response.data.message);
            toast.error('Failed To Create Post')
            // Handle error, display error message to the user
        }
    };

    return (
        <div>
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePostForm;
