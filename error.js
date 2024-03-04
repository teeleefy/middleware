class MyError extends Error {
    constructor(msg, statusCode){
        super();
        this.msg = msg;
        this.status = statusCode;
        console.error(this.stack);
    }
}

module.exports = MyError;