(function (global) {

  var canvas, gl, program;

  glUtils.SL.init({
    callback: function () {
      main();
    }
  });

  function main() {
    // Register Callbacks
    window.addEventListener('resize', resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  var mat = {
    translation: function (tx, ty) {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        tx, ty, 1, 0,
        0, 0, 0, 1
      ];
    },

    rotation: function (angleInRadians) {
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
      ];
    },

    scaling: function (sx, sy) {
      return [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1,
      ];
    },

    multiply_4: function (a, b){
      var c = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          c[i*4+j]= 0;
          for (let k = 0; k < 4; k++) {
            c[i*4+j] += a[j+k*4]*b[i+k*4];
          }
        }   
      }
      return c;
      // -0.9876883625984192, 0.15643446147441864, 0, 0, 
      // -0.15643446147441864, -0.9876883625984192, 0, 0, 
      // 0, 0, 1, 0, 
      // 0.4938441812992096, -0.07821723073720932, 0, 1
    },

    multiply: function (a, b) {
      var a00 = a[0 * 3 + 0];
      var a01 = a[0 * 3 + 1];
      var a02 = a[0 * 3 + 2];
      var a10 = a[1 * 3 + 0];
      var a11 = a[1 * 3 + 1];
      var a12 = a[1 * 3 + 2];
      var a20 = a[2 * 3 + 0];
      var a21 = a[2 * 3 + 1];
      var a22 = a[2 * 3 + 2];
      var b00 = b[0 * 3 + 0];
      var b01 = b[0 * 3 + 1];
      var b02 = b[0 * 3 + 2];
      var b10 = b[1 * 3 + 0];
      var b11 = b[1 * 3 + 1];
      var b12 = b[1 * 3 + 2];
      var b20 = b[2 * 3 + 0];
      var b21 = b[2 * 3 + 1];
      var b22 = b[2 * 3 + 2];
      return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
      ];
    },
  };

  var ANGLE = 0;
  var ANGLE2 = 0;

  // draw!
  function draw() {
    // Bersihkan layar jadi hitam
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Write the positions of vertices to a vertex shader
    // drawPoint();
    // drawLine();
    // drawTriangle();

    var AOuterVertices = new Float32Array([
      -0.4, -0.9, -0.1, 0.9, 0.1, 0.9, 0.4, -0.9, 0.2, -0.9, 0.1, -0.3, -0.1, -0.3, -0.2, -0.9
    ]);
    var AInnerVertices = new Float32Array([
        0.08, 0, -0.08, 0, 0, 0.5
    ]);

    var ABoldOuterVertices = new Float32Array([
      -0.4, -0.9, -0.1, 0.9, -0.2, -0.9, -0.1, 0.9, -0.2, -0.9, 0, 0.5, 0.1, 0.9, -0.1, 0.9, 0, 0.5, 0, 0.5, 0.4, -0.9, 0.1, 0.9, 0, 0.5, 0.4, -0.9, 0.2, -0.9, 0.08, 0, -0.08, 0, 0.2, -0.4, 0.2, -0.3, -0.2, -0.3, -0.08, 0
    ]);

    // for (let i = 0; i < ABoldOuterVertices.length; i++) {
    //   if (i % 2 == 0)
    //     ABoldOuterVertices[i] += 0.5;
    // }
    // console.log(ABoldOuterVertices);

    var tMatrixLocation = gl.getUniformLocation(program, "t_matrix");
    var rMatrixLocation = gl.getUniformLocation(program, "r_matrix");
    
    ANGLE2 += 3;
    var radian = Math.PI * ANGLE2 / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var rotationMatrix = new Float32Array([
      cosB, +sinB, 0, 0,
      -sinB, cosB, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
    
    var translationMatrix = new Float32Array([
      1.0, 0.0, 0.0, 0.5,   // dx = 0.5
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);

    // Set the matrix.
    gl.uniformMatrix4fv(tMatrixLocation, false, translationMatrix);
    gl.uniformMatrix4fv(rMatrixLocation, false, rotationMatrix);

    drawA(gl.TRIANGLES, ABoldOuterVertices);

    ANGLE += 1;
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    rotationMatrix = new Float32Array([
      cosB, +sinB, 0, 0,
      -sinB, cosB, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
    
    translationMatrix = new Float32Array([
      1.0, 0.0, 0.0, -0.5,   // dx = 0.5
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ]);

    console.log(mat.multiply_4(rotationMatrix, translationMatrix));

    // Set the matrix.
    gl.uniformMatrix4fv(tMatrixLocation, false, translationMatrix);
    gl.uniformMatrix4fv(rMatrixLocation, false, rotationMatrix);

    drawA(gl.LINE_LOOP, AOuterVertices);
    drawA(gl.LINE_LOOP, AInnerVertices);

    requestAnimationFrame(draw);
  }

  // function drawPoint() {
  //   var n = initPointBuffers();
  //   if (n < 0) {
  //     console.log('Failed to set the positions of the vertices');
  //     return;
  //   }
  //   gl.drawArrays(gl.POINTS, 0, n);
  // }

  function initPointBuffers() {
    var vertices = new Float32Array([
      -0.5, -0.5
    ]);
    var n = 1;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  // function drawLine() {
  //   var n = initLineBuffers();
  //   if (n < 0) {
  //     console.log('Failed to set the positions of the vertices');
  //     return;
  //   }
  //   gl.drawArrays(gl.LINES, 0, n);
  // }

  function initLineBuffers() {
    var vertices = new Float32Array([
      -0.25, -0.25, -0.25, +0.5
    ]);
    var n = 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  // function drawTriangle() {
  //   var n = initTriangleBuffers();
  //   if (n < 0) {
  //     console.log('Failed to set the positions of the vertices');
  //     return;
  //   }
  //   gl.drawArrays(gl.TRIANGLES, 0, n);
  // }

  function initTriangleBuffers() {
    var vertices = new Float32Array([
      +0.5, -0.5, 0.0, 0.0, +0.5, 0.0
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  // Generic format
  function drawA(type, vertices) {
    var n = initBuffers(vertices);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(type, 0, n);
  }

  function initBuffers(vertices) {
    var n = vertices.length / 2;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    if (aPosition < 0) {
      console.log('Failed to get the storage location of aPosition');
      return -1;
    }

    // Translation!
    // // var translation = [0, 0, 0, 0];
    // var translationLocation = gl.getUniformLocation(program, "u_translation");
    // var translation = [+0.25, 0];
    // var uTranslation = gl.getUniformLocation(program, 'uTranslation');
    // var uniform = gl.getUniform(program, uTranslation);
    // gl.uniform4f(uTranslation, translation);    

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw();
  }

})(window || this);