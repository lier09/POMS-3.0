import React from 'react';

interface ResultsViewProps {
  score: number;
}

const ResultsView: React.FC<ResultsViewProps> = ({ score }) => {
  return (
    <div>
      <h2>总评分</h2>
      <p>您的分数为：{score}</p>
      <p>评价结果：{score > 5 ? '睡眠质量较差，建议关注调整' : '睡眠质量良好'}</p>
    </div>
  );
};

export default ResultsView;
