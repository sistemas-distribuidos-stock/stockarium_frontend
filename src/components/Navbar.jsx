export default function Navbar({ onLogout }) {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <img
                    src="/walmart-logo.png"
                    alt="Walmart Logo"
                    className="navbar-logo"
                />
                <h1 className="navbar-title">Stockarium Walmart</h1>
            </div>

            <div className="navbar-right">
                <span className="navbar-user"></span>
                <button onClick={onLogout} className="navbar-logout">
                    Salir
                </button>
            </div>
        </header>
    );
}
