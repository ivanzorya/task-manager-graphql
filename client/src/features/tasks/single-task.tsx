import React, { useState } from "react";
import { Button, Card, Row, Col, InputGroup } from "react-bootstrap";
import { Task } from "./models"


const TaskRow: React.FC<{
    taskData: Task, 
    deleteSingleTask: (id: string) => void,
    changeSingleTask: (task: Task) => void
  }> = ({taskData, deleteSingleTask, changeSingleTask}) => {
    const [done, setDone] = useState(taskData.done)

    return (
        <Card className="stndrt-class">
            <Row>
                <Col sm={8}>Subject: { taskData !== undefined && taskData.subject}</Col>
                <Col sm={2}>
                    <InputGroup.Checkbox checked={done} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setDone(event.target.checked);
                        changeSingleTask({_id: taskData._id, subject:taskData.subject, done: event.target.checked});
                        }}
                    />
                </Col>
                <Col sm={2}>
                    <Button className="stndrt-class" onClick={() => deleteSingleTask(taskData._id)}>delete task</Button>
                </Col>
            </Row>
        </Card>
    )
}

export default TaskRow