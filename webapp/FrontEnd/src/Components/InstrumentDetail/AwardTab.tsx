import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Award } from '../../Api/Model';

interface AwardTabProps {
    awards: Award[]
}

export function AwardsTab ({awards}: AwardTabProps) {
    return (
        <TableContainer style={{ maxHeight: '35vh' }}>
            <Table stickyHeader sx={{ minWidth: '35vw' }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="center"><Typography variant="subtitle2">Award number</Typography></TableCell>
                    <TableCell align="center"><Typography variant="subtitle2">Title</Typography></TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {awards.map((row) => (
                    <TableRow
                        hover
                        key={row?.awardNumber}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="center" component="th" scope="row">
                            <Typography variant="body2" gutterBottom component="div">{row?.awardNumber}</Typography>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                            <Typography variant="body2" gutterBottom component="div">{row?.title}</Typography>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}