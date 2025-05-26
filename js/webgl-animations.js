/**
 * Monochrome WebGL Animations
 * Mathematical patterns and animations for gamedev-details page
 */

class WebGLAnimations {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.init();
    this.animate();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  init() {
    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying highp vec2 vTextureCoord;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;
    
    // Fragment shader program
    const fsSource = `
      precision mediump float;
      
      varying highp vec2 vTextureCoord;
      
      uniform float uTime;
      uniform vec2 uResolution;
      
      // Mathematical pattern generation
      float pattern(vec2 p, float time) {
        // Create a grid pattern
        vec2 grid = fract(p * 10.0) - 0.5;
        
        // Create a wave effect
        float wave = sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time) * 0.25;
        
        // Create a circular pattern
        float circle = length(p - vec2(0.5 + 0.3 * sin(time * 0.5), 0.5 + 0.3 * cos(time * 0.5)));
        circle = smoothstep(0.2, 0.21, circle) * smoothstep(0.4, 0.39, circle);
        
        // Combine patterns
        return mix(wave, circle, 0.5 + 0.5 * sin(time * 0.2));
      }
      
      void main() {
        // Normalize coordinates
        vec2 uv = vTextureCoord;
        
        // Calculate pattern value
        float value = pattern(uv, uTime);
        
        // Create monochrome color
        vec3 color = vec3(value);
        
        // Adjust contrast and brightness
        color = smoothstep(0.1, 0.9, color);
        
        // Output color
        gl_FragColor = vec4(color, 0.2);
      }
    `;
    
    // Initialize shaders
    const shaderProgram = this.initShaderProgram(vsSource, fsSource);
    
    // Collect all shader program info
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        time: this.gl.getUniformLocation(shaderProgram, 'uTime'),
        resolution: this.gl.getUniformLocation(shaderProgram, 'uResolution'),
      },
    };
    
    // Initialize buffers
    this.buffers = this.initBuffers();
    
    // Set clear color to white for light mode
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // Initialize time
    this.startTime = Date.now();
  }
  
  initBuffers() {
    // Create position buffer for a full-screen quad
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );
    
    // Create texture coordinate buffer
    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    
    const textureCoordinates = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ];
    
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      this.gl.STATIC_DRAW
    );
    
    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
    };
  }
  
  initShaderProgram(vsSource, fsSource) {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);
    
    // Create the shader program
    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);
    
    // Check if shader program was created successfully
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    
    return shaderProgram;
  }
  
  loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    // Check if shader compiled successfully
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }
  
  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Calculate time
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000; // Convert to seconds
    
    // Use shader program
    this.gl.useProgram(this.programInfo.program);
    
    // Set uniforms
    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    
    mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0.1, 100);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -1.0]);
    
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );
    
    // Set time uniform
    this.gl.uniform1f(this.programInfo.uniformLocations.time, elapsedTime);
    
    // Set resolution uniform
    this.gl.uniform2f(
      this.programInfo.uniformLocations.resolution,
      this.canvas.width,
      this.canvas.height
    );
    
    // Set up position attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      2, // 2 components per vertex
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
    
    // Set up texture coordinate attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureCoord);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.textureCoord,
      2, // 2 components per vertex
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
    
    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}

// Create second animation class for different patterns
class MonochromePatterns {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.init();
    this.animate();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  init() {
    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying highp vec2 vTextureCoord;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;
    
    // Fragment shader program for geometric patterns
    const fsSource = `
      precision mediump float;
      
      varying highp vec2 vTextureCoord;
      
      uniform float uTime;
      uniform vec2 uResolution;
      
      // Function to create geometric patterns
      float geometricPattern(vec2 p, float time) {
        // Create grid lines
        vec2 grid = abs(fract(p * 10.0) - 0.5);
        float lines = min(grid.x, grid.y);
        
        // Add movement
        float movement = sin(time * 0.5 + p.x * 5.0) * cos(time * 0.3 + p.y * 3.0) * 0.1;
        
        // Create concentric circles
        float dist = length(p - vec2(0.5));
        float circles = abs(sin(dist * 20.0 - time));
        
        // Combine patterns
        return mix(lines, circles, 0.5 + 0.5 * sin(time * 0.1)) + movement;
      }
      
      void main() {
        // Normalize coordinates
        vec2 uv = vTextureCoord;
        
        // Calculate pattern value
        float value = geometricPattern(uv, uTime);
        
        // Create monochrome color (dark gray for light mode)
        vec3 color = vec3(0.2) * value;
        
        // Output color with transparency
        gl_FragColor = vec4(color, 0.15);
      }
    `;
    
    // Initialize shaders
    const shaderProgram = this.initShaderProgram(vsSource, fsSource);
    
    // Collect all shader program info
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: this.gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        time: this.gl.getUniformLocation(shaderProgram, 'uTime'),
        resolution: this.gl.getUniformLocation(shaderProgram, 'uResolution'),
      },
    };
    
    // Initialize buffers
    this.buffers = this.initBuffers();
    
    // Set clear color to transparent for overlaying
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // Initialize time
    this.startTime = Date.now();
  }
  
  initBuffers() {
    // Create position buffer for a full-screen quad
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );
    
    // Create texture coordinate buffer
    const textureCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
    
    const textureCoordinates = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ];
    
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      this.gl.STATIC_DRAW
    );
    
    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
    };
  }
  
  initShaderProgram(vsSource, fsSource) {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);
    
    // Create the shader program
    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);
    
    // Check if shader program was created successfully
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    
    return shaderProgram;
  }
  
  loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    // Check if shader compiled successfully
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }
  
  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Calculate time
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000; // Convert to seconds
    
    // Use shader program
    this.gl.useProgram(this.programInfo.program);
    
    // Set uniforms
    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    
    mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0.1, 100);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -1.0]);
    
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );
    
    // Set time uniform
    this.gl.uniform1f(this.programInfo.uniformLocations.time, elapsedTime);
    
    // Set resolution uniform
    this.gl.uniform2f(
      this.programInfo.uniformLocations.resolution,
      this.canvas.width,
      this.canvas.height
    );
    
    // Set up position attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      2, // 2 components per vertex
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
    
    // Set up texture coordinate attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureCoord);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.textureCoord,
      2, // 2 components per vertex
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
    
    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}

// Initialize animations when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load gl-matrix library dynamically
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js';
  script.onload = () => {
    // Initialize animations after library is loaded
    if (document.getElementById('bg-canvas')) {
      new WebGLAnimations('bg-canvas');
    }
    
    if (document.getElementById('pattern-canvas')) {
      new MonochromePatterns('pattern-canvas');
    }
  };
  document.head.appendChild(script);
});
