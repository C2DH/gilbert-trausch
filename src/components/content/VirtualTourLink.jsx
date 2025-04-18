import domToReact from "html-react-parser/lib/dom-to-react";
import { useNavigate } from "react-router-dom";

const VirtualTourLink = ({domNode}) => {
  const navigate = useNavigate();
  console.log('link', domNode);
  return <button onClick={() => navigate(domNode.attribs.href, { state: { modal: true } })}>{domToReact(domNode.children)}</button>
}

export default VirtualTourLink;