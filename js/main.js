/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: William Seto Student ID: 116247172 Date: 2018-05-28
*
*
********************************************************************************/ 
let employeesModel = [] // This variable will contain an array of our employees

// FUNCTIONS ------------------------------------------------------------------

// Initializes the employeesModel. On success, refreshes the employees table by
// invoking refreshEmployeeRows().
function initializeEmployeesModel() {
    $.ajax({
        url: "https://teams-api.herokuapp.com/employees",
        type: "GET",
        contentType: "application/json"
    })
    .done(function(data) {
        employeesModel = _.cloneDeep(data)
        refreshEmployeeRows(employeesModel)
    })
    .fail(function(err) {
        showGenericModal("Error", "Unable to get Employees")
    })
}

// Displays a modal with employee information.
function showGenericModal(title, message) {
    $("h4.modal-title").html(title)
    $("div.modal-body").html(message)
    $("#genericModal").modal("show")
}

// Clears the employees in the employee table and populates it with the given
// list of employees.
function refreshEmployeeRows(employees) {
    let bodyRowsTemplate = _.template(
        '<% _.forEach(employees, function(employee) { %>' +
            '<div class="row body-row" data-id="<%- employee._id %>">' +

                '<div class="col-xs-4 body-column">' +
                '<%- employee.FirstName %></div>' +

                '<div class="col-xs-4 body-column">' +
                '<%- employee.LastName %></div>' +

                '<div class="col-xs-4 body-column">' +
                '<%- employee.Position.PositionName %></div>' +

            '</div>' +
        '<% }) %>'
    )
    let bodyRows = bodyRowsTemplate({'employees': employees})
    $("div#employees-table").empty().append(bodyRows)
}

// Returns an array of employees whose First Name, Last Name, or Position Name
// matches the provided filterString. The match is case insensitive.
function getFilteredEmployeesModel(filterString) {
    let filteredEmployees = _.filter(employeesModel, function(employee) {
        // Lambda function which returns true if str1 contains str2.
        let compareString = function(str1, str2) {
            return str1.toLowerCase().includes(str2.toLowerCase())
        }

        // do the comparisons
        let fName = compareString(employee.FirstName, filterString)
        let lName = compareString(employee.LastName, filterString)
        let pName = compareString(employee.Position.PositionName, filterString)

        return fName || lName || pName
    })

    return filteredEmployees
}

// Returns the employee object which matches the provided id. If not found,
// returns null.
function getEmployeeModelById(id) {
    let index = _.findIndex(employeesModel, function(employee) {
        return employee._id == id
    })
    return undefined ? null : _.cloneDeep(employeesModel[index])
}

// ----------------------------------------------------------------------------

$(document).ready(function() {
    // after the document loads, fill the employees table with all employees
    initializeEmployeesModel()

    // EVENTS -----------------------------------------------------------------

    // Whenever the user types anything in the employee search bar, filter the
    // employee table with whatever the employee search bar currently contains.
    $("input.form-control#employee-search").keyup(function() {
        let filteredEmployees = getFilteredEmployeesModel($(this).val())
        refreshEmployeeRows(filteredEmployees)
    })

    // When an employee row in the employee table is clicked, display a modal
    // with their first and last name as the title and address, phone number,
    // and hire date as the message.
    $(".body-rows").on("click", ".body-row", function() {
        let employee = getEmployeeModelById($(this).attr("data-id"))
        employee.HireDate = moment(employee.HireDate).format("LL")
        
        let messageTemplate = _.template (
            '<strong>Address: </strong>' +
            '<%- employee.AddressStreet %> <%- employee.AddressCity %>, ' +
            '<%- employee.AddressState %> <%- employee.AddressZip %><br>' +
            '<strong>Phone Number: </strong>' +
            '<%- employee.PhoneNum %> ext: <%- employee.Extension %><br>' +
            '<strong>Hire Date: </strong><%- employee.HireDate %>'
        )

        let title = employee.FirstName + " " + employee.LastName
        let message = messageTemplate({"employee": employee})
        showGenericModal(title, message)
    })

    // ------------------------------------------------------------------------
    
})