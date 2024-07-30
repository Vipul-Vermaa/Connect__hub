class ErrorHandler extends Error{
    public statusCode:number
    constructor(message:string,statusCode:number){
        super(message)
        this.statusCode=statusCode

        Object.setPrototypeOf(this,ErrorHandler.prototype)
    }
}

export default ErrorHandler