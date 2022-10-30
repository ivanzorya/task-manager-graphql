import React, { useState } from "react";
import { Button, Form, Container, Modal, InputGroup } from "react-bootstrap"
import TaskRow from "./single-task"
import { Task } from "./models"
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "./Query"
import { DELETE_TASK, CREATE_TASK, UPDATE_TASK } from "./Mutation";


export const Tasks = () => {
    const { data: { tasks = null } = {}, refetch } = useQuery(GET_TASKS);
    const [deleteTask] = useMutation(DELETE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [createTask] = useMutation(CREATE_TASK);
    
    const [addNewTask, setAddNewTask] = useState(false)
    const [newTask, setNewTask] = useState({"subject": "", "done": false})

    const changeSingleTask = (updatedTask: Task) => {
        updateTask({ variables: {input: updatedTask } }).then(() => refetch())
    }

    const addSingleTask = () => {
        setAddNewTask(false)
        createTask({ variables: {input: {
            subject: newTask.subject,
            done: newTask.done,
        } } }).then(() => refetch())
    }

    const deleteSingleTask = (_id: string) => {
        deleteTask({ variables: {input: { _id }} }).then(() => refetch())
    }

    return (
        <div>
            
            <Container >
                <Button className="stndrt-class" onClick={() => setAddNewTask(true)}>Add new task</Button>
            </Container>

            <Container>
                {tasks != null && tasks.map((task: Task) => (
                    <TaskRow key={task._id} taskData={task} 
                    deleteSingleTask={deleteSingleTask} changeSingleTask={changeSingleTask}/>
                ))}
            </Container>
            
            <Modal show={addNewTask} onHide={() => setAddNewTask(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="stndrt-class">Add Task</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group >
                        <Form.Control className="stndrt-class" onChange={(event) => {
                            setNewTask({...newTask, subject: event.target.value})
                            }} />
                        <InputGroup.Checkbox type="checkbox" onChange={
                            (event: React.ChangeEvent<HTMLInputElement>) => {
                                setNewTask({...newTask, done: event.target.checked})
                                }}
                        />
                    </Form.Group>
                    <Button className="stndrt-class" onClick={() => addSingleTask()}>Add</Button>
                    <Button className="stndrt-class" onClick={() => setAddNewTask(false)}>Cancel</Button>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Tasks