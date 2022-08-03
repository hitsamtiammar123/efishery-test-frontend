import React from 'react';
import { AnimatedContainer } from 'Container';

export const withAnimated = (Element, animatedProps = {}) => {
  return function(props){ 
    return (
      <AnimatedContainer {...animatedProps}>
        <Element {...props} />
      </AnimatedContainer>
    )
  }
}
