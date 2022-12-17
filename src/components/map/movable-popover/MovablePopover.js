import React, { useEffect } from 'react';
import { Popover } from 'react-bootstrap';

const MovablePopover = React.forwardRef(
    ({ popper, children, show: _, ...props }, ref) => {
      useEffect(() => {
        popper.scheduleUpdate();
      }, [props.zoom, props.building, popper]);
  
      return (
        <Popover ref={ref} body {...props} className="rounded-0 border-0">
          {children}
        </Popover>
      );
    },
);

export default MovablePopover