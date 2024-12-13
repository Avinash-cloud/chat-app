"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Nav';


const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        // Fetch user profile data when the component loads
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile', {
                    headers: {
                        Authorization: ` ${localStorage.getItem('token')}`, // Get the JWT token from localStorage or cookies
                    },
                });
                setProfileData(response.data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/profile', profileData, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            alert('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete your account?')) {
            try {
                await axios.delete('/api/profile', {
                    headers: {
                        Authorization: `${localStorage.getItem('token')}`,
                    },
                });
                alert('Account deleted successfully');
                window.location.href = "/login";
            } catch (err) {
                setError('Failed to delete account');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <><Navbar />

            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold">Profile</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={profileData.password}
                            onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm">Role</label>
                        <input
                            type="text"
                            id="role"
                            value={profileData.role}
                            onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded"
                    >
                        Update Profile
                    </button>
                </form>
                <button
                    onClick={handleDelete}
                    className="mt-4 w-full p-2 bg-red-500 text-white rounded"
                >
                    Delete Account
                </button>
            </div>
        </>
    );
};

export default Profile;
