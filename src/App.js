import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Reporting from "./components/Reporting";
import ReportingWithInfiniteScroll from "./components/Report";
import Box from "@mui/material/Box";

import "./index.css";
import Typography from "@mui/material/Typography";

const App = () => {
  return (
    <Box
      sx={{
        maxWidth: "75%",
        marginTop: "6rem",
        marginLeft: "4rem",
      }}
    >
      <Typography variant="h4">Reporting</Typography>
      <ReportingWithInfiniteScroll />
    </Box>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById("app"));
