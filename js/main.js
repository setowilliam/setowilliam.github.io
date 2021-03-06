let employeesModel = [];
function initializeEmployeesModel() {
    $.ajax({
        url: "https://teams-api.herokuapp.com/employees",
        type: "GET",
        contentType: "application/json"
    }).done(function(e) {
        refreshEmployeeRows(employeesModel = _.cloneDeep(e))
    }).fail(function(e) {
        showGenericModal("Error", "Unable to get Employees")
    })
}
function showGenericModal(e, o) {
    $("h4.modal-title").html(e),
    $("div.modal-body").html(o),
    $("#genericModal").modal("show")
}
function refreshEmployeeRows(e) {
    let o = _.template('<% _.forEach(employees, function(employee) { %><div class="row body-row" data-id="<%- employee._id %>"><div class="col-xs-4 body-column"><%- employee.FirstName %></div><div class="col-xs-4 body-column"><%- employee.LastName %></div><div class="col-xs-4 body-column"><%- employee.Position.PositionName %></div></div><% }) %>')({
        employees: e
    });
    $("div#employees-table").empty().append(o)
}
function getFilteredEmployeesModel(e) {
    return _.filter(employeesModel, function(o) {
        let t = function(e, o) {
            return e.toLowerCase().includes(o.toLowerCase())
        }
          , l = t(o.FirstName, e)
          , n = t(o.LastName, e)
          , i = t(o.Position.PositionName, e);
        return l || n || i
    })
}
function getEmployeeModelById(e) {
    let o = _.findIndex(employeesModel, function(o) {
        return o._id == e
    });
    return _.cloneDeep(employeesModel[o])
}
$(document).ready(function() {
    initializeEmployeesModel(),
    $("input.form-control#employee-search").keyup(function() {
        refreshEmployeeRows(getFilteredEmployeesModel($(this).val()))
    }),
    $(".body-rows").on("click", ".body-row", function() {
        let e = getEmployeeModelById($(this).attr("data-id"));
        e.HireDate = moment(e.HireDate).format("LL");
        let o = _.template("<strong>Address: </strong><%- employee.AddressStreet %> <%- employee.AddressCity %>, <%- employee.AddressState %> <%- employee.AddressZip %><br><strong>Phone Number: </strong><%- employee.PhoneNum %> ext: <%- employee.Extension %><br><strong>Hire Date: </strong><%- employee.HireDate %>");
        showGenericModal(e.FirstName + " " + e.LastName, o({
            employee: e
        }))
    })
});