const { useEffect, useRef } = require("react");

function useMountAndUpdateEffect(onUpdate,onLoad,inputs) {
    const didMountRef = useRef(false);
  
    useEffect(() => {
      if (didMountRef.current)
        onUpdate();
      else{
          onLoad()
          didMountRef.current = true;
        }
    }, inputs);
}

export default useMountAndUpdateEffect