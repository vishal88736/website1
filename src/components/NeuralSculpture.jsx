import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Stylized continent outlines for an illustrative, code-drawn globe.
const CONTINENTS = [
  [[-17,37],[8,36],[16,32],[33,31],[35,23],[43,12],[51,11],[44,-12],[35,-23],[19,-35],[12,-22],[5,-4],[-4,5],[-15,12],[-17,23],[-13,31]],
  [[-11,36],[-9,44],[-4,48],[8,54],[12,58],[7,61],[10,71],[26,71],[33,61],[41,67],[64,73],[110,76],[145,70],[174,65],[168,57],[150,48],[142,38],[128,34],[122,25],[119,18],[106,7],[99,11],[95,23],[88,22],[80,7],[72,20],[67,25],[56,26],[50,13],[43,13],[35,30],[26,35],[21,40],[13,43],[4,43],[-2,36]],
  [[-168,72],[-140,70],[-130,56],[-124,49],[-124,40],[-117,32],[-108,24],[-100,17],[-86,19],[-80,8],[-76,9],[-84,23],[-81,30],[-75,37],[-61,48],[-54,53],[-68,61],[-100,75],[-140,73]],
  [[-81,12],[-68,10],[-51,4],[-35,-6],[-40,-22],[-52,-33],[-68,-55],[-75,-40],[-70,-18],[-81,-5]],
  [[113,-22],[121,-17],[131,-11],[141,-13],[153,-26],[151,-36],[135,-39],[115,-34]],
  [[-52,60],[-42,63],[-22,74],[-26,82],[-48,84],[-63,76],[-60,66]],
  [[46,-13],[50,-16],[49,-23],[44,-26],[43,-19]],
  [[130,31],[133,34],[140,41],[145,45],[142,36],[136,32]],
  [[95,5],[106,-6],[114,-8],[121,-8],[117,-3],[108,-2],[103,2]],
];
const STACK = ["ML", "RAG", "Agentic AI", "LLM", "DL", "LLMOps"];
const RAD = Math.PI / 180;

function onLand(lon, lat) {
  return CONTINENTS.some(polygon => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  });
}
function spherical(lat, lon, radius = 1) {
  return { x: Math.cos(lat * RAD) * Math.sin(lon * RAD) * radius, y: -Math.sin(lat * RAD) * radius, z: Math.cos(lat * RAD) * Math.cos(lon * RAD) * radius };
}

