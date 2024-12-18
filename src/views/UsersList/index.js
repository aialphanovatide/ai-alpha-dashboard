import React, { useEffect, useState } from "react";
import config from "../../config";
import { formatDateTime } from "src/utils";
import styles from "./index.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SpinnerComponent from "src/components/Spinner";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useNavigate } from "react-router-dom";
import Title from "src/components/commons/Title";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rowNumber");
  const navigate = useNavigate();

  const handleOnRowClick = (user_id) => {
    navigate(`/userdetail/${user_id}`);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "X-Api-Key": config.X_API_KEY,
        },
      });

      const data = await response.json();
      if (data && data.data) {
        const preparedUsers = prepareUserData(data.data);
        updateUsersState(preparedUsers);
      } else {
        console.error("Error fetching users:", data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const prepareUserData = (data) => {
    return data.map((user, index) => {
      return {
        ...user,
        created_at: formatDateTime(user.created_at),
        rowNumber: index + 1,
        full_name: user.full_name ? user.full_name : "Not specified",
      };
    });
  };

  const removeDuplicateUsers = (users) => {
    return users.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.auth0id === user.auth0id),
    );
  };

  const updateUsersState = (userData) => {
    const uniqueUsers = removeDuplicateUsers(userData);
    setUsers(uniqueUsers);
    localStorage.setItem("usersData", JSON.stringify(uniqueUsers));
    localStorage.setItem("usersDataTimestamp", Date.now().toString());
    setLoading(false);
  };

  const checkCacheAndFetchUsers = () => {
    const storedUsers = localStorage.getItem("usersData");
    const timestamp = localStorage.getItem("usersDataTimestamp");
    const TEN_MINUTES = 10 * 60 * 1000;

    if (
      storedUsers &&
      timestamp &&
      Date.now() - parseInt(timestamp) < TEN_MINUTES
    ) {
      const cachedUsers = JSON.parse(storedUsers);
      setUsers(cachedUsers);
      setLoading(false);
    } else {
      fetchUsers();
    }
  };

  useEffect(() => {
    checkCacheAndFetchUsers();

    const interval = setInterval(
      () => {
        fetchUsers();
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortUsers = (usersArray) => {
    return usersArray.slice().sort((a, b) => {
      if (orderBy === "nickname") {
        return order === "asc"
          ? a.nickname.localeCompare(b.nickname)
          : b.nickname.localeCompare(a.nickname);
      } else if (orderBy === "rowNumber") {
        return order === "asc"
          ? a.rowNumber - b.rowNumber
          : b.rowNumber - a.rowNumber;
      } else if (orderBy === "created_at") {
        return order === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });
  };

  const sortedUsers = sortUsers(users);

  return (
    <>
      <Title>Users List</Title>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <>
          <TableContainer className={styles.tableContainer}>
            <Table aria-label="users table" className={styles.table} id="table">
              <TableHead>
                <TableRow className={styles.tableRow}>
                  <TableCell
                    sortDirection={orderBy === "rowNumber" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "rowNumber"}
                      direction={orderBy === "rowNumber" ? order : "asc"}
                      onClick={() => handleRequestSort("rowNumber")}
                    >
                      #
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell
                    sortDirection={orderBy === "nickname" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "nickname"}
                      direction={orderBy === "nickname" ? order : "asc"}
                      onClick={() => handleRequestSort("nickname")}
                    >
                      Nickname
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "created_at" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "created_at"}
                      direction={orderBy === "created_at" ? order : "asc"}
                      onClick={() => handleRequestSort("created_at")}
                    >
                      Created at
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    return (
                      <TableRow
                        className={styles.tableRow}
                        key={`row-${user.auth0id}`}
                        onClick={() => handleOnRowClick(user.user_id)}
                      >
                        <TableCell>{user.rowNumber}</TableCell>
                        <TableCell>{user.auth0id}</TableCell>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.nickname}</TableCell>
                        <TableCell>{user.created_at}</TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className={styles.tablePagination}
            id="table-pagination"
          />
        </>
      )}
    </>
  );
};

export default UsersList;
