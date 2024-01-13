"use client"
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ProjectsProps {}

const StyledProjects = styled.div`
  color: pink;
`;

export default function Projects(props: ProjectsProps) {
  return (
    <StyledProjects>
      <h1>Welcome to Projects!</h1>
    </StyledProjects>
  );
}
