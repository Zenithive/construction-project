"use client"
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface FilesProps {}

const StyledFiles = styled.div`
  color: pink;
`;

export default function Files(props: FilesProps) {
  return (
    <StyledFiles>
      <h1>Welcome to Files!</h1>
    </StyledFiles>
  );
}
