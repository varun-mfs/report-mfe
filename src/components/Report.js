import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

const generateItems = amount => {
  const arr = Array.from(Array(amount))
  return arr.map((number, i) => ({
    id: i,
    name: `Name ${i + 1}`,
    type: `Item Type ${i + 1}`,
  }))
}

const TableWithInfiniteScroll = () => {
  const tableEl = useRef()
  const [rows, setRows] = useState(generateItems(50))
  const [loading, setLoading] = useState(false)
  const [distanceBottom, setDistanceBottom] = useState(0)
  // hasMore should come from the place where you do the data fetching
  // for example, it could be a prop passed from the parent component
  // or come from some store
  const [hasMore] = useState(true)
  const loadMore = useCallback(() => {
    const loadItems = async () => {
      await new Promise(resolve =>
        setTimeout(() => {
          const amount = rows.length + 50
          setRows(generateItems(amount))
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

  return (
    <TableContainer style={{ maxWidth: '650px', margin: 'auto', maxHeight: '700px' }} ref={tableEl}>
      {loading && <CircularProgress style={{ position: 'absolute', top: '45%', left: '45%' }} />}
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ id, name, type }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default TableWithInfiniteScroll;