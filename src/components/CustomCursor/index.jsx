import React from 'react';
// import {useEffect, useRef} from 'react';
import "./style.scss"
export default function CustomCursor(){
    const cursorRef = React.useRef(null);
    React.useEffect(()=>{
        document.addEventListener('mousemove', (event)=>{
            const {clientX, clientY} = event;
            const mouseX = clientX - cursorRef.current.clientWidth / 2;
            const mouseY = clientY - cursorRef.current.clientHeight / 2;
            
            cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px,0px)`
        })
    })
    return(
        <div className="app-cursor" ref={cursorRef}>
        </div>
    )
}