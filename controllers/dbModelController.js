class Controller {
    constructor(element) {
        this.element = element
    }

    getAll = async (req, res, next) => {  
        try {  
            this.handleGetResponse(await this.element.find(req.dataFilter).exec(), req, next);
        }
        catch (err) {
            next(err);
        }
    }

    getOne = async (req, res, next) => {
        try {
            this.handleGetResponse(await this.element.findOne(req.dataFilter).exec(), req, next);
        }
        catch (err) {
            next(err);
        }
    }

    handleGetResponse = (elements, req, next) => {
        /* 
            Element.findOne returns null if it finds nothing (handled by !elements).
            Element.find returns empty list if it finds nothing (handled by elements.length === 0).
            Both cases are handled the same way (with a 404 error).
        */
        if (!elements || elements.length === 0) {
            const error = new Error(`No ${this.element.modelName} data found`);
            error.status = 404;
            throw error;
        }

        /*
            As there is a populated elements object the query is confirmed to be 
            successful and the JSON data is added to the request object.
        */
        req.intermediateBody = elements;
        req.intermediateStatus = 200;
        next();
    }

    addElement = async (req, res, next) => {
        /*
            Try to create a document in the database using the response body which is assumed to have has been validated 
            against the schema (except for unique constraints).
        */
        try{
            const result = await this.element.create(new this.element(req.body));

            req.intermediateBody = result;
            req.intermediateStatus = 201;
            next();
        }
        catch (err) {
            /*
                Handle the 11000 MongoServerError, which is thrown when the unique constraint is violated, differently from other
                errors. This is the case as the returned message is poor and because it would be incorrect to default to a 500 
                error code as would be done otherwise.
            */
            if (err.name === 'MongoServerError' && err.code === 11000) {
                const error = new Error(`Unique ${this.element.modelName} ${Object.keys(err.keyValue)} is required`);
                error.status = 409;
                return next(error);
            } 
            
            next(err);
        }
    }

    updateElement = async (req, res, next) => {
        try {
            // Try to update a single element which matches the req.dataFilter.
            const result = await this.element.updateOne(req.dataFilter, req.body).exec();

            // Confirm that the write result was acknowledged.
            if (!result.acknowledged) {
                const error = new Error(`Failed to update ${this.element.modelName}`);
                throw error;
            }

            // Confirm that the req.dataFilter matched something and thus that the req.dataFiltered resource exists.
            if (result.matchedCount === 0) {
                const error = new Error(`No such ${this.element.modelName} exists`);
                error.status = 404;
                throw error;
            }
            else if (result.modifiedCount === 0){
                req.intermediateBody = {"message": "No changes made"};
                req.intermediateStatus = 200;
                next();
            }
            else {
                req.intermediateStatus = 204;
                next();
            }
        } 
        catch (err) {
            /*
                Handle the 11000 MongoServerError, which is thrown when the unique constraint is violated, differently from other
                errors. This is the case as the returned message is poor and because it would be incorrect to default to a 500 
                error code as would be done in this case.
            */
            if (err.name === 'MongoServerError' && err.code === 11000) {
                const error = new Error(`Unique ${this.element.modelName} ${Object.keys(err.keyValue)} is required`);
                error.status = 409;
                return next(error);
            } 
            
            next(err);
        }
    }
    
    deleteElement = async (req, res, next) => {
        try {
            // Try to delete a single element which matches the req.dataFilter.
            const result = await this.element.deleteOne(req.dataFilter).exec();

            // Confirm that the write result was acknowledged.
            if (!result.acknowledged) {
                const error = new Error(`Failed to delete ${this.element.modelName}`);
                throw error;
            }

            // Confirm that the req.dataFilter matched something and thus that the req.dataFiltered resource existed.
            if (result.deletedCount === 0) {
                const error = new Error(`No such ${this.element.modelName} exists`);
                error.status = 404;
                throw error;
            }
            
            req.intermediateStatus = 204;
            next();
        } 
        catch (err) {
            next(err);
        }
    }
}

module.exports = Controller