"use client"
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface TasksProps {}

const StyledTasks = styled.div`
  color: pink;
`;

export default function Tasks(props: TasksProps) {
  return (
    <StyledTasks>
      <h1>Welcome to Tasks!</h1>
    </StyledTasks>
  );
}
