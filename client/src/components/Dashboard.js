import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  // Table configuration: columns and rows
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // States for dynamic column addition
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");

  // State for new row input data (for adding new row)
  const [newRow, setNewRow] = useState({});

  // State for editing an existing row
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingRowData, setEditingRowData] = useState({});

  // Load saved table configuration and rows from localStorage on mount
  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem("tableColumns"));
    const savedRows = JSON.parse(localStorage.getItem("tableRows"));
    if (savedColumns) setColumns(savedColumns);
    if (savedRows) setRows(savedRows);
  }, []);

  // Persist configuration changes
  useEffect(() => {
    localStorage.setItem("tableColumns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("tableRows", JSON.stringify(rows));
  }, [rows]);

  // Handler to add a new column and update existing rows
  const handleAddColumn = (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    const newCol = { name: newColumnName, type: newColumnType };
    setColumns([...columns, newCol]);
    // Update each existing row to include the new column with an empty value if missing
    const updatedRows = rows.map((row) => ({
      ...row,
      [newColumnName]: row[newColumnName] || "",
    }));
    setRows(updatedRows);
    setNewColumnName("");
    setNewColumnType("text");
  };

  // Handler to add a new row to the table
  const handleAddRow = (e) => {
    e.preventDefault();
    // Create a complete row ensuring every column has a key
    const completeRow = {};
    columns.forEach((col) => {
      completeRow[col.name] = newRow[col.name] || "";
    });
    setRows([...rows, completeRow]);
    setNewRow({});
  };

  // Handler to begin editing an existing row
  const handleEdit = (row, index) => {
    setEditingRowIndex(index);
    setEditingRowData({ ...row });
  };

  // Handler to update editing row data on input change
  const handleEditChange = (colName, value) => {
    setEditingRowData({ ...editingRowData, [colName]: value });
  };

  // Handler to save the edited row
  const handleSaveEdit = () => {
    const updatedRows = rows.map((row, index) =>
      index === editingRowIndex ? editingRowData : row
    );
    setRows(updatedRows);
    setEditingRowIndex(null);
    setEditingRowData({});
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    setEditingRowData({});
  };

  // Logout functionality (clears token and reloads page)
  const logoutHandler = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Update new row data based on user input (for the add-new-row inputs)
  const handleRowInputChange = (colName, value) => {
    setNewRow({ ...newRow, [colName]: value });
  };

  return (
    <Card
      className="p-4 mx-auto my-5"
      style={{
        background:
          "linear-gradient(135deg, rgb(0, 0, 0), rgba(143, 143, 148, 0.59))",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        color: "#9f9f9f",
      }}
    >
      <Card.Body>
        <h3 className="mb-4" style={{ fontWeight: "bold" }}>
          Dashboard
        </h3>

        {/* Table Section */}
        {columns.length > 0 ? (
          <>
            <Table bordered variant="dark" className="mb-4">
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx}>{col.name}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {editingRowIndex === rowIndex ? (
                          col.type === "date" ? (
                            <DatePicker
                              selected={
                                editingRowData[col.name]
                                  ? new Date(editingRowData[col.name])
                                  : null
                              }
                              onChange={(date) =>
                                handleEditChange(
                                  col.name,
                                  date ? date.toISOString().split("T")[0] : ""
                                )
                              }
                              placeholderText="Select date"
                              className="form-control"
                              style={{
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              value={editingRowData[col.name] || ""}
                              onChange={(e) =>
                                handleEditChange(col.name, e.target.value)
                              }
                              className="form-control"
                              style={{
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                              }}
                            />
                          )
                        ) : (
                          row[col.name]
                        )}
                      </td>
                    ))}
                    <td>
                      {editingRowIndex === rowIndex ? (
                        <>
                          <Button
                            onClick={handleSaveEdit}
                            style={{
                              borderRadius: "5px",
                              fontWeight: "bold",
                              color: "#9f9f9f",
                              background: "black",
                              border: "none",
                              padding: "5px 10px",
                              marginRight: "5px",
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            style={{
                              borderRadius: "5px",
                              fontWeight: "bold",
                              color: "#9f9f9f",
                              background: "gray",
                              border: "none",
                              padding: "5px 10px",
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEdit(row, rowIndex)}
                          style={{
                            borderRadius: "5px",
                            fontWeight: "bold",
                            color: "#9f9f9f",
                            background: "black",
                            border: "none",
                            padding: "5px 10px",
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {/* New row input */}
                <tr>
                  {columns.map((col, idx) => (
                    <td key={idx}>
                      {col.type === "date" ? (
                        <DatePicker
                          selected={
                            newRow[col.name] ? new Date(newRow[col.name]) : null
                          }
                          onChange={(date) =>
                            handleRowInputChange(
                              col.name,
                              date ? date.toISOString().split("T")[0] : ""
                            )
                          }
                          placeholderText="Select date"
                          className="form-control"
                          style={{
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={`Enter ${col.name}`}
                          value={newRow[col.name] || ""}
                          onChange={(e) =>
                            handleRowInputChange(col.name, e.target.value)
                          }
                          className="form-control"
                          style={{
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    </td>
                  ))}
                  <td>
                    <Button
                      onClick={handleAddRow}
                      style={{
                        borderRadius: "5px",
                        fontWeight: "bold",
                        color: "#9f9f9f",
                        background: "black",
                        border: "none",
                        padding: "5px 10px",
                      }}
                    >
                      Add Row
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </>
        ) : (
          <p>No table created yet. Please add columns.</p>
        )}

        {/* Dynamic Column Addition */}
        <h4 className="mb-3" style={{ fontWeight: "bold" }}>
          Add Dynamic Column
        </h4>
        <Form onSubmit={handleAddColumn} className="d-flex flex-column">
          <Form.Group className="mb-3 text-left">
            <Form.Label style={{ fontWeight: "500" }}>
              Column Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              required
              style={{
                borderRadius: "5px",
                border: "1px solid #ccc",
                background: "white",
                color: "black",
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3 text-left">
            <Form.Label style={{ fontWeight: "500" }}>
              Column Type
            </Form.Label>
            <Form.Control
              as="select"
              value={newColumnType}
              onChange={(e) => setNewColumnType(e.target.value)}
              style={{
                borderRadius: "5px",
                border: "1px solid #ccc",
                background: "white",
                color: "black",
              }}
            >
              <option value="text">Text</option>
              <option value="date">Date</option>
            </Form.Control>
          </Form.Group>
          <Button
            type="submit"
            style={{
              borderRadius: "5px",
              fontWeight: "bold",
              color: "#9f9f9f",
              background: "black",
              border: "none",
              padding: "10px",
            }}
          >
            Add Column
          </Button>
        </Form>
      </Card.Body>
      <Button
        onClick={logoutHandler}
        style={{
          borderRadius: "5px",
          fontWeight: "bold",
          color: "#9f9f9f",
          background: "black",
          border: "none",
          padding: "10px",
          margin: "10px",
        }}
      >
        Logout
      </Button>
    </Card>
  );
};

export default Dashboard;
