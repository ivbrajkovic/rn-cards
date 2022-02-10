import { useEffect, useRef } from "react";

const useCountRenders = ({
  title = "Component",
}: {
  title?: string | number;
}) => {
  const c = useRef(0);
  useEffect(() => {
    console.log(`${title} rendered: ${++c.current}`);
  });
};

export default useCountRenders;
