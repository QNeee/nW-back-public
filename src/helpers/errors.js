class nW extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
class NotFound extends nW {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}
class BadRequest extends nW {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
class WrongParametersError extends nW {
    constructor(message) {
        super(message);
        this.status = 403;
    }
}
class NotAuthorized extends nW {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}
class RegistrationConflictError extends nW {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}
module.exports = {
    nW,
    BadRequest,
    WrongParametersError,
    NotAuthorized, RegistrationConflictError, NotFound
}