import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Grid, Paper, Typography, Box, Container } from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    ::-webkit-scrollbar {
        display: none;
    }
    
    body {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
`;

const Root = styled('div')`
    display: flex;
    background: #232526;  // fallback for old browsers
    background: -webkit-linear-gradient(to left, #414345, #232526);  // Chrome 10-25, Safari 5.1-6
    background: linear-gradient(to left, #414345, #232526); // W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+
    overflow-y: hidden;
`;

const MainContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(5),
    padding: theme.spacing(3),
    backgroundColor: 'rgba(25,28,36,0.66)',
    backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    overflowY: 'auto',
    // Hide scrollbar for Chrome, Safari and Opera
    '&::-webkit-scrollbar': {
        display: 'none',
    },
    // Hide scrollbar for IE, Edge and Firefox
    '-ms-overflow-style': 'none',  // IE and Edge
    'scrollbar-width': 'none',  // Firefox
}));

const SectionBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing(3),
    backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    '& h6': {
        fontWeight: 'bold',
        color: '#fff',
    },
    '& p': {
        color: '#fff',
    },
}));

const GetProjectByID = () => {
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);
    const { projectId } = useParams();

    const fetchTasks = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/tasks/GetByProject/${projectId}`);
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            setError('Error fetching tasks');
        }
    };

    const fetchMembers = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/member/getMembersByProject/${projectId}`);
            console.log(response.data)
            setMembers(response.data);
        } catch (error) {
            console.error(error);
            setError('Error fetching members');
        }
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/projects/fetchProject/${projectId}`);
                setProject(response.data);
                fetchTasks(projectId);
                fetchMembers(projectId);
            } catch (error) {
                console.error(error);
                setError('Error fetching project details');
            }
        };

        fetchProject();
    }, [projectId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <GlobalStyle />
            <Root>
                <Sidebar />
                <MainContainer>
                    <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
                        Project Details
                    </Typography>
                    <SectionBox>
                        <Typography variant="h6">Project Name</Typography>
                        <Typography variant="body1">{project.projectName}</Typography>
                    </SectionBox>
                    <SectionBox>
                        <Typography variant="h6">Description</Typography>
                        <Typography variant="body1">{project.description}</Typography>
                    </SectionBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <SectionBox>
                                <Typography variant="h6">Start Date</Typography>
                                <Typography variant="body1">{project.startDate}</Typography>
                            </SectionBox>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SectionBox>
                                <Typography variant="h6">End Date</Typography>
                                <Typography variant="body1">{project.endDate}</Typography>
                            </SectionBox>
                        </Grid>
                    </Grid>
                    <SectionBox>
                        <Typography variant="h6">Members</Typography>
                        {members.length > 0 ? (
                            members.map((member) => (
                                <Typography key={member.memberId} variant="body2">
                                    {"ID: " + member.memberId + ", Name: " + member.memberName}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body2">No members found</Typography>
                        )}
                    </SectionBox>
                    <SectionBox>
                        <Typography variant="h6">Tasks</Typography>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <Typography key={task.task_id} variant="body2">
                                    {task.taskName}: {task.description}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body2">No tasks found</Typography>
                        )}
                    </SectionBox>
                </MainContainer>
            </Root>
        </>
    );
};

export default GetProjectByID;
