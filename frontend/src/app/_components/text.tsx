import { m } from "framer-motion";
import { useEffect, useState } from "react";
// import CursorBlinker from "./CursorBlinker";
import PropTypes from 'prop-types'
import { user } from "@nextui-org/react";

TypingAnimation.propTypes = {
  text: PropTypes.string
}
export default function TypingAnimation({ text }: {text: string}) {
  const [t, setT] = useState("")
  // const transform = useMotionTemplate`${text.slice(0, rounded)}`
  useEffect(() => {
    setTimeout(() => {

    let counter = 0;
    const intervalId = setInterval(() => {
      if (counter > text.length) {
        clearInterval(intervalId);
        return
      }
      setT(text.slice(0, counter))
      counter++;
    }, 35);
    return () => clearInterval(intervalId)
  }, 2000)

    
  }, [text]);

  return (
    <>
      <m.span>{t}</m.span>
    </>
  );
}
