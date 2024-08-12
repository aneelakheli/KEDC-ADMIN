import React, { useState } from 'react'

function CommentForm() {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        errors: {}
    })
    const [errors, setErrors] = useState({});


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = () => {

    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Post a Comment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Comment Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.title && <p className="text-red text-xs mt-1">{errors.title}</p>}
                </div>
                <div className="my-4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Comment Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-3 text-gray-900 border-stroke dark:text-white bg-gray-100 rounded border border-gray-300 dark:border-gray-700" />
                </div>
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" type='submit'>
                    Post
                </button>
            </form>
        </div>
    )
}

export default CommentForm