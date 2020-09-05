import React from 'react';

import { Container } from './styles';

interface ToolTipProps {
  message: string;
  className?: string;
}

const ToolTip: React.FC<ToolTipProps> = ({
  message,
  className = '',
  children,
}) => {
  return (
    <Container className={className}>
      {children}
      <span>{message}</span>
    </Container>
  );
};

export default ToolTip;
