import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./index.css";

const DataTable = (params) => {
  // DataTable config
  const {
    data,
    columns,
    pageSize = 10,
    pageSizeOptions = [5, 10],
    customRowId,
    disableRowSelectionOnClick,
  } = params;

  return (
    <div className="table-container">
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        getRowId={customRowId}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        className="table"
      />
    </div>
  );
};

export default DataTable;