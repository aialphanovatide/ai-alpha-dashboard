import React, { useEffect, useState } from "react";
import config from "../../config";
import { formatDateTime } from "src/utils";
import DataTable from "src/components/DataTable";
import SpinnerComponent from "src/components/Spinner";
// import userImg from "src/assets/images/defaultUserImg.jpg";

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
  const [isLoading, setLoading] = useState(true);

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

        localStorage.setItem("usersData", JSON.stringify(prepareUserData));
        localStorage.setItem("usersDataTimestamp", Date.now().toString());

        setLoading(false);
        setUsers(prepareUserData);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem("usersData");
    const timestamp = localStorage.getItem("usersDataTimestamp");
    const TEN_MINUTES = 10 * 60 * 1000;

    if (
      storedUsers &&
      timestamp &&
      Date.now() - parseInt(timestamp) < TEN_MINUTES
    ) {
      setUsers(JSON.parse(storedUsers));
      setLoading(false);
    } else {
      getUsers();
    }

    // Set interval to fetch data every 10'
    const interval = setInterval(() => {
      getUsers();
    }, TEN_MINUTES);

    // Clean interval when component is dismounted
    return () => clearInterval(interval);
  }, []);

  return isLoading ? (
    <SpinnerComponent />
  ) : (
    <DataTable
      data={users}
      columns={columns}
      pageSizeOptions={false}
      customRowId={(row) => row.auth0id}
      disableRowSelectionOnClick
    />
  );
};

export default UsersList;