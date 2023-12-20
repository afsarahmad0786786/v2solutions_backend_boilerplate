const status = require('../../utils/constant');

const addData = async (schemaName, req, res) => {
    try {
        let { email, name, dob, designation, education } = req.body;
        console.log(name);
        if (!email || !name || !dob || !designation || !education) {
            return res.status(status.unprocess).json({
                error: 'Please provide all the details to add new employee',
            });
        }
        const user = await schemaName.findOne({ email });
        if (user) {
            return res
                .status(status.unprocess)
                .json({ error: 'Email is already in used.' });
        }

        const newRecords = new schemaName(req.body);

        await newRecords.save();

        return { newRecords };
    } catch (error) {
        console.error('Error creating a new employee:', error);
        res.status(status.internal_server).json({
            error: 'Failed to create a new employee',
        });
    }
};

const getData = async (schemaName, req, res) => {
    try {
        let { page, limit, sort, filter, sortedColumn } = req.query;
        if (!page && !limit) {
            const data = await schemaName.find();
            console.log('inside get' + data);
            return res.status(status.success).json(data);
        }
        page = parseInt(page);
        limit = parseInt(limit);
        let offset = ((page - 1) * limit)
        let query = {};
        let sortOption = {};

        // Implement the filter based on the 'filter' query parameter
        if (filter) {
            query.name = { $regex: new RegExp(filter, 'i') };
            offset = 0
            // You can extend this based on your specific filter criteria
        }

        if (!sortedColumn) {
            sortedColumn = 'name'; // Default column to sort
        }

        let sortDirection = 1; // Default sort direction (ascending)

        if (sort) {
            // sortedColumn = sort.replace(/^-/, ''); // Remove '-' from the column name
            sortDirection = sort == 'desc' ? -1 : 1;
        }

        sortOption[sortedColumn] = sortDirection;

        console.log(sortOption);

        const totalRecords = await schemaName.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / limit);

        data = await schemaName
            .find(query)
            .collation({locale: "en" })
            .sort(sortOption)
            .limit(limit)
            .skip(offset);

        const result = {
            data,
            page,
            totalPages,
            totalRecords,
            sortedColumn,
            sortDirection, // Include the sort direction in the response
        };
        return result;
    } catch (error) {
        console.error('Error fetching employees :', error);
        res.status(status.internal_server).json({
            error: 'Failed to fetch employees ',
        });
    }
};

const updateData = async (schemaName, req, res) => {
    try {
        const employeeId = req.params.id;
        const updatedData = req.body;
        const updatedList = await schemaName.findByIdAndUpdate(
            employeeId,
            updatedData,
            {
                new: true,
            }
        );
        if (updatedList) {
            return updatedList;
        } else {
            res.status(status.internal_server).json({
                error: 'Employee not found',
            });
        }
    } catch (error) {
        res.status(status.internal_server).json({
            message: 'Something went Wrong',
        });
    }
};

const deleteData = async (schemaName, req, res) => {
    try {
        const employeeId = req.params.id;
        const result = await schemaName.findByIdAndDelete(employeeId);
        if (result) {
            return result;
        } else {
            res.status(status.internal_server).json({
                error: 'Employee not found',
            });
        }
    } catch (error) {
        console.error('Error deleting a employee:', error);
        res.status(status.internal_server).json({
            error: 'Failed to delete a employee',
        });
    }
};

const getDataById = async (schemaName, req, res) => {
    try {
        const employeeId = req.params.id;
        const data = await schemaName.findById(employeeId);
        console.log(data);
        if (!data) {
            res.status(status.unprocess).json({ error: 'Id not found' });
        }
        return data;
    } catch (err) {
        console.error(`Error fetching data :`, err);
        return res.status(status.internal_server).json({
            error: `Failed to fetch data`,
        });
    }
};

module.exports = {
    addData,
    getData,
    updateData,
    deleteData,
    getDataById,
};
