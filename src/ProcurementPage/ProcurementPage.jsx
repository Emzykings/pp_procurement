import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Button, message } from "antd";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import useLogout from "../components/logout/Logout";
import { LogoutOutlined } from "@ant-design/icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const columns = [
  { id: "product", label: "Product Name", minWidth: 170 },
  { id: "quantity", label: "Quantity", minWidth: 100, align: "center" },
  {
    id: "selling_price",
    label: "Selling Price",
    minWidth: 170,
    align: "right",
  },
  { id: "created_at", label: "Date", minWidth: 100, align: "center" },
  { id: "action", label: "Action", minWidth: 170, align: "right" },
  // { id: "uploaded", label: "Updated", minWidth: 100, align: "center" },
];

export default function ProcurementPage() {
  const [modalId, setModalId] = React.useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = (id) => {
    console.log(id);
    setOpen(true);
    setModalId(id);
  };
  const handleClose = () => setOpen(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [quantityBought, setQuantityBought] = useState("");
  const [costPrice, setCostPrice] = useState("");

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(false);
  const { logout, isLoggingOut } = useLogout();

  const handleUpdateOrder = async () => {
    if (!quantityBought || !costPrice) {
      message.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const storedData = localStorage.getItem("userData");
      if (!storedData) {
        throw new Error("User data not found in localStorage");
      }
      const { token } = JSON.parse(storedData);
      const response = await fetch(
        `https://spiritual-anglerfish-sodbridge.koyeb.app/api/orders/update/${modalId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            id: modalId,
            quantity_bought: quantityBought,
            cost_price: costPrice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrders = orders.map((order) => {
        if (order.id === modalId) {
          return { ...order, uploaded: true };
        }
        return order;
      });

      setOrders(updatedOrders);
      setCostPrice("");
      setQuantityBought("");
      setOpen(false);
      message.success("Updated successfully");

      localStorage.setItem("orders", JSON.stringify(updatedOrders));
    } catch (error) {
      message.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const storedOrders = localStorage.getItem("orders");
        // if (storedOrders) {
        //   setOrders(JSON.parse(storedOrders));
        //   setOpen(false);
        // } else {
        const storedData = localStorage.getItem("userData");
        if (!storedData) {
          throw new Error("User data not found in localStorage");
        }
        const { token } = JSON.parse(storedData);

        const response = await fetch(
          "https://spiritual-anglerfish-sodbridge.koyeb.app/api/orders/my-orders/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
        setOpen(false);

        // localStorage.setItem("orders", JSON.stringify(data));
        // }
      } catch (error) {
        message.error(error);
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredOrders = orders?.filter((order) => {
    const orderDate = order?.created_at?.substring(0, 10);
    console.log(orderDate);
    return orderDate === selectedDate;
  });

  console.log(filteredOrders);

  const storeduserName = localStorage.getItem("username");
  const handleLogout = () => {
    const storeduserName = localStorage.getItem("username");
    logout(storeduserName);
  };

  const determineBatch = (createdAt) => {
    const hours = parseInt(createdAt.split(":")[0]);
    if (hours >= 16 && hours < 22) {
      return "Batch A";
    } else if (hours >= 0 && hours < 5) {
      return "Batch B";
    } else if (hours >= 6 && hours < 14) {
      return "Batch C";
    } else {
      return "Unknown Batch";
    }
  };

  return (
    <div
      style={{
        maxWidth: "90vw",
        margin: "0 auto",
      }}
    >
      <div className="orders pt-5">
        <h1>Welcome {storeduserName}</h1>
        <div className="flex justify-between">
          <h1
            style={{
              fontSize: "30px",
            }}
          >
            Your Orders
          </h1>
          <Button onClick={handleLogout} icon={<LogoutOutlined />}>
            Logout
          </Button>
        </div>
      </div>
      <div className="flex gap-5 flex-wrap border items-end p-4 min-h-[90px] bg-white">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label className="text-[12px] ml-1"> select date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border h-10 px-2"
            />
          </div>
        </div>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ height: "60vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                backgroundColor: "green",
              }}
            >
              <TableRow
                sx={{
                  backgroundColor: "green",
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    sx={{
                      backgroundColor: "#f5b622",
                    }}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {filteredOrders?.length < 1 ? (
              <div className="text-[50px] border w-[100%] h-[100%] my-[20%] mx-[40%] flex justify-center items-center font-bold">
                NO DATA TODAY 😑!!!
              </div>
            ) : (
              <TableBody>
                {filteredOrders
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns?.map((column) => {
                          const value =
                            column.id === "action" ? (
                              <Button onClick={() => handleOpen(row.id)}>
                                <MoreVertIcon />
                              </Button>
                            ) : // column.id === "uploaded" ? (
                            //   // <span>{row.uploaded ? "✔️" : "❌"}</span>
                            // ) :
                            column.id === "created_at" ? (
                              <span>
                                {row.created_at}{" "}
                                {determineBatch(row.created_at.split(" ")[1])}
                              </span>
                            ) : (
                              row[column.id]
                            );
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex-1">
            <TextField
              id="outlined-textarea"
              label="Quantity Bought"
              placeholder="Placeholder"
              multiline
              value={quantityBought}
              onChange={(e) => setQuantityBought(e.target.value)}
              sx={{
                width: "100%",
                marginBottom: "20px",
              }}
            />
            <TextField
              id="outlined-textarea"
              label="Cost Price"
              placeholder="Placeholder"
              multiline
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              sx={{
                width: "100%",
                marginBottom: "20px",
              }}
            />
          </div>

          <div className="flex justify-end">
            {loading ? (
              <Button
                variant="contained"
                sx={{
                  height: "40px",
                  backgroundColor: "#f5b622",
                }}
              >
                Loading...
              </Button>
            ) : (
              <Button
                onClick={() => handleUpdateOrder()}
                variant="contained"
                sx={{
                  height: "40px",
                  backgroundColor: "#f5b622",
                }}
              >
                Send
              </Button>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
