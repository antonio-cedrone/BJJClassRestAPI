/*
    Function that returns middleware which is used to set the dataFilter property 
    on the request that will be used for mongoose queries.
*/

module.exports = (dataFilters) => {
    return (req, res, next) => {  
        /* 
            The filters are stored in an array.
            If the data used to filter the query is not from the body 
            decode the URI (as it will be from params).
        */
        const dataFiltersObj = {};

        for (key in dataFilters) {
            let temp = req;

            const parts = dataFilters[key].split(".");
            parts.forEach(part => {temp = temp[part]});

            if (parts[0] !== "body") {
                dataFiltersObj[key] = decodeURI(temp);
            }
            else {
                dataFiltersObj[key] = temp;
            }
        }

        req.dataFilter = dataFiltersObj;

        next();
    }
};