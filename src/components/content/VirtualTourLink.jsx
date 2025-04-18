import domToReact from "html-react-parser/lib/dom-to-react";
import { useLocation, useNavigate } from "react-router-dom";

const VirtualTourLink = ({domNode}) => {

  const location = useLocation();

  const navigate = useNavigate();
  return <button className="custom-link-class" onClick={() => navigate(domNode.attribs.href, { state: { modal: true, previousLocation: location } })}>{domToReact(domNode.children)}</button>
}

export default VirtualTourLink;