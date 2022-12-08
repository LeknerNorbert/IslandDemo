import React, { useEffect } from 'react';
import { Popover } from 'react-bootstrap';

const MovablePopover = React.forwardRef(
    ({ popper, children, show: _, ...props }, ref) => {
      useEffect(() => {
        popper.scheduleUpdate();
      }, [props.zoom, popper]);
  
      return (
        <Popover ref={ref} body {...props}>
          {children}
        </Popover>
      );
    },
);

export default MovablePopover