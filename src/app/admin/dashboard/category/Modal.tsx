"use client";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 rounded-full hover:bg-gray-200"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
