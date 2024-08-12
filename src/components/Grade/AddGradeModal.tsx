import React, { useState } from 'react'
import Modal from '../Modal'
import { addSubject, getAllSubjects } from '@/serivces/subjectService';
import { useQuery } from '@tanstack/react-query';
import notify from '@/utils/notify';
import { addGrade, getAllGrades } from '@/serivces/gradeService';

function AddGradeModal({ showModal, toggleShowModal }) {
    const { data: gradeData, isLoading: isGradeLoading, error: gradeError, isError: isGradeError, refetch } = useQuery({
        queryKey: ['grade'],
        queryFn: () => getAllGrades(),
    });

    const [formData, setFormData] = useState({
        name: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Grade Name is required';
        let exists = false;
        gradeData.data.map(grade => {
            if (grade.name === formData.nam)
                exists = true;
        })
        if (exists) newErrors.name = 'Grade Name already exists';

        return newErrors;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            console.log("Errors", newErrors)
            setErrors(newErrors);
            return;
        }
        else {
            try {
                const response = await addGrade(formData);
                if (response.success === true) {
                    notify("Grade successfully added", "success");
                    refetch();
                    setFormData({
                        name: '',
                    })
                    toggleShowModal();
                }
                else {
                    console.error("Error adding grade", response, "Data:", response.data);
                    notify("Failed to add Grade", "error");
                }
            }
            catch (error) {
                console.error("Caught Error", error.response.status, error.response.data.error);
                notify("Failed to add Grade", "error");
                return;
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Modal isOpen={showModal} onClose={toggleShowModal}>
            <div className="h-48">
                <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Add New Grade
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Grade Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.name && <p className="text-red text-xs mt-1">{errors.name}</p>}
                </div>

                <button className='bg-red p-2 text-white rounded-md my-4' onClick={handleCreate}>Add</button>
            </div>
        </Modal>
    )
}

export default AddGradeModal