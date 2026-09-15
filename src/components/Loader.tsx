interface LoaderProps {
    message?: string;
}

const Loader = ({ message = "Cargando..." }: LoaderProps) => {
    return (
        <div className="loader-overlay">
            <div className="spinner"></div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Loader;