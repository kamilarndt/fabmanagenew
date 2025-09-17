/**
 * WebGL Renderer for TimelineX
 * Provides hardware-accelerated rendering for smooth animations and large datasets
 */

import type { TimelineItem, TimelineGroup, TimelineViewport, TimelineTheme } from '../types';

export interface WebGLRendererOptions {
  antialias?: boolean;
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  failIfMajorPerformanceCaveat?: boolean;
}

export interface WebGLRenderState {
  items: TimelineItem[];
  groups: TimelineGroup[];
  viewport: TimelineViewport;
  theme: TimelineTheme;
  animationTime: number;
  isAnimating: boolean;
}

export class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private buffers: Map<string, WebGLBuffer> = new Map();
  private textures: Map<string, WebGLTexture> = new Map();
  private uniforms: Map<string, WebGLUniformLocation> = new Map();
  private attributes: Map<string, number> = new Map();
  private animationId: number | null = null;
  private renderState: WebGLRenderState;
  private options: WebGLRendererOptions;

  // Shader sources
  private vertexShaderSource = `#version 300 es
    precision highp float;
    
    in vec2 a_position;
    in vec2 a_texCoord;
    in vec4 a_color;
    in float a_progress;
    in float a_priority;
    
    uniform mat3 u_transform;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_zoom;
    
    out vec2 v_texCoord;
    out vec4 v_color;
    out float v_progress;
    out float v_priority;
    out float v_time;
    
    void main() {
      vec3 position = u_transform * vec3(a_position, 1.0);
      gl_Position = vec4(position.xy / u_resolution * 2.0 - 1.0, 0.0, 1.0);
      
      v_texCoord = a_texCoord;
      v_color = a_color;
      v_progress = a_progress;
      v_priority = a_priority;
      v_time = u_time;
    }
  `;

  private fragmentShaderSource = `#version 300 es
    precision highp float;
    
    in vec2 v_texCoord;
    in vec4 v_color;
    in float v_progress;
    in float v_priority;
    in float v_time;
    
    uniform sampler2D u_texture;
    uniform float u_animationSpeed;
    uniform float u_glowIntensity;
    
    out vec4 fragColor;
    
    // Animation functions
    float easeInOutCubic(float t) {
      return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    }
    
    float pulse(float time, float speed) {
      return 0.5 + 0.5 * sin(time * speed * 2.0 * 3.14159);
    }
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec4 baseColor = v_color;
      
      // Progress bar effect
      float progressWidth = v_progress * 1.0;
      float progressMask = step(v_texCoord.x, progressWidth);
      
      // Priority indicator (glow effect)
      float priorityGlow = v_priority > 0.5 ? 
        pulse(v_time * u_animationSpeed, 2.0) * u_glowIntensity : 0.0;
      
      // Animated border
      float borderAnimation = pulse(v_time * u_animationSpeed, 1.0);
      float borderWidth = 0.02 + 0.01 * borderAnimation;
      float isBorder = 1.0 - smoothstep(0.0, borderWidth, 
        min(min(v_texCoord.x, 1.0 - v_texCoord.x), 
            min(v_texCoord.y, 1.0 - v_texCoord.y)));
      
      // Combine effects
      vec3 finalColor = baseColor.rgb;
      
      // Add progress bar
      if (v_progress > 0.0) {
        vec3 progressColor = mix(baseColor.rgb, vec3(0.2, 0.8, 0.2), 0.7);
        finalColor = mix(finalColor, progressColor, progressMask);
      }
      
      // Add priority glow
      if (priorityGlow > 0.0) {
        vec3 glowColor = hsv2rgb(vec3(0.1, 0.8, 1.0));
        finalColor = mix(finalColor, glowColor, priorityGlow * 0.3);
      }
      
      // Add animated border
      if (isBorder > 0.0) {
        vec3 borderColor = mix(baseColor.rgb, vec3(1.0), 0.5);
        finalColor = mix(finalColor, borderColor, isBorder * borderAnimation);
      }
      
      fragColor = vec4(finalColor, baseColor.a);
    }
  `;

  constructor(canvas: HTMLCanvasElement, options: WebGLRendererOptions = {}) {
    this.canvas = canvas;
    this.options = {
      antialias: true,
      alpha: true,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
      ...options,
    };

    this.renderState = {
      items: [],
      groups: [],
      viewport: { start: 0, end: 1000, zoom: 1 },
      theme: { colors: {}, spacing: {}, typography: {} },
      animationTime: 0,
      isAnimating: false,
    };

    this.initWebGL();
  }

  private initWebGL(): void {
    const gl = this.canvas.getContext('webgl2', this.options);
    if (!gl) {
      throw new Error('WebGL2 not supported');
    }

    this.gl = gl;
    this.setupShaders();
    this.setupBuffers();
    this.setupUniforms();
    this.setupAttributes();
  }

  private setupShaders(): void {
    const gl = this.gl;

    // Create vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) throw new Error('Failed to create vertex shader');
    
    gl.shaderSource(vertexShader, this.vertexShaderSource);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new Error('Vertex shader compilation failed: ' + gl.getShaderInfoLog(vertexShader));
    }

    // Create fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) throw new Error('Failed to create fragment shader');
    
    gl.shaderSource(fragmentShader, this.fragmentShaderSource);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new Error('Fragment shader compilation failed: ' + gl.getShaderInfoLog(fragmentShader));
    }

    // Create program
    this.program = gl.createProgram();
    if (!this.program) throw new Error('Failed to create program');
    
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error('Program linking failed: ' + gl.getProgramInfoLog(this.program));
    }

    // Clean up shaders
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  private setupBuffers(): void {
    const gl = this.gl;
    
    // Create vertex buffer for items
    const itemBuffer = gl.createBuffer();
    if (!itemBuffer) throw new Error('Failed to create item buffer');
    this.buffers.set('items', itemBuffer);

    // Create index buffer
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) throw new Error('Failed to create index buffer');
    this.buffers.set('indices', indexBuffer);
  }

  private setupUniforms(): void {
    if (!this.program) return;
    
    const gl = this.gl;
    const uniforms = [
      'u_transform', 'u_time', 'u_resolution', 'u_zoom',
      'u_texture', 'u_animationSpeed', 'u_glowIntensity'
    ];

    uniforms.forEach(name => {
      const location = gl.getUniformLocation(this.program!, name);
      if (location) {
        this.uniforms.set(name, location);
      }
    });
  }

  private setupAttributes(): void {
    if (!this.program) return;
    
    const gl = this.gl;
    const attributes = [
      'a_position', 'a_texCoord', 'a_color', 'a_progress', 'a_priority'
    ];

    attributes.forEach(name => {
      const location = gl.getAttribLocation(this.program!, name);
      if (location >= 0) {
        this.attributes.set(name, location);
      }
    });
  }

  public updateState(state: Partial<WebGLRenderState>): void {
    this.renderState = { ...this.renderState, ...state };
  }

  public render(): void {
    if (!this.program) return;

    const gl = this.gl;
    const { items, viewport, animationTime } = this.renderState;

    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use program
    gl.useProgram(this.program);

    // Set uniforms
    this.setUniforms();

    // Prepare vertex data
    const vertices = this.prepareVertexData(items, viewport);
    const indices = this.prepareIndexData(items.length);

    // Upload data to GPU
    this.uploadVertexData(vertices);
    this.uploadIndexData(indices);

    // Draw
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  private setUniforms(): void {
    const gl = this.gl;
    const { viewport, animationTime } = this.renderState;

    // Transform matrix (viewport transformation)
    const transform = this.calculateTransformMatrix(viewport);
    gl.uniformMatrix3fv(this.uniforms.get('u_transform'), false, transform);

    // Time for animations
    gl.uniform1f(this.uniforms.get('u_time'), animationTime);

    // Resolution
    gl.uniform2f(this.uniforms.get('u_resolution'), this.canvas.width, this.canvas.height);

    // Zoom level
    gl.uniform1f(this.uniforms.get('u_zoom'), viewport.zoom);

    // Animation settings
    gl.uniform1f(this.uniforms.get('u_animationSpeed'), 1.0);
    gl.uniform1f(this.uniforms.get('u_glowIntensity'), 0.5);
  }

  private calculateTransformMatrix(viewport: TimelineViewport): Float32Array {
    const scaleX = viewport.zoom;
    const scaleY = 1.0;
    const translateX = -viewport.start * viewport.zoom;
    const translateY = 0;

    return new Float32Array([
      scaleX, 0, translateX,
      0, scaleY, translateY,
      0, 0, 1
    ]);
  }

  private prepareVertexData(items: TimelineItem[], viewport: TimelineViewport): Float32Array {
    const vertices: number[] = [];
    
    items.forEach(item => {
      const x = item.start;
      const y = item.lane || 0;
      const width = item.end - item.start;
      const height = 20; // Fixed height for now

      // Convert color to normalized values
      const color = this.parseColor(item.color || '#1677ff');
      const progress = item.progress || 0;
      const priority = item.priority || 0;

      // Create quad vertices (two triangles)
      const quadVertices = [
        // Top-left
        x, y, 0, 0, ...color, progress, priority,
        // Top-right
        x + width, y, 1, 0, ...color, progress, priority,
        // Bottom-right
        x + width, y + height, 1, 1, ...color, progress, priority,
        // Bottom-left
        x, y + height, 0, 1, ...color, progress, priority,
      ];

      vertices.push(...quadVertices);
    });

    return new Float32Array(vertices);
  }

  private prepareIndexData(itemCount: number): Uint16Array {
    const indices: number[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      const baseIndex = i * 4;
      // First triangle
      indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
      // Second triangle
      indices.push(baseIndex, baseIndex + 2, baseIndex + 3);
    }

    return new Uint16Array(indices);
  }

  private uploadVertexData(vertices: Float32Array): void {
    const gl = this.gl;
    const buffer = this.buffers.get('items');
    if (!buffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Set up vertex attributes
    const stride = 8 * 4; // 8 floats per vertex (position, texCoord, color, progress, priority)
    let offset = 0;

    // Position
    const posLoc = this.attributes.get('a_position');
    if (posLoc !== undefined) {
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, offset);
    }
    offset += 2 * 4;

    // Texture coordinates
    const texLoc = this.attributes.get('a_texCoord');
    if (texLoc !== undefined) {
      gl.enableVertexAttribArray(texLoc);
      gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, stride, offset);
    }
    offset += 2 * 4;

    // Color
    const colorLoc = this.attributes.get('a_color');
    if (colorLoc !== undefined) {
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, stride, offset);
    }
    offset += 4 * 4;

    // Progress
    const progressLoc = this.attributes.get('a_progress');
    if (progressLoc !== undefined) {
      gl.enableVertexAttribArray(progressLoc);
      gl.vertexAttribPointer(progressLoc, 1, gl.FLOAT, false, stride, offset);
    }
    offset += 1 * 4;

    // Priority
    const priorityLoc = this.attributes.get('a_priority');
    if (priorityLoc !== undefined) {
      gl.enableVertexAttribArray(priorityLoc);
      gl.vertexAttribPointer(priorityLoc, 1, gl.FLOAT, false, stride, offset);
    }
  }

  private uploadIndexData(indices: Uint16Array): void {
    const gl = this.gl;
    const buffer = this.buffers.get('indices');
    if (!buffer) return;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
  }

  private parseColor(color: string): [number, number, number, number] {
    // Simple color parser - assumes hex colors
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    return [r, g, b, 1.0];
  }

  public startAnimation(): void {
    if (this.animationId) return;
    
    this.renderState.isAnimating = true;
    this.animate();
  }

  public stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.renderState.isAnimating = false;
  }

  private animate = (): void => {
    this.renderState.animationTime += 0.016; // ~60fps
    this.render();
    
    if (this.renderState.isAnimating) {
      this.animationId = requestAnimationFrame(this.animate);
    }
  };

  public resize(width: number, height: number): void {
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public dispose(): void {
    this.stopAnimation();
    
    // Clean up WebGL resources
    this.buffers.forEach(buffer => this.gl.deleteBuffer(buffer));
    this.textures.forEach(texture => this.gl.deleteTexture(texture));
    
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
    
    this.buffers.clear();
    this.textures.clear();
    this.uniforms.clear();
    this.attributes.clear();
  }
}

