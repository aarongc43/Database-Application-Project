import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Custom styled table cell using MUI's styled API
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

function ProductTable({ products }) {
    const theme = useTheme();

    return (
        <TableContainer component={Paper} sx={{ bgcolor: 'background.default', boxShadow: 2, borderRadius: 2, p: 2, maxWidth: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Product List
            </Typography>
            <Table aria-label="product table" stickyHeader>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main', '& th': { color: 'primary.contrastText', fontWeight: 'medium' } }}>
                        {['Product ID', 'Name', 'Price', 'Quantity', 'Description'].map((headCell) => (
                            <StyledTableCell key={headCell}>
                                {headCell}
                                {headCell === 'Description' && (
                                    <Tooltip title="Detailed information available">
                                        <IconButton size="small">
                                            <InfoIcon fontSize="inherit" sx={{ color: 'primary.contrastText' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <TableRow
                                key={product.ID}
                                sx={{
                                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                    '&:nth-of-type(even)': { bgcolor: 'background.paper' },
                                    '&:hover': { bgcolor: 'action.selected', cursor: 'pointer' },
                                    transition: 'background-color 0.3s',
                                }}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {product.productID}
                                </StyledTableCell>
                                <StyledTableCell>{product.productName}</StyledTableCell>
                                <StyledTableCell align="right">{product.price}</StyledTableCell>
                                <StyledTableCell align="right">{product.quantity}</StyledTableCell>
                                <StyledTableCell>{product.description}</StyledTableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <StyledTableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                No products found
                            </StyledTableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ProductTable;

