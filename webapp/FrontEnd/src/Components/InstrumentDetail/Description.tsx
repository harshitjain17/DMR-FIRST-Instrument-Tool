import React from 'react';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

interface DescriptionTabProps {
    description?: string;
    capabilities?: string,
    image: string
}

export default function Description({ description, capabilities, image }: DescriptionTabProps) {
    return (
        <Grid item xs={12} md={12} lg={12} >
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '50vh',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >
                <Grid container spacing={1}>
                    {image &&
                        <Grid item xs={4} md={4} lg={4}>
                            <ButtonBase sx={{ width: '100%', height: '45vh' }}>
                                <Img alt="Image Not Found" src={`${config.url}${image}`} />
                            </ButtonBase>
                        </Grid>}
                    <Grid item xs={image ? 8 : 12} md={image ? 8 : 12} lg={image ? 8 : 12} sm container>
                        <div style={{ height: '44vh', overflowY: 'auto' }}>
                            <Typography variant="body2" align='justify' component="div">
                                <ReactMarkdown rehypePlugins={[rehypeRaw]} children={description ?? ""} />
                            </Typography>

                            <Typography variant="h6" gutterBottom component="div">{capabilities && "Capabilities"}</Typography>
                            <Typography variant="body2" align='justify' component="div">
                                {capabilities && <ReactMarkdown rehypePlugins={[rehypeRaw]} children={capabilities} />}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </Grid >
    );
}