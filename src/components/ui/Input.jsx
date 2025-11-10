import Icon from "./Icon";

export default function Input({ type = "text", placeholder, icon, value, onChange }) {
    return (
        <div className="input-group relative">
            <Icon name={icon} className="icon" />
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input"
            />
        </div>
    );
}
