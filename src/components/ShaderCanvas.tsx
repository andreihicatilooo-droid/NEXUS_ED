import React, { useEffect, useRef } from 'react';

interface Props {
  imageUrl: string;
  shaderMode: 'normal' | 'glitch' | 'neon';
  time: number;
}

const VERTEX_SHADER = `
  attribute vec2 position;
  attribute vec2 texcoord;
  varying vec2 v_texcoord;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    v_texcoord = texcoord;
  }
`;

const FRAGMENT_SHADERS = {
  normal: `
    precision mediump float;
    varying vec2 v_texcoord;
    uniform sampler2D u_image;
    void main() {
      gl_FragColor = texture2D(u_image, v_texcoord);
    }
  `,
  glitch: `
    precision mediump float;
    varying vec2 v_texcoord;
    uniform sampler2D u_image;
    uniform float u_time;
    void main() {
      vec2 p = v_texcoord;
      float noise = fract(sin(dot(p.yy, vec2(12.9898, 78.233)) + u_time) * 43758.5453) * 0.02;
      float shift = sin(p.y * 10.0 + u_time * 5.0) * 0.01 + noise;
      vec4 c = texture2D(u_image, vec2(p.x + shift, p.y));
      c.r = texture2D(u_image, vec2(p.x + shift + 0.015, p.y)).r;
      c.b = texture2D(u_image, vec2(p.x + shift - 0.015, p.y)).b;
      
      // scanlines
      c *= 0.9 + 0.1 * sin(p.y * 200.0);
      gl_FragColor = c;
    }
  `,
  neon: `
    precision mediump float;
    varying vec2 v_texcoord;
    uniform sampler2D u_image;
    uniform float u_time;
    void main() {
       vec2 d = vec2(0.005, 0.005);
       vec4 c0 = texture2D(u_image, v_texcoord);
       vec4 c1 = texture2D(u_image, v_texcoord + vec2(d.x, 0.0));
       vec4 c2 = texture2D(u_image, v_texcoord + vec2(0.0, d.y));
       
       float edge = length((c1 - c0) + (c2 - c0));
       edge = smoothstep(0.0, 0.5, edge);
       
       float t = u_time * 2.0;
       vec3 neonColor = vec3(0.0, 1.0, 1.0) * sin(t) + vec3(1.0, 0.0, 1.0) * cos(t);
       neonColor = abs(neonColor);
       
       gl_FragColor = vec4(mix(c0.rgb * 0.2, neonColor, edge), 1.0);
    }
  `
};

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderCanvas({ imageUrl, shaderMode, time }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<{ gl: WebGLRenderingContext, programMap: Record<string, WebGLProgram>, tex: WebGLTexture } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Init programs mapping
      const programMap: Record<string, WebGLProgram> = {};
      const vShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      
      for (const [mode, fSrc] of Object.entries(FRAGMENT_SHADERS)) {
        const fShader = createShader(gl, gl.FRAGMENT_SHADER, fSrc);
        const program = gl.createProgram();
        if (vShader && fShader && program) {
          gl.attachShader(program, vShader);
          gl.attachShader(program, fShader);
          gl.linkProgram(program);
          programMap[mode] = program;
        }
      }

      // Generate buffers
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,   1.0, -1.0,   -1.0,  1.0,
        -1.0,  1.0,   1.0, -1.0,    1.0,  1.0
      ]), gl.STATIC_DRAW);

      const texcoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
         0.0,  1.0,   1.0,  1.0,    0.0,  0.0,
         0.0,  0.0,   1.0,  1.0,    1.0,  0.0
      ]), gl.STATIC_DRAW);

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      cacheRef.current = { gl, programMap, tex };
    };
  }, [imageUrl]);

  // Render loop
  useEffect(() => {
    let handle: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const cache = cacheRef.current;
      if (cache) {
        const { gl, programMap, tex } = cache;
        const program = programMap[shaderMode];
        if (program) {
          gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(program);

          const posLocation = gl.getAttribLocation(program, "position");
          gl.enableVertexAttribArray(posLocation);
          const texcoordLocation = gl.getAttribLocation(program, "texcoord");
          gl.enableVertexAttribArray(texcoordLocation);

          const timeLoc = gl.getUniformLocation(program, "u_time");
          gl.uniform1f(timeLoc, (now - startTime) * 0.001);

          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      }
      handle = requestAnimationFrame(render);
    };
    handle = requestAnimationFrame(render);
    return () => cancelAnimationFrame(handle);
  }, [shaderMode]);

  return (
    <canvas ref={canvasRef} className="w-full h-full object-contain bg-transparent rounded-xl" />
  );
}
