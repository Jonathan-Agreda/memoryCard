export const Card = ({ children, className, onClick }) => {
    return (
        <div
            className={`card ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const CardContent = ({ children, className }) => {
    return <div className={`card-content ${className}`}>{children}</div>;
};
