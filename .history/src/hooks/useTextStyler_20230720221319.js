const useTextStyler = () => {
  const partialChangeTextStyle = (blockUuid, style, selection) => {
    const target = document.querySelector(`[data-uuid="${blockUuid}"]`);
    const editableTag = target.querySelector("[name=editable-tag]");
    if (!editableTag) {
      return;
    }

    const nodes = Array.from(editableTag.childNodes);
    const range = selection.getRangeAt(0);

    const newHtmlData = makeNewHtml(nodes, range, style);

    //대상 내용물 삭제
    while (editableTag.firstChild) {
      editableTag.removeChild(editableTag.firstChild);
    }

    newHtmlData.html.forEach((node) => {
      editableTag.appendChild(node);
    });

    setCaretPosition(editableTag, newHtmlData);
    return editableTag.innerHTML;
  };

  const getCaretInfoFromNodes = () => {
    const dragInfo = {};
    const range = document.getSelection().getRangeAt(0);

    const { startOffset, endOffset, startContainer, endContainer } = range;
    const blockElement = startContainer.parentElement.closest("[data-uuid]");
    const nodes = Array.from(blockElement.childNodes);
    console.log("nodes: ", nodes);
    let startNode = startContainer;
    let endNode = endContainer;
    console.log("startNode.parentElement: ", startNode.parentElement.nodeName);

    while (startNode.parentElement.nodeName !== "DIV") {
      startNode = startNode.parentElement;
    }
    while (endNode.parentElement.nodeName !== "DIV") {
      endNode = endNode.parentElement;
    }

    let startNodeIndex = nodes.indexOf(startNode);
    let endNodeIndex = nodes.indexOf(endNode);

    if (startNodeIndex > endNodeIndex) {
      [startNodeIndex, endNodeIndex] = [endNodeIndex, startNodeIndex];
    }

    dragInfo.startNodeIndex = startNodeIndex;
    dragInfo.endNodeIndex = endNodeIndex;
    dragInfo.startOffset = startOffset;
    dragInfo.endOffset = endOffset;

    return dragInfo;
  };

  const makeNewHtml = (nodes, style) => {
    const nodeDatas = getNodesData(nodes); // nodes를 데이터로 변환하여 담을 목록
    const dragInfo = getCaretInfoFromNodes(nodes);
    console.log("dragInfo : ", dragInfo);

    const { splitedNodeDatas, splitedDragInfo } = splitNodes(
      nodeDatas,
      dragInfo
    );

    const styledNodeDatas = applyStyle(
      splitedNodeDatas,
      style,
      splitedDragInfo
    );

    const { mergedNodeDatas, mergedDragInfo } = mergedNodesWithSameStyle(
      styledNodeDatas,
      splitedDragInfo
    );

    const generatedElements = generateStyledElements(mergedNodeDatas);
    mergedDragInfo.html = generatedElements;

    return mergedDragInfo;
  };

  const getNodesData = (nodes) => {
    return nodes.map((node) => {
      const nodeObject = {};
      nodeObject.nodeName = node.nodeName;
      nodeObject.style = {};

      if (node.nodeName === "A") {
        nodeObject.link = node.href;
        nodeObject.style.link = node.href;
        node = node.firstChild;
      }

      nodeObject.textContent = node.textContent;

      if (node.nodeName === "SPAN") {
        const styleText = node?.getAttribute("style");
        if (styleText) {
          const styleObj = {};
          styleText.split(";").forEach((item) => {
            const [key, value] = item.split(":");
            if (key && value) {
              styleObj[key.trim()] = value.trim();
            }
          });
          nodeObject.style = { ...nodeObject.style, ...styleObj };
        }
      }
      return nodeObject;
    });
  };

  const splitNodes = (nodeDatas, dragInfo) => {
    let splitedNodeDatas = [];
    const copyNodeDatas = JSON.parse(JSON.stringify(nodeDatas));
    const { startNodeIndex, endNodeIndex, startOffset, endOffset } = dragInfo;
    const splitedDragInfo = JSON.parse(JSON.stringify(dragInfo));

    for (let i = 0; i < copyNodeDatas.length; i++) {
      const nodeData = copyNodeDatas[i];
      if (startNodeIndex <= i && i <= endNodeIndex) {
        // 선택된 범위안의 node 들
        const prevText =
          i === startNodeIndex
            ? nodeData.textContent.slice(0, startOffset)
            : "";
        const nextText =
          i === endNodeIndex
            ? nodeData.textContent.slice(endOffset, nodeData.textContent.length)
            : "";

        if (prevText.length > 0) {
          nodeData.textContent = nodeData.textContent.slice(startOffset);
          // prevText가 있다는건 분리를 시켜줘야 한다는뜻임
          splitedDragInfo.startNodeIndex += 1;
          splitedDragInfo.startOffset = 0;
          splitedDragInfo.endNodeIndex += 1;

          if (startNodeIndex === endNodeIndex) {
            splitedDragInfo.endOffset -= prevText.length;
          }

          const prevNode = JSON.parse(JSON.stringify(nodeData));
          prevNode.textContent = prevText;
          splitedNodeDatas.push(prevNode);
        }

        splitedNodeDatas.push(nodeData);

        if (nextText.length > 0) {
          nodeData.textContent = nodeData.textContent.slice(
            0,
            splitedDragInfo.endOffset
          );

          const nextNode = JSON.parse(JSON.stringify(nodeData));
          nextNode.textContent = nextText;
          splitedNodeDatas.push(nextNode);
        }
      } else {
        splitedNodeDatas.push(nodeData);
      }
    }
    splitedNodeDatas = splitedNodeDatas.filter(
      (item) => item.textContent !== ""
    );

    return { splitedNodeDatas, splitedDragInfo };
  };

  const applyStyle = (splitedNodeDatas, style, splitedDragInfo) => {
    const newStyleList = Object.keys(style);
    return splitedNodeDatas.map((nodeData, index) => {
      // 공백에는 시각적으로 보이는 스타일만 유지
      if (nodeData.textContent.trim() === "" && nodeData.nodeName === "SPAN") {
        const preservedStyles = [
          "link",
          "border-bottom",
          "text-decoration",
          "background",
        ];
        Object.keys(nodeData.style)
          .filter((style) => !preservedStyles.includes(style))
          .forEach((styleName) => {
            delete nodeData.style[styleName];
          });
      }

      if (
        index < splitedDragInfo.startNodeIndex ||
        index > splitedDragInfo.endNodeIndex
      ) {
        return nodeData;
      }

      for (let i = 0; i < newStyleList.length; i++) {
        const styleName = newStyleList[i];
        if (style[styleName] === "") {
          delete nodeData.style[styleName];
        } else {
          nodeData.style[styleName] = style[styleName];
        }
      }
      return nodeData;
    });
  };

  const mergedNodesWithSameStyle = (styledNodeDatas, splitedDragInfo) => {
    const mergedDragInfo = JSON.parse(JSON.stringify(splitedDragInfo));
    const mergedNodeDatas = styledNodeDatas.reduce((acc, cur, index) => {
      const curData = JSON.parse(JSON.stringify(cur));
      const prevData = acc[acc.length - 1];
      const prevStyles = Object.keys(prevData?.style || {});
      const curStyles = Object.keys(curData.style || {});

      const isSameStyle =
        prevStyles.length === curStyles.length &&
        prevStyles.every(
          (styleName) => prevData.style[styleName] === curData.style[styleName]
        );

      if (prevData && isSameStyle) {
        if (index <= splitedDragInfo.startNodeIndex) {
          mergedDragInfo.startNodeIndex -= 1;
          mergedDragInfo.endNodeIndex -= 1;
          if (index === splitedDragInfo.startNodeIndex) {
            mergedDragInfo.startOffset += prevData.textContent.length;
            mergedDragInfo.endOffset += prevData.textContent.length;
          }
        } else if (
          splitedDragInfo.startNodeIndex < index &&
          splitedDragInfo.endNodeIndex > index
        ) {
          mergedDragInfo.endNodeIndex -= 1;
        } else if (index === splitedDragInfo.endNodeIndex) {
          mergedDragInfo.endNodeIndex -= 1;
          mergedDragInfo.endOffset += prevData.textContent.length;
        }
        acc[acc.length - 1].textContent += curData.textContent;
      } else {
        acc.push(curData);
      }

      return acc;
    }, []);

    return { mergedNodeDatas, mergedDragInfo };
  };

  const generateStyledElements = (styledNodeDatas) => {
    return styledNodeDatas.map((node) => {
      const { style, textContent } = node;

      for (const nodeStyle in style) {
        if (nodeStyle === "link") {
          node.link = style[nodeStyle];
          delete style[nodeStyle];
        }
      }

      let newElement;
      const styleKeys = Object.keys(style);
      if (styleKeys.length > 0) {
        const newStyle = styleKeys
          .map((styleName) => styleName + ":" + style[styleName] + ";")
          .join("");

        newElement = document.createElement("span");
        newElement.style.cssText = newStyle;
        newElement.innerText = textContent;
      } else {
        newElement = document.createTextNode(textContent);
      }

      if (node.link) {
        const linkTag = document.createElement("a");
        linkTag.className = "link";
        linkTag.target = "_blank";

        linkTag.appendChild(newElement);
        let link = node.link;
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
          linkTag.href = `http://${node.link}`;
        } else {
          linkTag.href = `${node.link}`;
        }

        return linkTag;
      }

      return newElement;
    });
  };

  const setCaretPosition = (target, position) => {
    const nodes = target.childNodes;
    const { startNodeIndex, endNodeIndex, startOffset, endOffset } = position;
    const newRange = document.createRange();
    let startNode = nodes[startNodeIndex];
    let endNode = nodes[endNodeIndex];
    // 가장 마지막인 text까지 가야됨
    while (startNode.firstChild) {
      startNode = startNode.firstChild;
    }

    while (endNode.firstChild) {
      endNode = endNode.firstChild;
    }

    newRange.setStart(startNode, startOffset);
    newRange.setEnd(endNode, endOffset);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(newRange);
  };

  const getSelectNodes = (nodes, selection) => {
    let startNode = selection.baseNode;
    let endNode = selection.extentNode;

    while (startNode.parentElement.nodeName !== "DIV") {
      startNode = startNode.parentElement;
    }
    while (endNode.parentElement.nodeName !== "DIV") {
      endNode = endNode.parentElement;
    }

    let startNodeIndex = nodes.indexOf(startNode);
    let endNodeIndex = nodes.indexOf(endNode);

    if (startNodeIndex > endNodeIndex) {
      [startNodeIndex, endNodeIndex] = [endNodeIndex, startNodeIndex];
    }

    return nodes.filter(
      (_, index) => startNodeIndex <= index && index <= endNodeIndex
    );
  };

  const getCommonAttributes = (array) => {
    const styles = array?.map((item) => JSON.parse(JSON.stringify(item.style)));
    // styles없으면 그냥 빈 객체 반환
    return styles.length > 0
      ? styles?.reduce((acc, cur) => {
          Object.keys(acc).forEach((key) => {
            if (!cur.hasOwnProperty(key) || cur[key] !== acc[key]) {
              delete acc[key];
            }
          });
          return acc;
        })
      : {};
  };

  const textStylerFunctions = {
    partialChangeTextStyle,
    makeNewHtml,
    getNodesData,
    splitNodes,
    applyStyle,
    mergedNodesWithSameStyle,
    generateStyledElements,
    setCaretPosition,
    getSelectNodes,
    getCommonAttributes,
    getCaretInfoFromNodes,
  };
  return textStylerFunctions;
};

export default useTextStyler;
