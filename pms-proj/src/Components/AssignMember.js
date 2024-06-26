import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, Navigate} from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';
import {
    Container,
    Typography,
    FormControl,
    FormControlLabel,
    Checkbox,
    Button,
    CircularProgress,
    Box,
    Alert
} from '@mui/material';
import Sidebar from './Sidebar'; // Import your Sidebar component
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

const AssignMember = () => {
    const { taskId } = useParams();
    const [projectId, setProjectId] = useState(null);
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId]);

    useEffect(() => {
        if (projectId) {
            fetchMembers();
        }
    }, [projectId]);

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/tasks/GetByTaskID/${taskId}`);
            console.log(response.data.projectID);
            setProjectId(response.data.projectID);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Error fetching task details');
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/member/getUnassignedMembersByProject/${projectId}`);
            setMembers(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Error fetching members');
            setLoading(false);
        }
    };

    const handleCheckboxChange = (memberId) => {
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(memberId)
                ? prevSelected.filter((id) => id !== memberId)
                : [...prevSelected, memberId]
        );
    };


    const handleAssign = async () => {
        try {
            console.log("Task ID:", taskId);
            console.log("Selected Members:", selectedMembers);

            // Fetch member IDs individually
            const memberIds = [];
            for (const memberId of selectedMembers) {
                const response = await axios.get(`http://localhost:3000/api/member/getMember/${memberId}`);
                memberIds.push(response.data.memberId);
            }

            // Insert all member IDs into the database
            const responses = await Promise.all(
                memberIds.map(async (memberId) => {
                    const response = await axios.post(`http://localhost:3000/api/assignMember/add`, {
                        taskId,
                        memberId,
                    });
                    console.log("Response:", response.data);
                    //clear selected members
                    setSelectedMembers([]);
                    // Redirect to taskDetails
                    alert('Members assigned successfully');
                    console.log('Navigating to taskDetails...');
                    navigate(`/taskDetails`);
                    return response;
                })
            );
        } catch (error) {
            console.error("Error assigning members:", error);
            setError('Error assigning members');
        }
    };


    return (
        <>
            <GlobalStyle />
            <Root>
                <Sidebar />
                <MainContainer>
                    <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
                        Assign Members to Task {taskId}, Project {projectId}
                    </Typography>
                    {loading ? (
                        <CircularProgress style={{ color: '#fff' }} />
                    ) : (
                        <>
                            {error && <Typography variant="body2" style={{ color: 'red' }}>{error}</Typography>}
                            <FormControl component="fieldset">
                                {members.map((member) => (
                                    <FormControlLabel
                                        key={member.memberId}
                                        control={
                                            <Checkbox
                                                checked={selectedMembers.includes(member.memberId)}
                                                onChange={() => handleCheckboxChange(member.memberId)}
                                                name={member.memberName}
                                            />
                                        }
                                        label={member.memberName}
                                    />
                                ))}
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={handleAssign} style={{ marginTop: '250px', marginLeft: '-100px' }}>
                                Assign Members
                            </Button>
                        </>
                    )}
                </MainContainer>
            </Root>
        </>
    );
};

export default AssignMember;
