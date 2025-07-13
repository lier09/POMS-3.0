import React from 'react';

interface ResultsTableProps {
  data: { name: string; score: number }[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>分数</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.score > 5 ? '高风险' : '低风险'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
