// components/DeleteButton.jsx
"use client";

import { FaTrash } from 'react-icons/fa'; // Menggunakan ikon dari react-icons

export default function DeleteButton({ onDelete }) {
  return (
    <button
      type="submit"
      onClick={onDelete}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }}
    >
      <FaTrash size={20} />
    </button>
  );
}