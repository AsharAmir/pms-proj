import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import Sidebar from '../Sidebar';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    body {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
`;

const Root = styled('div')({
    display: 'flex',
    background: '#232526',
    background: '-webkit-linear-gradient(to left, #414345, #232526)',
    background: 'linear-gradient(to left, #414345, #232526)',
    overflowY: 'auto',
    height: '100vh',  // Ensure it takes full height for scrolling
});

const MainContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(5),
    padding: theme.spacing(3),
    backgroundColor: 'rgba(25,28,36,0.66)',
    backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    borderRadius: '10px',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    height: '80vh', // Adjust height as needed
    overflowY: 'auto',
    // Hide scrollbar for Chrome, Safari and Opera
    '&::-webkit-scrollbar': {
        display: 'none',
    },
    // Hide scrollbar for IE, Edge and Firefox
    '-ms-overflow-style': 'none',  // IE and Edge
    'scrollbar-width': 'none',  // Firefox
    color: '#fff',
    '& h4': {
        fontWeight: 'bold',
        marginBottom: theme.spacing(5),
    },
}));

const SectionBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: 'rgba( 255, 255, 255, 0.1 )',
    marginBottom: theme.spacing(3),
    backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    borderRadius: '10px',
    border: '1px solid rgba( 255, 255, 255, 0.18 )',
    '& h6': {
        fontWeight: 'bold',
        color: '#fff',
    },
    '& p': {
        color: '#fff',
    },
}));

const Schedulemeeting = () => {
    const [meetingTitle, setMeetingTitle] = useState('');
    const [meetingDescription, setMeetingDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSchedule = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/api/meetings/schedule', {
                title: meetingTitle,
                description: meetingDescription,
                projectId,
                date: meetingDate,
                time: meetingTime,
            });
            console.log('Response:', response.data);
            setLoading(false);
            navigate(`/meetings/${response.data.meetingId}`);
        } catch (error) {
            console.error(error);
            setError('Error scheduling meeting');
            setLoading(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Root>
                <Sidebar />
                <MainContainer>
                    <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
                        Schedule a New Meeting
                    </Typography>
                    {loading ? (
                        <CircularProgress style={{ color: '#fff' }} />
                    ) : (
                        <>
                            {error && <Typography variant="body2" style={{ color: 'red' }}>{error}</Typography>}
                            <TextField
                                label="Meeting Title"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={meetingTitle}
                                onChange={(e) => setMeetingTitle(e.target.value)}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                            <TextField
                                label="Meeting Description"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={meetingDescription}
                                onChange={(e) => setMeetingDescription(e.target.value)}
                                multiline
                                rows={4}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                            <TextField
                                label="Project ID"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                InputLabelProps={{
                                    style: { color: '#fff' },
                                }}
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                            <TextField
                                label="Meeting Date"
                                type="date"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={meetingDate}
                                onChange={(e) => setMeetingDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { color: '#fff' },
                                }}
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                            <TextField
                                label="Meeting Time"
                                type="time"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={meetingTime}
                                onChange={(e) => setMeetingTime(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { color: '#fff' },
                                }}
                                InputProps={{
                                    style: { color: '#fff' },
                                }}
                            />
                            <Button variant="contained" color="primary" onClick={handleSchedule} style={{ marginTop: '20px' }}>
                                Schedule Meeting
                            </Button>
                        </>
                    )}
                </MainContainer>
            </Root>
        </>
    );
};

export default Schedulemeeting;