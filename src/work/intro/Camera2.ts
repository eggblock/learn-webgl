namespace Work.intro {
    export class Camera2 extends HomeWork {

        public readonly vertices = [
            -0.5, -0.5, -0.5, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            -0.5, 0.5, -0.5, 0.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 0.0,

            -0.5, -0.5, 0.5, 0.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 0.5, 1.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,

            -0.5, 0.5, 0.5, 1.0, 0.0,
            -0.5, 0.5, -0.5, 1.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,
            -0.5, 0.5, 0.5, 1.0, 0.0,

            0.5, 0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, 0.5, 0.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0,

            -0.5, -0.5, -0.5, 0.0, 1.0,
            0.5, -0.5, -0.5, 1.0, 1.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0,
            -0.5, -0.5, 0.5, 0.0, 0.0,
            -0.5, -0.5, -0.5, 0.0, 1.0,

            -0.5, 0.5, -0.5, 0.0, 1.0,
            0.5, 0.5, -0.5, 1.0, 1.0,
            0.5, 0.5, 0.5, 1.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0,
            -0.5, 0.5, 0.5, 0.0, 0.0,
            -0.5, 0.5, -0.5, 0.0, 1.0
        ];

        public readonly cubePositions = [
            vec3.fromValues(0.0, 0.0, 0.0),
            vec3.fromValues(2.0, 5.0, -15.0),
            vec3.fromValues(-1.5, -2.2, -2.5),
            vec3.fromValues(-3.8, -2.0, -12.3),
            vec3.fromValues(2.4, -0.4, -3.5),
            vec3.fromValues(-1.7, 3.0, -7.5),
            vec3.fromValues(1.3, -2.0, -2.5),
            vec3.fromValues(1.5, 2.0, -2.5),
            vec3.fromValues(1.5, 0.2, -1.5),
            vec3.fromValues(-1.3, 1.0, -1.5)
        ];

        public width = 960;
        public height = 540;

        public program: WebGLProgram;


        public async init() {
            let gl = this.work.gl;
            let program = this.program = gl.createProgram();
            let vert = await $.get('./glsl/transfromations2.vert');
            let frag = await $.get('./glsl/transfromations2.frag');

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

            // let EBO = this.EBO = gl.createBuffer();
            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
            // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indices), gl.STATIC_DRAW);

            var aPos = gl.getAttribLocation(program, 'aPos');
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 5 * v.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(aPos);

            // var aColor = gl.getAttribLocation(program, 'aColor');
            // gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 8 * v.BYTES_PER_ELEMENT, 3 * v.BYTES_PER_ELEMENT);
            // gl.enableVertexAttribArray(aColor);

            var aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
            gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 5 * v.BYTES_PER_ELEMENT, 3 * v.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(aTexCoord);


            var ourTexture = gl.getUniformLocation(program, 'ourTexture');

            let tex = this.tex = gl.createTexture();
            let img = await ImageUtils.load("/assets/cg001.jpg");






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

            WorkManager.getInstance().keydown("w", () => {
                this.key_status.w = true;
            });
            WorkManager.getInstance().keydown("a", () => {
                this.key_status.a = true;
            })
            WorkManager.getInstance().keydown("s", () => {
                this.key_status.s = true;
            })
            WorkManager.getInstance().keydown("d", () => {
                this.key_status.d = true;
            })

            WorkManager.getInstance().keyup("w", () => {
                this.key_status.w = false;
            });
            WorkManager.getInstance().keyup("a", () => {
                this.key_status.a = false;
            })
            WorkManager.getInstance().keyup("s", () => {
                this.key_status.s = false;
            })
            WorkManager.getInstance().keyup("d", () => {
                this.key_status.d = false;
            })
        }

        public key_status = {
            w: false,
            a: false,
            s: false,
            d: false
        }

        public tex;

        public started: boolean = false;

        public angle: number = 0;

        public VBO;



        public cameraPos = vec3.fromValues(0, 0, 3);
        public cameraFront = vec3.fromValues(0.0, 0.0, -1.0);
        public cameraUp = vec3.fromValues(0.0, 1.0, 0.0);
        cameraSpeed = 0.2

        public update() {
            let gl = this.work.gl;

            gl.useProgram(this.program);

            gl.enable(gl.DEPTH_TEST);
            // gl.enable(gl.CULL_FACE);
            gl.clearColor(0.2, 0.3, 0.3, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            this.angle++;
            // let transform = gl.getUniformLocation(this.program, 'transform');
            let model = gl.getUniformLocation(this.program, 'model');
            let view = gl.getUniformLocation(this.program, 'view');
            let projection = gl.getUniformLocation(this.program, 'projection');

            let promat = mat4.create();
            let viewmat = mat4.create();



            mat4.perspective(promat, 3.14 / 4, this.width / this.height, 0.1, 100.0)

            gl.uniformMatrix4fv(projection, false, promat);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);

            // let radius = 10.0;
            // let camX = Math.sin(this.angle / 100) * radius;
            // let camZ = Math.cos(this.angle / 100) * radius;

            if (this.key_status.w) {
                this.cameraPos[2] += this.cameraFront[2] * this.cameraSpeed;
            }

            if (this.key_status.s) {
                this.cameraPos[2] -= this.cameraFront[2] * this.cameraSpeed
            }

            if (this.key_status.a) {
                let v = vec3.create();
                vec3.cross(v, this.cameraFront, this.cameraUp);
                this.cameraPos[0] -= v[0] * this.cameraSpeed;
                this.cameraPos[1] -= v[1] * this.cameraSpeed;
                this.cameraPos[2] -= v[2] * this.cameraSpeed;
            }

            if (this.key_status.d) {
                let v = vec3.create();
                vec3.cross(v, this.cameraFront, this.cameraUp);
                this.cameraPos[0] += v[0] * this.cameraSpeed;
                this.cameraPos[1] += v[1] * this.cameraSpeed;
                this.cameraPos[2] += v[2] * this.cameraSpeed;
            }

            mat4.lookAt(viewmat, this.cameraPos, vec3.add(vec3.create(), this.cameraPos, this.cameraFront), this.cameraUp);
            gl.uniformMatrix4fv(view, false, viewmat);

            for (let i in this.cubePositions) {
                let modelvec3 = this.cubePositions[i];
                let modelmat = mat4.create();
                mat4.translate(modelmat, modelmat, modelvec3);
                mat4.rotate(modelmat, modelmat, this.angle * (~~i + 2) / 10 * Math.PI / 180, vec3.fromValues(0.05, 0.0, 0.05));
                gl.uniformMatrix4fv(model, false, modelmat);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
            }

        }
    }
}
