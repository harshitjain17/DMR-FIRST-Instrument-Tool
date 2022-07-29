import React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Content({ description, capabilities }) {
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
                <div style={{ overflowY: 'auto' }}>
                    <Typography variant="body" component="div" align='justify'>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} children={description} />
                    </Typography>
                    <Typography variant="h6" gutterBottom component="div">{capabilities && "Capabilities"}</Typography>
                    <Typography variant="body" component="div" align='justify'>
                        {capabilities && <ReactMarkdown rehypePlugins={[rehypeRaw]} children={capabilities} />}
                    </Typography>
                </div>
            </Paper>
        </Grid >
    );
}