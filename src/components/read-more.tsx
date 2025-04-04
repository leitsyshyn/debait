import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Linkify from "./linkify";

type ReadMoreProps = {
  text?: string;
  lineClamp?: number;
};

const ReadMore = ({ text, lineClamp }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current && !isExpanded) {
      const { scrollHeight, offsetHeight } = textRef.current;
      setShowButton(scrollHeight > offsetHeight);
    }
  }, [text, lineClamp, isExpanded]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  return (
    <Linkify>
      <div>
        <div className={isExpanded ? "" : `line-clamp-[3]`} ref={textRef}>
          {text}
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
