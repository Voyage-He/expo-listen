import {type ParentComponent, } from 'solid-js';
import { Portal } from 'solid-js/web';
// 	import { fade } from "svelte/transition";

export default ((props)=>{
  return <>
    <button 
      class="absolute top-0 left-0 w-screen h-screen bg-gray-500 opacity-50"
      onclick="{()=>history.back()}"
    ></button>
    <div class={`absolute top-0 left-0 w-screen h-4/5 bg-white ${others.class}`}>
      {@render children()}
    </div>
  </>
}) as ParentComponent;

//     let {children, ...others} = $props();


// <popup transition:fade>
//   <button 
//     class="absolute top-0 left-0 w-screen h-screen bg-gray-500 opacity-50"
//     aria-label="close"
//     onclick="{()=>history.back()}"
//   ></button>
//   <div class={`absolute top-0 left-0 w-screen h-4/5 bg-white ${others.class}`}>
//     {@render children()}
//   </div>
// </popup>
