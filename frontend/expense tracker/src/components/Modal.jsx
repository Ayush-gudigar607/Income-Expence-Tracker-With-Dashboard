const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="relative p-4 w-full max-w-2xl">
        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-sm ">
          {/* Modal Header */}
          <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 dark:text-black">
              {title ? title : "Modal Title"}
            </h3>
            <button
              type="button"
              className="absolute right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:text-white cursor-pointer"
              onClick={onClose}
            >
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
              {/* <span className='sr-only'>Close modal</span> */}
            </button>
          </div>
          {/* Modal Body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
