export const errorHandler = (statusCode, userID, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    error.userID = userID;
    return error
}