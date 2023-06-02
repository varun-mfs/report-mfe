import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, Link } from "@mui/material";
import generatePDF from "../utils/generate-pdf";

const TableWithInfiniteScroll = () => {
  const tableEl = useRef();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const ref = React.createRef();
  // hasMore should come from the place where you do the data fetching
  // for example, it could be a prop passed from the parent component
  // or come from some store
  const [hasMore] = useState(true);
  const loadMore = useCallback(async () => {
    const loadItems = async () => {
      await getReportingData(setPage(page + 1));
      setLoading(false);
    };
    setLoading(true);
    loadItems();
  }, [rows]);

  const scrollListener = useCallback(async () => {
    let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }
    if (
      tableEl.current.scrollTop > bottom - distanceBottom &&
      hasMore &&
      !loading
    ) {
      await loadMore();
    }
  }, [hasMore, loadMore, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef.addEventListener("scroll", scrollListener);
    return () => {
      tableRef.removeEventListener("scroll", scrollListener);
    };
  }, [scrollListener]);

  async function getReportingData() {
    try {
      // TODO: uncomment this line
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // mode: 'no-cors',   // to handle CORS error
        body: JSON.stringify({ page }),
      };
      const apiUrl = "http://report-service.localhost/getReportingData";
      const response = await fetch(apiUrl, requestOptions);
      let data = await response.json();
      setRows([...rows, ...data.data]);
    } catch (error) {
      console.log("something went wrong while fetching data!", error);
    }
  }
  useEffect(() => {
    getReportingData();
  }, []);

  const handleButtonClick = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    const apiUrl = "http://report-service.localhost/getReportingData";
    const response = await fetch(apiUrl, requestOptions);
    let data = await response.json();
    generatePDF(data.data);
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ float: "right" }}
        onClick={handleButtonClick}
        disableElevation
      >
        Download as PDF
      </Button>
      <TableContainer
        style={{ maxWidth: "100%", margin: "auto", maxHeight: "700px" }}
        ref={tableEl}
      >
        {loading && (
          <CircularProgress
            style={{ position: "absolute", top: "45%", left: "45%" }}
          />
        )}
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Agency Name</TableCell>
              <TableCell>Title</TableCell>
              {/* <TableCell>Link</TableCell> */}
              <TableCell>Click Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ _id, title, url, clickCount, agencyId }, index) => (
              <TableRow
                component={Link}
                to={url}
                href={url}
                target="_blank"
                hover
                key={index}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <TableCell>{agencyId?.name}</TableCell>
                <TableCell>{title}</TableCell>
                {/* <TableCell><a href={url} target='_blank'>read</a></TableCell> */}
                <TableCell>{clickCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default TableWithInfiniteScroll;
