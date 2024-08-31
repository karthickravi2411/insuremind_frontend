import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
} from '@mui/material';

const AggregatedPolicy = () => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAggregatedData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/aggregatedPolicies`);
        setAggregatedData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching aggregated data', error);
      }
    };

    fetchAggregatedData();
  }, [aggregatedData]);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filtered = aggregatedData.filter((user) =>
        user.user.firstName.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(aggregatedData);
    }

    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(aggregatedData);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ margin: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search by First Name"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>
      <h2>Aggregated Policy Data</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Policy Category</TableCell>
              <TableCell>Policy Number</TableCell>
              <TableCell>Policy Type</TableCell>
              <TableCell>Policy Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((user, userIndex) => (
                <React.Fragment key={user.username}>
                  {user.policies.map((policy, index) => (
                    <TableRow key={policy._id}>
                      {index === 0 && (
                        <>
                          <TableCell rowSpan={user.policies.length}>
                            {indexOfFirstItem + userIndex + 1}
                          </TableCell>
                          <TableCell rowSpan={user.policies.length}>
                            {user.user.firstName}
                          </TableCell>
                          <TableCell rowSpan={user.policies.length}>
                            {user.user.email}
                          </TableCell>
                          <TableCell rowSpan={user.policies.length}>
                            {user.user.phoneNumber}
                          </TableCell>
                          <TableCell rowSpan={user.policies.length}>
                            {policy.policyCarrier.companyName}
                          </TableCell>
                        </>
                      )}
                      <TableCell>{policy.policyCategory.categoryName}</TableCell>
                      <TableCell>{policy.policyNumber}</TableCell>
                      <TableCell>{policy.policyType}</TableCell>
                      <TableCell>{policy.premiumAmount}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <Typography variant="h6" color="textSecondary">
                      No data available
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AggregatedPolicy;
