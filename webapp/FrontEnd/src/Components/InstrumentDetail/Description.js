import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Content({ description }) {
    return (
        <Grid item xs={12} md={12} lg={12} >
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '55vh',
                }}
            >
                <div style={{ overflowY: 'scroll' }}>
                    <Typography variant="h6" gutterBottom component="div"> DESCRIPTION </Typography>
                    <Typography variant="subtitle2" paragraph align='justify'>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} children={description} />
                    </Typography>
                </div>
            </Paper>
        </Grid >
    );
}