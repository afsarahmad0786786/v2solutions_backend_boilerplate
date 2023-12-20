const Employee = require('../model/Employee');
const moment = require('moment');
const status = require('../utils/constant');
const {
    addData,
    getData,
    updateData,
    deleteData,
    getDataById,
} = require('../utils/wrapper/collections');

const getEmployeesById = async (req, res) => {
    const data = await getDataById(Employee, req, res);
    res.status(status.success).json({ data });
};

const getEmployees = async (req, res) => {
    let { data, page, totalPages, totalRecords, sortedColumn, sortDirection } =
        await getData(Employee, req, res);

    res.status(status.success).json({
        data,
        page,
        totalPages,
        totalRecords,
        sortedColumn,
        sortDirection, // Include the sort direction in the response
    });
};

const addEmployees = async (req, res) => {
    const { newRecords } = await addData(Employee, req, res);
    res.status(status.success).json({
        message: 'Employee added successfully',
        newRecords,
    });
};

const updateEmployee = async (req, res) => {
    const { updatedList } = await updateData(Employee, req, res);
    res.status(status.success).json({
        message: 'Updated Successfully',
        updatedList,
    });
};

const deleteEmployee = async (req, res) => {
    const employeeId = req.params.id;
    await deleteData(Employee, req, res);
    res.status(status.success).json({
        message: `Employee deleted successfully for id - ${employeeId}`,
    });
};

module.exports = {
    getEmployees,
    addEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeesById,
};
