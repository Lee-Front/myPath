import React from "react";

const ImageTag = () => {
  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <EditableTag
        ref={editRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onAuxClick={(e) => {
          // 오른쪽 클릭
          e.preventDefault();
        }}
        style={{
          background:
            hoverUuid && hoverUuid === data.uuid ? "rgba(55,53,47,0.08)" : "",
        }}
        placeholder={editPlaceHolder}
        onFocus={() => {
          if (data.placeholder) {
            setEditPlaceHolder(data.placeholder);
          }
        }}
        onBlur={() => {
          setEditPlaceHolder(data.defaultPlaceHolder);
        }}
        onInput={(e) => {
          setState((prev) => ({ ...prev, html: e.target.textContent }));
          modifyEditDom(data.uuid, e.target.textContent);
        }}
      />
      {movementSide?.uuid === data.uuid ? (
        <div style={getMovementStyle(movementSide?.position)}></div>
      ) : null}
    </div>
  );
};

export default ImageTag;
