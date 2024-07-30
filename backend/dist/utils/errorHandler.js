class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ErrorHandler.prototype);
    }
}
export default ErrorHandler;