export default function NeuralSculpture({ theme, palette }) {
  const canvasRef = useRef(null);
  const chipRefs = useRef([]);
  const pointer = useRef({ x: 0, y: 0 });
  const turn = useRef(0);
  const drag = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0, height = 0, frame, visible = true, lastFrame = 0;
    let smoothX = 0, smoothY = 0;
    const started = performance.now();
    const light = theme === "light";
    const styles = getComputedStyle(document.documentElement);
    function rgb(variable) {
      const hex = styles.getPropertyValue(variable).trim().replace("#", "");
      return [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16)).join(",");
    }
    const accent = rgb("--accent");
    const bright = rgb("--accent-bright");
    const secondary = rgb("--mint");
    const background = rgb("--bg");
    const points = [];
    const count = 7600;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - ((i + 0.5) / count) * 2;
      const lat = Math.asin(y) / RAD;
      const lon = ((i * goldenAngle / RAD) % 360) - 180;
      points.push({ ...spherical(lat, lon), land: onLand(lon, lat) });
    }

    const grid = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      grid.push(Array.from({ length: 121 }, (_, i) => spherical(lat, -180 + i * 3)));
    }
    for (let lon = -180; lon < 180; lon += 30) {
      grid.push(Array.from({ length: 61 }, (_, i) => spherical(-90 + i * 3, lon)));
    }
    const hubs = [[21,81],[51,0],[40,-74],[37,-122],[1,104],[35,139],[-33,151],[-23,-46]].map(([lat,lon]) => spherical(lat,lon));
    const arcs = hubs.slice(1).map(destination => {
      const origin = hubs[0];
      const angle = Math.acos(Math.min(1, Math.max(-1, origin.x * destination.x + origin.y * destination.y + origin.z * destination.z)));
      const denominator = Math.sin(angle);
      return Array.from({ length: 49 }, (_, i) => {
        const t = i / 48;
        const a = Math.sin((1-t)*angle)/denominator;
        const b = Math.sin(t*angle)/denominator;
        const elevation = 1.018 + Math.sin(t*Math.PI) * 0.16;
        return { x: (origin.x*a+destination.x*b)*elevation, y: (origin.y*a+destination.y*b)*elevation, z: (origin.z*a+destination.z*b)*elevation };
      });
    });

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    }

    function draw(elapsed) {
      if (!width || !height) return;
      ctx.clearRect(0,0,width,height);
      const time = reduced ? 0 : Math.max(0, elapsed);
      smoothX += (pointer.current.x - smoothX) * 0.055;
      smoothY += (pointer.current.y - smoothY) * 0.055;
      const rotation = -0.67 + time * 0.000045 + turn.current + smoothX * 0.2;
      const tilt = -0.13 + smoothY * 0.13;
      const cy = Math.cos(rotation), sy = Math.sin(rotation);
      const cx = Math.cos(tilt), sx = Math.sin(tilt);
      const radius = Math.min(width, height) * (width < 380 ? 0.29 : 0.318);
      const centerX = width / 2, centerY = height / 2;
      function project(point) {
        const x = point.x*cy + point.z*sy;
        const z = -point.x*sy + point.z*cy;
        const y = point.y*cx - z*sx;
        const depth = point.y*sx + z*cx;
        return { x: centerX+x*radius, y: centerY+y*radius, z: depth };
      }
      function path(vertices, opacity, color = accent, lineWidth = 0.6) {
        ctx.beginPath();
        let connected = false;
        for (const vertex of vertices) {
          const p = project(vertex);
          if (p.z < 0.03) { connected = false; continue; }
          if (connected) ctx.lineTo(p.x,p.y);
          else ctx.moveTo(p.x,p.y);
          connected = true;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(${color},${opacity})`;
        ctx.stroke();
      }

      // A softly shaded sphere keeps the silhouette clear in either appearance.
      const atmosphere = ctx.createRadialGradient(centerX,centerY,radius*.85,centerX,centerY,radius*1.2);
      atmosphere.addColorStop(0,`rgba(${accent},0)`);
      atmosphere.addColorStop(.5,`rgba(${accent},${light ? .055 : .075})`);
      atmosphere.addColorStop(1,`rgba(${accent},0)`);
      ctx.fillStyle = atmosphere;
      ctx.beginPath(); ctx.arc(centerX,centerY,radius*1.2,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = `rgba(${background},0.9)`;
      ctx.beginPath(); ctx.arc(centerX,centerY,radius,0,Math.PI*2); ctx.fill();
      const sphere = ctx.createRadialGradient(centerX-radius*.3,centerY-radius*.4,radius*.05,centerX,centerY,radius);
      sphere.addColorStop(0,`rgba(${accent},${light ? .08 : .085})`);
      sphere.addColorStop(.65,`rgba(${accent},${light ? .025 : .018})`);
      sphere.addColorStop(1,`rgba(${accent},${light ? .075 : .065})`);
      ctx.fillStyle = sphere;
      ctx.fill();
      grid.forEach(line => path(line, light ? 0.11 : 0.1));
      const dotSize = width < 380 ? 0.75 : 1;
      for (const point of points) {
        const p = project(point);
        if (p.z < 0) continue;
        const edgeFade = 0.25 + p.z*0.75;
        ctx.fillStyle = point.land ? `rgba(${p.z > .7 ? bright : accent},${(light ? .86 : .9)*edgeFade})` : `rgba(${accent},${.12*edgeFade})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,(point.land ? 1.12 : .55)*dotSize,0,Math.PI*2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(centerX,centerY,radius,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${accent},${light ? .2 : .23})`; ctx.lineWidth=.7; ctx.stroke();

      // Raised great-circle paths connect the network; signals travel along them.
      arcs.forEach((arc, i) => {
        path(arc, light ? .27 : .31, i % 2 ? secondary : accent, .75);
        const signal = project(arc[Math.floor(((time*.0001+i*.137)%1)*48)]);
        if (signal.z > .05) {
          ctx.fillStyle = `rgba(${i % 2 ? secondary : bright},0.95)`;
          ctx.shadowColor = `rgba(${accent},0.55)`; ctx.shadowBlur = reduced ? 0 : 6;
          ctx.beginPath(); ctx.arc(signal.x,signal.y,1.7*dotSize,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      hubs.forEach((hub, i) => {
        const p = project(hub);
        if (p.z < .05) return;
        const pulse = reduced ? 0.5 : (Math.sin(time*.0015+i)+1)/2;
        ctx.beginPath(); ctx.arc(p.x,p.y,4+pulse*4,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${accent},${.3-pulse*.2})`; ctx.lineWidth=.7; ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x,p.y,2.1*dotSize,0,Math.PI*2); ctx.fillStyle=`rgba(${bright},0.95)`; ctx.fill();
      });

      // The stack follows a tilted orbit, passing in front of and behind the globe.
      const orbitTilt = -0.25, co = Math.cos(orbitTilt), so = Math.sin(orbitTilt);
      const orbitX = radius*1.43, orbitY = radius*.49;
      ctx.beginPath();
      for (let i=0; i<=120; i++) {
        const angle=i/120*Math.PI*2;
        const x=Math.cos(angle)*orbitX, y=Math.sin(angle)*orbitY;
        const px=centerX+x*co-y*so, py=centerY+x*so+y*co;
        if (i === 0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.strokeStyle=`rgba(${accent},${light ? .23 : .26})`; ctx.lineWidth=.8; ctx.stroke();
      chipRefs.current.forEach((chip,i) => {
        if (!chip) return;
        const angle=i/STACK.length*Math.PI*2 - .4 + time*.000065;
        const x=Math.cos(angle)*orbitX, y=Math.sin(angle)*orbitY;
        const px=x*co-y*so, py=x*so+y*co;
        chip.style.transform=`translate(-50%,-50%) translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0)`;
        chip.style.zIndex=Math.sin(angle) > 0 ? "3" : "1";
        chip.style.opacity=Math.sin(angle) > 0 ? "1" : ".7";
      });
    }
    function tick(now) {
      if (visible && !document.hidden && now-lastFrame>32) { draw(now-started); lastFrame=now; }
      frame=requestAnimationFrame(tick);
    }
    const resizeObserver=new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver=new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; });
    visibilityObserver.observe(canvas);
    resize();
    if (!reduced) frame=requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); };
  },[theme,palette,reduced]);

  function endDrag(event) {
    drag.current = null;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return <div className="neural-art globe-art" role="img" aria-label="A rotating neural globe with illuminated continents, traveling connections, and orbiting machine learning, RAG, agentic AI, LLM, deep learning and LLMOps labels"
    onPointerDown={event => { if (reduced || event.pointerType!=="mouse") return; drag.current={x:event.clientX,offset:turn.current}; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.classList.add("is-dragging"); }}
    onPointerMove={event => { if (reduced || event.pointerType!=="mouse") return; const rect=event.currentTarget.getBoundingClientRect(); if (drag.current) turn.current=drag.current.offset+(event.clientX-drag.current.x)/rect.width*3; pointer.current={x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5}; }}
    onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={() => { pointer.current={x:0,y:0}; }}>
    <div className="neural-glow" /><div className="art-grid" />
    <svg className="globe-guide" viewBox="0 0 520 500" fill="none" aria-hidden="true"><circle cx="260" cy="250" r="212" strokeDasharray="2 9" /><path d="M260 18V35M260 465V482M22 250H39M481 250H498" /><path d="M95 90H105M100 85V95M415 410H425M420 405V415" /></svg>
    <canvas ref={canvasRef} aria-hidden="true" />
    <div className="globe-stack" aria-hidden="true">{STACK.map((label,i) => <span className="globe-chip" key={label} ref={element => { chipRefs.current[i]=element; }}><i />{label}</span>)}</div>
    <div className="art-caption"><span className="status-dot" /> A CONNECTED WORLD <span>001</span></div>
    <div className="art-spark"><Sparkles size={21} /></div>
    <span className="art-coordinate">FROM RESEARCH ↗ TO REALITY</span>
    <span className="globe-interaction">DRAG TO EXPLORE <span>↔</span></span>
  </div>;
}
