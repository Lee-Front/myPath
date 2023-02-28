import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

const EditableTag = styled.div`
  position: relative;
  outline: none;
  line-height: 1.5;
  padding: 0.2rem 0.4rem;
  word-break: break-all;
  white-space: pre-wrap;
`;

const StyleSpan = styled.span`
  // 여기부턴 태그 설정 스타일
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : null};
  color: ${(props) =>
    props?.styleData?.color ? props?.styleData?.color : null};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
  font-weight: ${(props) => (props?.styleData?.bold ? "bold" : null)};
  font-style: ${(props) => (props?.styleData?.italic ? "italic" : null)};
`;

const StyleSpanTag = ({ data, modifyEditDom }) => {
  console.log("data : ", data);
  const [state, setState] = useState(data);

  //   {data.styleData?.bold ||
  //     data.styleData?.italic ||
  //     data.styleData?.underLine ||
  //     data.styleData?.strikethrough ? (
  //       <span
  //         style={{
  //           borderBottom: data.styleData?.underLine
  //             ? "1px solid black"
  //             : null,
  //           textDecoration: data.styleData?.strikethrough
  //             ? "line-through"
  //             : null,
  //         }}
  //       >
  //         {html}
  //       </span>
  //     ) : (
  //       html
  //     )}
  return (
    <>
      {state.html}
      {/* <StyleSpan styleData={data?.styleData}>{state.html}</StyleSpan> */}
    </>
  );
};

export default StyleSpanTag;
