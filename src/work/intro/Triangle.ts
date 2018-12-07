class WrokWithTriangle extends HomeWork {
    public readonly vertices = [
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.0, 0.5, 0.0
    ]
    public async  init() {
        let gl = this.work.gl;
        let program = gl.createProgram();
        let vert = await $.get('./glsl/def.vert');
        let frag = await $.get('./glsl/def.frag');

        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, vert);
        gl.shaderSource(fragmentShader, frag);

        // console.log(vertexShader,fragmentShader);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(vertexShader);
            throw info;
        }
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            var info = gl.getShaderInfoLog(fragmentShader);
            throw info;
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(program);
            throw 'Could not compile WebGL program. \n\n' + info;
        }



        //glGenBuffers
        let VBO = gl.createBuffer();
        //glBindBuffer(GL_ARRAY_BUFFER, VBO);  
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        let v = new Float32Array(this.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);

        
        var aPos = gl.getAttribLocation(program, 'aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 3 * v.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(aPos);
        // gl.enableVertexAttribArray(0);
        // gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3*4, 0);
        // gl.bindAttribLocation(program,1,"v3Position");
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    public update() {

    }

    public destroy() {

    }
}