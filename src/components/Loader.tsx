interface LoaderProps {
    message?: string; // opcional
}

const Loader = ({ message }: LoaderProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* Spinner */}
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>

            {/* Mensaje opcional */}
            {message && (
                <p className="mt-2 text-gray-600 font-medium">{message}</p>
            )}
        </div>
    );
};

export default Loader;