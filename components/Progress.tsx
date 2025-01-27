import { createEffect, createSignal, type Component } from "solid-js";

export default (({ progress, onSeekTo }) => {
  let [dragging, setDragging] = createSignal(false); // 标记是否正在拖动
  let ref: HTMLDivElement | undefined = undefined;
  let [seekProgress, setSeekProgress] = createSignal(progress);
  let progressValue = ()=>((dragging() ? seekProgress() : progress) * 100);

  createEffect(() => {
    if (dragging()) {
      console.log("trigger bound");
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }
    else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    }
  })

  function handleStart(event: MouseEvent | TouchEvent) {
      console.log("start")
      setSeekProgress(progress);
      setDragging(true);
  }

  function handleMove(event: MouseEvent | TouchEvent) {
      if (!dragging() || !ref) {
          return;
      }

      const rect = ref.getBoundingClientRect();
      const offsetX = 
          event instanceof MouseEvent ? 
              Math.min(Math.max(0, event.clientX - rect.left), rect.width): 
              Math.min(Math.max(0, event.touches[0].clientX - rect.left), rect.width);
      setSeekProgress(offsetX / rect.width);
      // console.log("progress:"+ progress);
  }

  function handleEnd(event: MouseEvent | TouchEvent) {
      console.log("end")
      setDragging(false);
      onSeekTo(seekProgress());
  }

  return (
    <div ref={ref} class="relative w-full h-2 bg-gray-300 rounded">
      {/* <div
        class="h-full bg-blue-500 rounded"
        style={{width: `${progressValue()}%`}}>
      </div>
      <div
        onmousedown={handleStart}
        ontouchstart={handleStart}
        class="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-pointer"
        style={{left: `${progressValue()}%`}}>
      </div> */}
    </div>
  );
}) as Component<{ progress: number, onSeekTo (position: number): void }>

