import React, { useState, useRef, useEffect} from 'react'
import { BsSpellcheck } from 'react-icons/bs'
import { FaEraser } from 'react-icons/fa'

interface ICanvas {
  callback: (result?: string[], error?: any) => void
  numOfReturn?: number
  numOfWords?: number
}

const Canvas: React.FC<ICanvas> = (props) => {

  const [isDrawing, setDrawing] = useState<boolean>(false);
  const [handwritingX, setHWX] = useState<number[]>([])
  const [handwritingY, setHWY] = useState<number[]>([])
  const [trace, setTrace] = useState<any>([])
  const drawboardRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvas = drawboardRef.current
  const ctx = ctxRef.current

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if(canvas){
      canvas.height = canvas.width
      const ctx = canvas.getContext('2d');
      if(ctx){
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = "dimgray"
        ctxRef.current = ctx
      }
    }
  }, [canvas])

  const mouseDown = (e: React.MouseEvent) => {
    setDrawing(true)
    ctx?.beginPath();
    let rect = canvas?.getBoundingClientRect();
    let x = e.clientX - (rect?.left || 0);
    let y = e.clientY - (rect?.top || 0);
    ctx?.moveTo(x, y);
    setHWX([...handwritingX, x]);
    setHWY([...handwritingY, y]);
  }

  const mouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      let rect = canvas?.getBoundingClientRect();
      let x = e.clientX - (rect?.left || 0);
      let y = e.clientY - (rect?.top || 0);
      ctx?.lineTo(x, y);
      ctx?.stroke();
      setHWX([...handwritingX, x]);
      setHWY([...handwritingY, y]);
    }
  }

  const mouseUp = () => {
    let w = [];
    w.push(handwritingX);
    w.push(handwritingY);
    w.push([]);
    setTrace([...trace, w]);
    setDrawing(false)
  }

  function touchStart(e: React.TouchEvent){
    e.preventDefault()
    e.stopPropagation()
    let de = document.documentElement;
    let box = canvas?.getBoundingClientRect();
    let top = (box?.top || 0) + window.pageYOffset - de.clientTop;
    let left = (box?.left || 0) + window.pageXOffset - de.clientLeft;
    let touch = e.changedTouches[0];
    let touchX = touch.pageX - left;
    let touchY = touch.pageY - top;
    setHWX([...handwritingX, touchX]);
    setHWY([...handwritingY, touchY]);
    ctx?.beginPath();
    ctx?.moveTo(touchX, touchY);
    return false
  }

  function touchMove(e: React.TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
    let touch = e.targetTouches[0];
    let de = document.documentElement;
    let box = canvas?.getBoundingClientRect();
    let top = (box?.top || 0) + window.pageYOffset - de.clientTop;
    let left = (box?.left || 0) + window.pageXOffset - de.clientLeft;
    let x = touch.pageX - left;
    let y = touch.pageY - top;
    setHWX([...handwritingX, x]);
    setHWY([...handwritingY, y]);
    ctx?.lineTo(x, y);
    ctx?.stroke();
    return false
  }

  function touchEnd(e: React.TouchEvent) {
    let w = [];
    w.push(handwritingX);
    w.push(handwritingY);
    w.push([]);
    setTrace([...trace, w]);
  }

  function erase() {
    ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    setHWX([])
    setHWY([])
    setTrace([]);
  }

  function recognize() {
    let data = JSON.stringify({
      options: 'enable_pre_space',
      requests: [
        {
          writing_guide: {
            writing_area_width: canvas?.width || undefined,
            writing_area_height: canvas?.width || undefined
          },
          ink: trace,
          language: 'ja'
        }
      ]
    });
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        switch (this.status) {
          case 200:
            let response = JSON.parse(this.responseText);
            let results;
            erase();
            if (response.length === 1) {
              console.log(new Error(response[0]));
            } else {

              results = response[1][0][1];
            }
            if (!!props.numOfWords) {
              results = results.filter(function (result: any) {
                return result.length === props.numOfWords;
              });
            }
            if (!!props.numOfReturn) {
              results = results.slice(0, props.numOfReturn);
            }
            props.callback(results, undefined);
            break;
          case 403:
            props.callback(undefined, new Error('access denied'));
            break;
          case 503:
            props.callback(
              undefined,
              new Error("can't connect to recognition server")
            );
            break;
          default:
        }
      }
    });
    xhr.open(
      'POST',
      'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8'
    );
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(data);
  }

  function prevent(e: React.DragEvent | React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  return (<div className="relative flex w-full h-full">
    <div
      className='absolute transform top-1/2 md:left-1/4 lg:left-1/3 -translate-y-1/2 flex flex-col gap-1'
    >
      <button
        className='text-3xl sm:text-5xl bg-emerald-200 text-gray-600 rounded-full p-2 shadow-md'
        onClick={recognize}
        type="button"
        title="Check"
      >
        <BsSpellcheck className="mx-auto" />
      </button>
      <button
        className='text-3xl sm:text-4xl aspect-square bg-gray-200 text-gray-600 rounded-full p-2 shadow-md'
        onClick={erase}
        type="button"
        title="Check"
      >
        <FaEraser className="mx-auto" />
      </button>
    </div>
    <canvas
      ref={drawboardRef}
      className='disable-select aspect-square bg-white max-w-xs m-auto'
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={mouseMove}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onDragStart={prevent}
      onDoubleClick={prevent}
      onDragCapture={prevent}
      onDoubleClickCapture={prevent}
      onDragEnd={prevent}
      onContextMenu={prevent}
    />
  </div> ) 
}

export default Canvas