'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/serivces/authService';

const LoginComponent = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.email) {
            setErrors({
                ...errors,
                email: 'Email is required'
            });
            return;
        }
        if (!formData.password) {
            setErrors({
                ...errors,
                password: 'Password is required'
            });
            return;
        }

        try {
            // Replace with actual API login request
            const response = await loginUser(formData);
            console.log(formData);
            console.log("Respnseabcd ====",response, "success",response.success);
            if (response.success) {
                // console.log("response ====",response.data);
                localStorage.setItem('token', response.data);
                router.push('/'); // Redirect to dashboard on success
            } else {
                setErrors({
                    ...errors,
                    password: 'Invalid credentials'
                });
            }
        } catch (error) {
            // Actual error handling for API call
            setErrors({
                ...errors,
                password:  'Invalid credentials'
            });
        }
    };

    return (
        <main className="flex w-full flex-col">
            <div className="py-16">
                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                    <div
                        className="hidden lg:block lg:w-1/2 bg-cover"
                        style={{ backgroundImage: "url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F49%2Fe7%2F76%2F49e776c2141c15b50f29833266c69eaa.jpg&f=1&nofb=1&ipt=113278c7047f9353fe20d4807010001fdb61d32bad08f68dbe7bd89b8f88605e&ipo=images')" }}
                    ></div>
                    <div className="w-full p-8">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center">KEDC</h2>
                        <p className="text-xl text-gray-600 text-center">Welcome back!</p>

                        {(errors.email || errors.password) && (
                            <p className="text-red-500 text-center">
                                {errors.email && <span>{errors.email}</span>}
                                {errors.email && errors.password && <span>&nbsp;&nbsp;&nbsp;</span>}
                                {errors.password && <span>{errors.password}</span>}
                            </p>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                    <a href="#" className="text-xs text-gray-500">Forgot Password?</a>
                                </div>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mt-8">
                                <button className="bg-red text-white font-bold py-2 px-4 w-full rounded hover:bg-lightred">Login</button>
                            </div>
                        </form>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 md:w-1/4"></span>
                            <Link href="/register" className="text-xs text-gray-500 uppercase">or sign up</Link>
                            <span className="border-b w-1/5 md:w-1/4"></span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginComponent;
