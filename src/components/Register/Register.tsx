'use client'

import React, { useReducer } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/serivces/authService';

interface FormErrors {
    fullName?: string;
    email?: string;
    contactNo?: string;
    password?: string;
    role?: string;
    schoolName?: string;
    form?: string;
}

interface FormState {
    fullName: string;
    email: string;
    contactNo: string;
    password: string;
    role: string;
    schoolName: string;
    errors: FormErrors;
    success: string;
    loading: boolean;
}

type Action =
    | { type: 'SET_FIELD'; field: string; value: string }
    | { type: 'SET_ERROR'; field: string; value: string }
    | { type: 'SET_SUCCESS'; value: string }
    | { type: 'CLEAR_SUCCESS' }
    | { type: 'CLEAR_ERRORS' };

const initialState: FormState = {
    fullName: '',
    email: '',
    contactNo: '',
    password: '',
    role: '',
    schoolName: '',
    errors: {},
    success: '',
    loading: false
};

const reducer = (state: FormState, action: Action): FormState => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_ERROR':
            return { ...state, errors: { ...state.errors, [action.field]: action.value } };
        case 'SET_SUCCESS':
            return { ...state, success: action.value, errors: {} };
        case 'CLEAR_ERRORS':
            return { ...state, errors: {}, success: '' };
        case 'CLEAR_SUCCESS':
            return { ...state, success: '' };
        default:
            return state;
    }
};

const validateForm = (state: FormState): FormErrors => {
    const { fullName, email, contactNo, password, role, schoolName } = state;
    const errors: FormErrors = {};

    if (!fullName) {
        errors.fullName = 'Full Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
        errors.email = 'Invalid email address';
    }

    if (!contactNo) {
        errors.contactNo = 'Contact Number is required';
    } else if (contactNo.length < 9) {
        errors.contactNo = 'Invalid Contact Number. It should be at least 9/10 digits';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else {
        const passwordErrors = [];
        if (password.length < 8) {
            passwordErrors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            passwordErrors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            passwordErrors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            passwordErrors.push('Password must contain at least one digit');
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            passwordErrors.push('Password must contain at least one special character');
        }
        if (passwordErrors.length > 0) {
            errors.password = passwordErrors.join('. ');
        }
    }

    if (!role) {
        errors.role = 'Role is required';
    }

    if (!schoolName) {
        errors.schoolName = 'School Name is required';
    }

    return errors;
};

function Register() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'CLEAR_ERRORS' });

        const errors = validateForm(state);
        if (Object.keys(errors).length > 0) {
            for (const field in errors) {
                if (Object.prototype.hasOwnProperty.call(errors, field)) {
                    const errorField = field as keyof FormErrors;
                    dispatch({ type: 'SET_ERROR', field: errorField, value: errors[errorField] as string });
                }
            }
            return;
        }

        try {
            const response = await registerUser({
                fullName: state.fullName,
                email: state.email,
                contactNo: state.contactNo,
                password: state.password,
                role: state.role,
                schoolName: state.schoolName
            });
            if (response.success === true) {
                dispatch({ type: 'SET_SUCCESS', value: response.message });
                router.push('/dashboard/login', { scroll: false });
            } else {
                dispatch({ type: 'SET_ERROR', field: 'form', value: response.message || 'Registration failed. Please try again.' });
            }
        } catch (err) {
            dispatch({ type: 'SET_ERROR', field: 'form', value: err?.response?.data?.message || 'Registration failed. Please try again.' });
        }
    };

    return (
        <main className="flex w-full flex-col">
            <div className="py-16">
                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl flex-row-reverse">
                    <div
                        className="hidden lg:block lg:w-1/2 bg-cover"
                        style={{ backgroundImage: "url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F49%2Fe7%2F76%2F49e776c2141c15b50f29833266c69eaa.jpg&f=1&nofb=1&ipt=113278c7047f9353fe20d4807010001fdb61d32bad08f68dbe7bd89b8f88605e&ipo=images')" }}
                    ></div>
                    <div className="w-full p-8">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center">Join KEDC</h2>
                        <p className="text-xl text-gray-600 text-center">Welcome!</p>

                        {(state.errors.form && <p className="text-red-500 text-center">{state.errors.form}</p>) || (state.success && <p className="text-green-500 text-center">{state.success}</p>)}

                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="text"
                                    value={state.fullName}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'fullName', value: e.target.value })}
                                />
                                {state.errors.fullName && <p className="text-red-500 text-sm">{state.errors.fullName}</p>}
                            </div>

                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="email"
                                    value={state.email}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                                />
                                {state.errors.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
                            </div>

                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="text"
                                    value={state.contactNo}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'contactNo', value: e.target.value })}
                                />
                                {state.errors.contactNo && <p className="text-red-500 text-sm">{state.errors.contactNo}</p>}
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                </div>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="password"
                                    value={state.password}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                                />
                                {state.errors.password && <p className="text-red-500 text-sm">{state.errors.password}</p>}
                            </div>

                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                <select
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    value={state.role}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'role', value: e.target.value })}
                                >
                                    <option value="">Select a role</option>
                                    <option value="Author">Author</option>
                                    <option value="Teacher">Teacher</option>
                                </select>
                                {state.errors.role && <p className="text-red-500 text-sm">{state.errors.role}</p>}
                            </div>


                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">School Name</label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="text"
                                    value={state.schoolName}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'schoolName', value: e.target.value })}
                                />
                                {state.errors.schoolName && <p className="text-red-500 text-sm">{state.errors.schoolName}</p>}
                            </div>

                            <div className="mt-8">
                                <button className="bg-red-500 text-white font-bold py-2 px-4 w-full rounded hover:bg-red-400">Sign Up</button>
                            </div>
                        </form>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 md:w-1/4"></span>
                            <p className="text-sm text-gray-500">Already have an account ?</p>
                            <Link href="/dashboard/login" className="text-xs text-gray-500 uppercase">Log in</Link>
                            <span className="border-b w-1/5 md:w-1/4"></span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Register;
