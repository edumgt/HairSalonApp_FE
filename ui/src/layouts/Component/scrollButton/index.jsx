import React from 'react';
import { Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';

import './index.scss';

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      className="scrollButton"
      type="primary"
      shape="circle"
      icon={<UpOutlined />}
      onClick={scrollToTop}
      size="large"
      
    />
  );
}

export default ScrollToTopButton;