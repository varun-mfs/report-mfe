import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from '@material-ui/core';
import * as Constants from '../utils/constants';

// TODO: remove this line
import HardCodedData from './Data';

const TableWithInfiniteScroll = () => {
  const tableEl = useRef()
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const [distanceBottom, setDistanceBottom] = useState(0);
  // hasMore should come from the place where you do the data fetching
  // for example, it could be a prop passed from the parent component
  // or come from some store
  const [hasMore] = useState(true)
  const loadMore = useCallback(() => {
    const loadItems = async () => {
      await new Promise(resolve =>
        setTimeout(() => {
          getReportingData(setPage(page + 1));
          setLoading(false)
          resolve()
        }, 2000)
      )
    }
    setLoading(true)
    loadItems()
  }, [rows])

  const scrollListener = useCallback(() => {
    let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2))
    }
    if (tableEl.current.scrollTop > bottom - distanceBottom && hasMore && !loading) {
      loadMore()
    }
  }, [hasMore, loadMore, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current
    tableRef.addEventListener('scroll', scrollListener)
    return () => {
      tableRef.removeEventListener('scroll', scrollListener)
    }
  }, [scrollListener]);

  async function getReportingData() {
    try {
      // TODO: uncomment this line
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // mode: 'no-cors',   // to handle CORS error
        body: JSON.stringify({ page })
      };
      console.log("check in useEffect");
      const apiUrl = `${Constants.BASE_URL}/getReportingData`;
      // const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
      const response = await fetch(apiUrl, requestOptions);
      let data = await response.json();
      console.log("data is: ", data);
      setRows([...rows ,...data.data]);
      // setRows(HardCodedData);   // TODO: remove this line

    } catch (error) {
      console.log("something went wrong while fetching data!", error);
    }
  }
  useEffect(() => {
    getReportingData();
  }, []);

  return (
    <TableContainer style={{ maxWidth: '100%', margin: 'auto', maxHeight: '700px' }} ref={tableEl}>
      {loading && <CircularProgress style={{ position: 'absolute', top: '45%', left: '45%' }} />}
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Agency Name</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ _id, title, url, clickCount, agencyId }) => (
              <TableRow
                component={Link}
                to={url}
                href={url}
                target="_blank"
                hover
                key={_id}
                // onClick={
                //   (event) => handleClick(event, url)
                //   // () => {
                //   // setClickedLink(url); console.log("clickedLink AFTER", clickedLink);
                //   // }
                // }
                style={{textDecoration: "none", cursor: "pointer"}}
                >
                <TableCell>{agencyId.name}</TableCell>
                <TableCell>{title}</TableCell>
                <TableCell><a href={url} target='_blank'>read</a></TableCell>
                <TableCell>{clickCount}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default TableWithInfiniteScroll;