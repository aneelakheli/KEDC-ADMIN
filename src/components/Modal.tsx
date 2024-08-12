'use client'
import React from 'react';
import { IoClose } from "react-icons/io5";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg mt-16 p-6">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <IoClose className="text-xl"/>
        </button>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
