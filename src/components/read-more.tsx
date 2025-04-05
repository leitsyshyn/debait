import React, { useEffect, useRef, useState } from "react";

import { Button } from "./ui/button";
import Linkify from "./linkify";

const ReadMore: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current && !isExpanded) {
      const { scrollHeight, offsetHeight } = textRef.current;
      setShowButton(scrollHeight > offsetHeight);
    }
  }, [children, isExpanded]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  return (
    <Linkify>
      <div>
        <div className={isExpanded ? "" : `line-clamp-[3]`} ref={textRef}>
          {children}
        </div>
        {showButton && (
          <Button
            variant="link"
            onClick={toggleExpand}
            className="p-0 max-h-fit text-muted-foreground"
          >
            {isExpanded ? "Read less" : "Read more"}
          </Button>
        )}
      </div>
    </Linkify>
  );
};

export default ReadMore;
