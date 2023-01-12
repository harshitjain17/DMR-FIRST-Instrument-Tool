import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Publication } from '../../Api/Model';

interface PublicationTabProps {
    publications: Publication[]
}

export function PublicationsTab({ publications }: PublicationTabProps) {
    return (
        <TableContainer style={{ maxHeight: '35vh' }}>
            <Table stickyHeader sx={{ minWidth: '35vw' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><Typography variant="subtitle2">Title</Typography></TableCell>
                        <TableCell align="center"><Typography variant="subtitle2">Authors</Typography></TableCell>
                        <TableCell align="center"><Typography variant="subtitle2">Journal</Typography></TableCell>
                        <TableCell align="center"><Typography variant="subtitle2">Year</Typography></TableCell>
                        <TableCell align="center"><Typography variant="subtitle2">DOI</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {publications.map((publication) => (
                        <TableRow
                            hover
                            key={publication.doi}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="center" component="th" scope="row">
                                <Typography variant="body2" gutterBottom component="div">
                                    <a href={"https://doi.org/" + publication.doi} target="_blank" rel="noopener noreferrer">{publication.doi}</a>
                                </Typography>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <Typography variant="body2" gutterBottom component="div">{publication.title}</Typography>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <Typography variant="body2" gutterBottom component="div">{publication.authors}</Typography>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <Typography variant="body2" gutterBottom component="div">{publication.journal}</Typography>
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                                <Typography variant="body2" gutterBottom component="div">{publication.year}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    )
}