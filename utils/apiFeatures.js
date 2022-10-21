class APIFeatures{
    constructor(query, queryString){
        this.query = query; // query = promise from mongodb
        this.queryString = queryString; //req.query
    }

    // 1) Filter
    filter() {
        // 1) Copy query parameters
        const queryObj = {...this.queryString};
        // 2) List Fields to exclude to the query parameters
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        // 3) Remove fields from the query parameters
        excludeFields.forEach((field) => delete queryObj[field]);

        // 1.B) Advanced  filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    // 2) Sort
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-quantity');
        }

        return this;
    } 

    // 3) Fields
    limitFields(){
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    // 4) Pagination
    paginate(){
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 20;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
} 

module.exports = APIFeatures;