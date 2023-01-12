import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Investigator } from '../../Api/Model';

interface ContactsTabProps {
    contacts: Investigator[];
}

export function ContactsTab({ contacts }: ContactsTabProps) {
    return (
        <TableContainer style={{ maxHeight: '32vh' }}>
            <Table stickyHeader sx={{ minWidth: '35vw' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><Typography variant="subtitle2">Name</Typography></TableCell>
                        <TableCell align="center"><Typography variant="subtitle2">Email</Typography></TableCell>
                        <TableCell align="center"><Typography variant="subtitle2">Role</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts && contacts.map((row) => (
                        <TableRow
                            hover
                            key={row?.email}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="center" component="th" scope="row"><Typography variant="body2" gutterBottom component="div">{row?.firstName} {row?.middleName} {row?.lastName}</Typography></TableCell>
                            <TableCell align="center"><Link href="mailto:" target="_blank"  rel="noopener"><Typography variant="body2" gutterBottom component="div">{row?.email ?? row?.eppn}</Typography></Link></TableCell>
                            <TableCell align="center"><Typography variant="body2" gutterBottom component="div">{row?.role}</Typography></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}