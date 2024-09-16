import React, { useState } from 'react';
import Modal from '../Modal';
import { useQuery } from '@tanstack/react-query';
import notify from '@/utils/notify';
import { addEvent, getAllEvents } from '@/serivces/eventService';

function AddEventModal({ showModal, toggleShowModal }) {
    const { data: eventData, isLoading: isEventLoading, error: eventError, isError: isEventError, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: () => getAllEvents(),
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        icon: '',
        alt: 'icon image',
        isPreview: false,
        iconUrl: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Event Title is required';
        if (!formData.eventDate) newErrors.eventDate = 'Event Date is required';
        let exists = false;
        eventData?.data?.map(event => {
            if (event.title === formData.title)
                exists = true;
        });
        if (exists) newErrors.title = 'Event Title already exists';
        return newErrors;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        } else {
            setIsLoading(true);
            try {
                const response = await addEvent(formData);
                if (response.success) {
                    notify("Event successfully added", "success");
                    refetch();
                    setFormData({
                        title: '',
                        description: '',
                        eventDate: '',
                        icon: '',
                        alt: 'icon image',
                        isPreview: false,
                        iconUrl: ''
                    });
                    toggleShowModal();
                } else {
                    console.error("Error adding event", response, "Data:", response.data);
                }
            } catch (error) {
                console.error("Caught Error", error.response?.status, error.response?.data?.error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const iconUrl = URL.createObjectURL(file);
            setFormData({ ...formData, icon: file, iconUrl });
            setErrors({ ...errors, icon: '' });
        }
    };

    const handleRemoveIcon = () => {
        setFormData({ ...formData, icon: null, iconUrl: '' });
    };

    return (
        <Modal isOpen={showModal} onClose={toggleShowModal}>
            <div className="overflow-y-scroll h-125">
                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Add New Event
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Event Title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.title && <p className="text-red text-xs mt-1">{errors.title}</p>}
                </div>
                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        rows="3"
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
                </div>

                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Event Date
                    </label>
                    <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.eventDate && <p className="text-red text-xs mt-1">{errors.eventDate}</p>}
                </div>

                <div className="flex flex-col justify-center items-center my-4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Icon Image
                    </label>
                    <div className="w-full md:w-1/2 relative grid grid-cols-1 md:grid-cols-3 border border-gray-300 bg-gray-100 rounded-lg select-none">
                        <div className="rounded-l-lg p-4 bg-gray-200 flex flex-col justify-center items-center border-0 border-r border-gray-300">
                            <label className="cursor-pointer hover:opacity-80 inline-flex items-center text-center justify-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                Select image
                                <input id="iconImage" name="icon" className="text-sm cursor-pointer w-36 hidden" type="file" onChange={handleIconChange} accept="image/*" />
                            </label>
                            <button
                                type="button"
                                onClick={handleRemoveIcon}
                                className="inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150">
                                remove image
                            </button>
                        </div>
                        <div className="relative order-first md:order-last h-28 md:h-auto flex justify-center items-center border border-dashed border-gray-400 col-span-2 m-2 rounded-lg bg-no-repeat bg-center bg-origin-padding bg-cover" style={{ backgroundImage: `url(${formData.iconUrl || formData.icon || ''})` }}>
                            {!formData.iconUrl && !formData.icon && (
                                <span className="text-gray-400 opacity-75">
                                    <svg className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="0.7" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    </div>
                    {errors.icon && <p className="text-red text-xs mt-1">{errors.icon}</p>}
                </div>

                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Alt Text
                    </label>
                    <input
                        type="text"
                        name="alt"
                        placeholder="Alt Text"
                        value={formData.alt}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.alt && <p className="text-red text-xs mt-1">{errors.alt}</p>}
                </div>

                <div className="flex items-center my-4">
                    <input
                        type="checkbox"
                        name="isPreview"
                        checked={formData.isPreview}
                        onChange={handleInputChange}
                        className="mr-2"
                    />
                    <label className="block text-sm font-medium text-black dark:text-white">Preview Mode</label>
                </div>

                <button className='bg-red p-2 text-white rounded-md my-4' onClick={handleCreate}>
                    Add Event
                </button>
            </div>
        </Modal>
    );
}

export default AddEventModal;
