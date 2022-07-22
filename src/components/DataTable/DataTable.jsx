// @mui/x-data-grid
import { DataGrid } from "@mui/x-data-grid";

// prop types
import PropTypes from "prop-types";

const DataTable = (props) => {
  const { columns, rows } = props;
  return (
    <div style={{ height: "527px", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        disableSelectionOnClick
      />
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
};

export default DataTable;
