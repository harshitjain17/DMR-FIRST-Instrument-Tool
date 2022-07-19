import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';

export default function ContactsTable(props) { 
    const ContactsArray = props.contacts ?? [];
    return (
        <TableContainer style={{ maxHeight: 170 }}>
            <Table stickyHeader sx={{ minWidth: 425 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Role</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {ContactsArray.map((row) => (
                    <TableRow
                        hover
                        key={row?.email}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="center" component="th" scope="row">{row?.firstName} {row?.middleName} {row?.lastName}</TableCell>
                        <TableCell align="center"><Link href="mailto:" target="_blank"> {row?.email ?? row?.eppn}</Link></TableCell>
                        <TableCell align="center">{row?.role}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}