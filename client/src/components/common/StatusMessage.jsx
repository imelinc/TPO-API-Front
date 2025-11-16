import { Link } from "react-router-dom";
import "../../styles/statusMessage.css";

export default function StatusMessage({
    type = "error",
    icon,
    title,
    message,
    linkTo,
    linkText
}) {
    const getIcon = () => {
        if (icon) return icon;

        switch (type) {
            case "success":
                return "✓";
            case "error":
                return "✕";
            case "warning":
                return "!";
            default:
                return "✕";
        }
    };

    return (
        <div className="status-message">
            <div className={`status-message__container status-message__container--${type}`}>
                <div className={`status-message__icon status-message__icon--${type}`}>
                    {getIcon()}
                </div>

                {title && (
                    <h2 className="status-message__title">{title}</h2>
                )}

                {message && (
                    <p className="status-message__text">{message}</p>
                )}

                {linkTo && linkText && (
                    <Link to={linkTo} className="status-message__link">
                        {linkText}
                    </Link>
                )}
            </div>
        </div>
    );
}