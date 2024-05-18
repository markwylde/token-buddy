import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
`;

export const Inputs = styled.div`
  width: 300px;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #ccc;
`;

export const Section = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
`;

export const OutputContainer = styled.div`
  flex: 1;
  padding: 0 20px;
  overflow-x: auto;
  display: flex;
  gap: 20px;
`;

export const TableContainer = styled.div`
  margin-bottom: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ccc;
    padding: 4px;
    text-align: left;
    white-space: nowrap;
  }
`;

export const ColorSquare = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  background-color: ${({ color }) => color};
`;

export const Button = styled.button`
  margin-top: 20px;
`;
