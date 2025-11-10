export default function Button({ label, loading, onClick }) {
    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={loading}
            className="login-btn"
        >
            {loading ? "Ingresando..." : label}
        </button>
    );
}
