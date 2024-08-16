import React, { useEffect, useState } from "react";
import config from "../../config";
import { formatDateTime } from "src/utils";
import DataTable from "src/components/DataTable";
// import userImg from "src/assets/images/defaultUserImg.jpg";
import { useNavigate } from 'react-router-dom'

// Columns config
const columns = [
  { field: "rowNumber", headerName: "#", width: 20 },
  // { renderCell: renderImg, headerName: "Image", width: 70, sortable: false },
  { field: "auth0id", headerName: "ID", width: 280 },
  { field: "full_name", headerName: "Full Name", width: 150 },
  { field: "nickname", headerName: "Nickname", width: 150 },
  { field: "email", headerName: "Email", width: 230 },
  { field: "created_at", headerName: "Created at", width: 180 },
];

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  const handleOnRowClick = (params) => {
    navigate(`/userdetail/${params.row.user_id}`)
  }

  // const renderImg = (params) => {
  //   return (
  //     <img
  //       src={params.row.picture || userImg}
  //       style={{ height: 50, width: 50 }}
  //     />
  //   );
  // };

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
    <DataTable
      data={users}
      columns={columns}
      pageSizeOptions={false}
      customRowId={(row) => row.auth0id}
      disableRowSelectionOnClick
      onRowClick={handleOnRowClick}
    />
  );
};

export default UsersList;