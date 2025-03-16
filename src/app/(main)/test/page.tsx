"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setContainer(containerRef.current);
    }
  }, []);
  return (
    <>
      <div>
        <DialogPrimitive.Root>
          <DialogPrimitive.Trigger> HELLO</DialogPrimitive.Trigger>
          <DialogPrimitive.Portal container={container}>
            <DialogPrimitive.Content>boobs</DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>

        {/* <div ref={setContainer} /> */}
      </div>
      <div>
        <Dialog>
          <DialogTrigger> HELLO</DialogTrigger>
          {container && (
            <DialogContent
              key={container ? "mounted" : "unmounted"}
              container={container}
            >
              boobs
            </DialogContent>
          )}
        </Dialog>

        <div ref={containerRef} />
      </div>
    </>
  );
};
