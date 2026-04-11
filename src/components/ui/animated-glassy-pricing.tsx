import React, { useRef, useEffect, useState } from 'react';
import { RippleButton } from "./multi-type-ripple-buttons";

// --- Internal Helper Components (Not exported) --- //

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const backgroundColor = [0.0, 0.0, 0.0];

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) { console.error("WebGL not supported"); return; }
    glRef.current = gl;

    const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff,vec2(0.,1.),5.,2.);
        len -= variation(diff,vec2(1.,0.),5.,2.);
        float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv = gl_FragCoord.xy/iResolution.xy;
        if(iResolution.x > 768.0) {
          uv.x *= 1.5; uv.x -= 0.25;
        } else {
          uv.x *= 1.0;
        }
        float mask = 0.0;
        float radius = .35;
        vec2 center = vec2(.5);
        mask += paintCircle(uv,center,radius,.035).r;
        mask += paintCircle(uv,center,radius-.018,.01).r;
        mask += paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime * 0.5)*uv;
        // More vibrant colors: Indigo, Cyan, Rose
        vec3 col1 = vec3(0.4, 0.2, 1.0); // Indigo
        vec3 col2 = vec3(0.0, 0.8, 1.0); // Cyan
        vec3 col3 = vec3(1.0, 0.2, 0.4); // Rose
        vec3 foregroundColor = mix(mix(col1, col2, v.x), col3, v.y);
        vec3 color=mix(uBackgroundColor,foregroundColor,mask);
        color=mix(color,vec3(1.),paintCircle(uv,center,radius,.035).r * 0.5); 
        gl_FragColor=vec4(color,1.);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compilation error");
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) throw new Error("Could not create program");
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(program, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let animationFrameId: number;
    const render = (time: number) => {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full block z-[-1] pointer-events-none" />;
};


// --- EXPORTED Building Blocks --- //

/**
 * We export the Props interface so you can easily type the data for your plans.
 */
export interface PricingCardProps {
  planName: string;
  description?: string;
  price: string;
  originalPrice?: string;
  yearlyPrice?: string;
  billingSubtext?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
  onClick?: () => void;
}

/**
 * We export the PricingCard component itself in case you want to use it elsewhere.
 */
export const PricingCard = ({
  planName, description, price, originalPrice, billingSubtext, features, buttonText, isPopular = false, buttonVariant = 'primary', onClick
}: PricingCardProps) => {
  const cardClasses = `
    backdrop-blur-[16px] bg-gradient-to-br rounded-2xl shadow-2xl flex-1 max-w-xs px-7 py-8 flex flex-col transition-all duration-300
    from-white/[0.08] to-white/[0.02] border border-white/10
    ${isPopular ? 'scale-105 relative ring-2 ring-cyan-400/40 from-white/[0.12] to-white/[0.04] border-cyan-400/30 z-10 shadow-cyan-500/10' : ''}
    hover:border-white/20 hover:from-white/[0.12]
  `;
  const buttonClasses = `
    mt-auto w-full py-3 rounded-xl font-bold text-[14px] transition-all font-sans active:scale-95
    ${buttonVariant === 'primary' 
      ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-500/20' 
      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
    }
  `;

  return (
    <div className={cardClasses.trim()}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full bg-cyan-400 text-black shadow-lg shadow-cyan-500/30">
          Más Popular
        </div>
      )}
      <div className="mb-3">
        <h2 className="text-3xl font-bold tracking-tight text-white font-display">{planName}</h2>
        {description && <p className="text-sm text-white/50 mt-2 font-sans leading-relaxed">{description}</p>}
      </div>
      <div className="my-8 flex flex-col gap-1">
        {originalPrice && (
            <span className="text-sm text-white/30 line-through font-bold">{originalPrice}</span>
        )}
        <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white font-display">${price}</span>
            <span className="text-sm text-white/40 font-sans italic">{billingSubtext || "/mes"}</span>
        </div>
      </div>
      <div className="w-full mb-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <ul className="flex flex-col gap-3 text-sm text-white/70 mb-8 font-sans">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="size-5 rounded-full bg-cyan-400/10 flex items-center justify-center">
                <CheckIcon className="text-cyan-400 size-3" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      <RippleButton className={buttonClasses.trim()} onClick={onClick}>{buttonText}</RippleButton>
    </div>
  );
};


// --- EXPORTED Customizable Page Component --- //

interface ModernPricingPageProps {
  /** The main title. Can be a string or a ReactNode for more complex content. */
  title: React.ReactNode;
  /** The subtitle text appearing below the main title. */
  subtitle: React.ReactNode;
  /** An array of plan objects that conform to PricingCardProps. */
  plans: PricingCardProps[];
  /** Whether to show the animated WebGL background. Defaults to true. */
  showAnimatedBackground?: boolean;
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
  showAnimatedBackground = true,
}: ModernPricingPageProps) => {
  return (
    <div className="relative isolate py-24 w-full overflow-hidden" style={{ clipPath: 'inset(0)' }}>
      {showAnimatedBackground && <ShaderCanvas />}
      <div className="relative w-full z-10 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-5xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 font-display">
            {title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-sans font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 justify-center items-stretch w-full max-w-6xl">
          {plans.map(({ planName, ...planProps }) => (
            <PricingCard 
              key={planName} 
              planName={planName}
              {...planProps} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

