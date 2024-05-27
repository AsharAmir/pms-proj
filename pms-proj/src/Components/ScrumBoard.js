import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';
import { Container, Box, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Root = styled('div')({
    display: 'flex',
    background: '#232526',
    background: '-webkit-linear-gradient(to left, #414345, #232526)',
    background: 'linear-gradient(to left, #414345, #232526)',
});

const MainContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(5),
    padding: theme.spacing(3),
    backgroundColor: 'rgba(25,28,36,0.66)',
    backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const Column = styled(Box)(({ theme }) => ({
    width: '30%',
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: theme.spacing(2),
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const TaskCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const ScrumBoard = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState({});

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/tasks/GetByProject/${projectId}`);
                const fetchedTasks = response.data;

                const columnsFromBackend = {
                    'To Do': {
                        name: 'To Do',
                        items: fetchedTasks.filter(task => task.status === 'To Do')
                    },
                    'Pending': {
                        name: 'Pending',
                        items: fetchedTasks.filter(task => task.status === 'Pending')
                    },
                    'Done': {
                        name: 'Done',
                        items: fetchedTasks.filter(task => task.status === 'Done')
                    }
                };

                setColumns(columnsFromBackend);
                setTasks(fetchedTasks);
            } catch (error) {
                setError('Error fetching tasks');
            }
        };

        fetchTasks();
    }, [projectId]);

    const updateTaskStatus = async (taskId, status) => {
        try {
            await axios.post(`http://localhost:3000/api/tasks/SetTaskStatus/${taskId}/${status}`);
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            removed.status = destColumn.name; // Update task status locally
            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });

            // Update task status on the server
            updateTaskStatus(removed.taskId, destColumn.name);
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Root>
            <Sidebar />
            <MainContainer>
                <Typography variant="h4" gutterBottom style={{ color: '#fff' }}>
                    Scrum Board
                </Typography>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Box display="flex">
                        {Object.entries(columns).map(([columnId, column]) => (
                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided) => (
                                    <Column
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <Typography variant="h6" style={{ color: '#fff' }}>
                                            {column.name}
                                        </Typography>
                                        {column.items.map((item, index) => (
                                            item && item.taskId ? (
                                                <Draggable key={item.taskId} draggableId={item.taskId.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <TaskCard
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                boxShadow: snapshot.isDragging
                                                                    ? "0 5px 10px rgba(0,0,0,0.2)"
                                                                    : "none"
                                                            }}
                                                        >
                                                            <Typography variant="body1">{item.taskName}</Typography>
                                                        </TaskCard>
                                                    )}
                                                </Draggable>
                                            ) : null
                                        ))}
                                        {provided.placeholder}
                                    </Column>
                                )}
                            </Droppable>
                        ))}
                    </Box>
                </DragDropContext>
            </MainContainer>
        </Root>
    );
};

export default ScrumBoard;
