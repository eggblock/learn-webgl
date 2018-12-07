class WorkWithTransformations extends HomeWork {

    public readonly vertices = [
        0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,   // 右上
        0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0,   // 右下
        -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,   // 左下
        -0.5, 0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0 // 左上
    ]

    public readonly texCoords = [
        0.0, 0.0,
        1.0, 0.0,
        0.5, 1.0
    ];

    public readonly indices = [
        0, 1, 2,
        0, 3, 2
    ];

    public program: WebGLProgram;


    public async init() {
        let gl = this.work.gl;
        let program = this.program = gl.createProgram();
        let vert = await $.get('./glsl/transfromations.vert');
        let frag = await $.get('./glsl/Tex.frag');

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


        let VBO = this.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        let v = new Float32Array(this.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);

        let EBO = this.EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.STATIC_DRAW);

        var aPos = gl.getAttribLocation(program, 'aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 8 * v.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(aPos);

        var aColor = gl.getAttribLocation(program, 'aColor');
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 8 * v.BYTES_PER_ELEMENT, 3 * v.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aColor);

        var aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 8 * v.BYTES_PER_ELEMENT, 6 * v.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(aTexCoord);


        var ourTexture = gl.getUniformLocation(program, 'ourTexture');

        let tex = this.tex = gl.createTexture();
        let img = await ImageUtils.load("/assets/1.png");






        gl.useProgram(program);





        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);

        //一系列tex处理阐述
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        //texture bound to texture unit 0 is not renderable. It maybe non-power-of-2 and have incompatible texture filtering.
        //因为材质图默认很多图片不是所谓的标准尺寸，2^n这种 需要拉伸
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.uniform1i(ourTexture, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 8);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_BYTE, 0);


    }

    public tex;

    public started: boolean = false;

    public angle: number = 0;

    public VBO;
    public EBO;

    public update() {
        let gl = this.work.gl;
        gl.useProgram(this.program);
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        this.angle++;
        let transform = gl.getUniformLocation(this.program, 'transform');
        let mat = mat4.create();
        let m2 = mat4.create();
        // let m3 = mat4.create();
        // mat4.identity(mat);
        
        mat4.rotateZ(m2, mat, this.angle * Math.PI / 180);
        // mat4.rotateX(m3, m2, this.angle * Math.PI / 180);

        // let m4 = mat4.perspective(m3, glMatrix.toRadian(45.0 / 180.0), 1, 0.1, 100);
        // console.log(m2);
        gl.uniformMatrix4fv(transform, false, m2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_BYTE, 0);
    }
}