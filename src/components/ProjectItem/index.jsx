import React from 'react';
import {useReducer, useRef} from 'react';
import "./style.scss"
import { Hash } from "react-feather"
import Image from "./image"
import Title from "./title"
import cn from 'classnames';
import animate from './animate'
const initialState ={
    opacity:0,
    parallaxPos: {x:0, y:-20},
    scale: 0.8,
    rotationPosition:0,
    active: false,
}
function reducer(state,action){
switch(action.type){
    case "MOUSE/ENTER":{
        return{...state,
        active: true}
    }
    case "MOUSE/LEAVE":{
        return{...state,
        active: false}
    }
    case "CHANGE/OPACITY":{
        return{...state,
        opacity: action.payload}
    }
    case "MOUSE/COORDINATES":{
        return {
            ...state,
            parallaxPos: action.payload

        }
    }
    case "CHANGE/ROTATION":{
        return {
            ...state,
            rotationPosition: action.payload

        }
    }
    case "CHANGE/SCALE":{
        return {
            ...state,
            scale: action.payload

        }
    }
    default:{
        throw new Error("Unknown action")
    }
}
}
export default function ProjectItem({project, itemIndex}){
    const [state, dispatch] = useReducer(reducer, initialState);
    const listItem= useRef(null);
    const easeMethod = 'easeInOutCubic'
    const parallax = (event)=>{
        const speed = -5;
        const x = (window.innerWidth - event.pageX * speed)/100;
        const y = (window.innerHeight - event.pageY * speed)/100;
        dispatch({type:'MOUSE/COORDINATES',payload:{x,y}})
    }
    const handleMouseEnter = () => {
        handleOpacity(0,1,400);
        handleScale(0.8,1.5,500);
        handleRotation(state.rotationPosition, 500)
        listItem.current.addEventListener("mousemove", parallax)
        dispatch({type:'MOUSE/ENTER'})
    }
    const handleOpacity = (initialOpacity, newOpacity, duration) =>{
        animate({fromValue: initialOpacity,
            toValue: newOpacity,
            onUpdate: (newOpacity, callback)=>{
                dispatch({type:'CHANGE/OPACITY', payload: newOpacity});
                callback();
            },
            onComplete: ()=>{},
            duration: duration,
            easeMethod: easeMethod

        })
    }
    const handleRotation = (currentRotation, duration) =>{
        const newRotation = Math.random() *15 * (Math.round(Math.random())? 1: -1)
        animate({fromValue: currentRotation,
            toValue: newRotation,
            onUpdate: (newRotation, callback)=>{
                dispatch({type:'CHANGE/ROTATION', payload: newRotation});
                callback();
            },
            onComplete: ()=>{},
            duration: duration,
            easeMethod: easeMethod

        })
    }
    const handleScale = (intialScale, newScale, duration) =>{
        animate({fromValue: intialScale,
            toValue: newScale,
            onUpdate: (newOpacity, callback)=>{
                dispatch({type:'CHANGE/SCALE', payload: newScale});
                callback();
            },
            onComplete: ()=>{},
            duration: duration,
            easeMethod: easeMethod

        })
    }
    const handleMouseLeave = () => {
        handleOpacity(1,0,700);
        handleScale(1,initialState.scale,500);
        handleRotation(state.rotationPosition, 500)

        listItem.current.removeEventListener("mousemove", parallax)
        dispatch({type:'MOUSE/COORDINATES',payload:initialState.parallaxPos})
        dispatch({type:'MOUSE/LEAVE'})

    }
    return(
        <li className="project-item-container" ref={listItem}>
            <Title title={project.title} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
            <Image url={project.url} opacity={state.opacity} scale={state.scale} parallaxPos={state.parallaxPos} rotationPosition={state.rotationPosition}/>
            <div className={cn("info-block",{'as-active':state.active})}>
                <p className="info-block-header">
                    <span>
                        <Hash /> 0 {itemIndex}
                    </span>
                </p>
                {project.info.map((element)=>(
                    <p key={element}><span>{element}</span></p>
                ))}
            </div>
        </li>
    )
}