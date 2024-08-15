import React, { useEffect, useState } from "react";
import config from "../../config";
import { formatDateTime } from "src/utils";
import { DataGrid } from "@mui/x-data-grid";
import userImg from "src/assets/images/defaultUserImg.jpg";

const renderImg = (params) => {
  return (
    <img
      src={params.row.picture || userImg}
      style={{ height: 50, width: 50 }}
    />
  );
};

// Columns config
const columns = [
  { field: "rowNumber", headerName: "#", width: 20, sortable: false },
  { renderCell: renderImg, headerName: "Image", width: 70, sortable: false },
  { field: "auth0id", headerName: "ID", width: 280 },
  { field: "nickname", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 230 },
  { field: "created_at", headerName: "Created at", width: 180 },
];

const UsersList = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await response.json();
      if (data && data.data) {
        const prepareUserData = data.data.map((user, index) => ({
          ...user,
          created_at: formatDateTime(user.created_at),
          rowNumber: index + 1,
        }));

        setUsers(prepareUserData);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        getRowId={(row) => row.email}
      />
    </div>
  );
};

export default UsersList;