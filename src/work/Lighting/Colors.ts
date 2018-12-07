namespace Work.Lighting {
    export class Colors extends HomeWork {

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

        public shader: Shader;
        public lampshader: Shader;

        public width = 960;
        public height = 540;

        public program: WebGLProgram;


        public async init() {
            let gl = this.work.gl;
            this.lampshader = await Shader.create('./glsl/transfromations2.vert', './glsl/colors.lamp.frag', gl);
            let shader: Shader = this.shader = await Shader.create('./glsl/transfromations2.vert', './glsl/colors.frag', gl);

            let program = this.program = shader.ID;


            let VBO = this.VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            let v = new Float32Array(this.vertices);
            gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);

            var aPos = gl.getAttribLocation(program, 'aPos');
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 5 * v.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(aPos);

            var aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
            gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 5 * v.BYTES_PER_ELEMENT, 3 * v.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(aTexCoord);


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
        cameraSpeed = 0.2;

        lightPos = vec3.fromValues(1.0, 1.2, -2.0)

        public update() {
            let gl = this.work.gl;

            gl.enable(gl.DEPTH_TEST);

            gl.clearColor(0.2, 0.3, 0.3, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            this.angle++;
            // let transform = gl.getUniformLocation(this.program, 'transform');
            // let model = gl.getUniformLocation(this.program, 'model');
            // let view = gl.getUniformLocation(this.program, 'view');
            // let projection = gl.getUniformLocation(this.program, 'projection');

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

            //projection
            let promat = mat4.create();
            mat4.perspective(promat, 3.14 / 4, this.width / this.height, 0.1, 100.0)


            //view
            let viewmat = mat4.create();
            mat4.lookAt(viewmat, this.cameraPos, vec3.add(vec3.create(), this.cameraPos, this.cameraFront), this.cameraUp);



            //model
            let modelvec3 = vec3.fromValues(0, 0, 0);
            let modelmat = mat4.create();
            mat4.translate(modelmat, modelmat, modelvec3);
            this.shader.use();
            this.shader.setMat4('projection', promat);
            this.shader.setMat4('view', viewmat);
            this.shader.setMat4('model', modelmat);
            this.shader.setVec3('lightColor', vec3.fromValues(1, 1, 1));
            this.shader.setVec3('objectColor', vec3.fromValues(1, 0.5, 0.31));

            gl.drawArrays(gl.TRIANGLES, 0, 36);

            modelmat = mat4.create();
            mat4.translate(modelmat, modelmat, this.lightPos);
            mat4.scale(modelmat, modelmat, vec3.fromValues(0.3, 0.3, 0.3))
            this.lampshader.use();
            this.lampshader.setMat4('projection', promat);
            this.lampshader.setMat4('view', viewmat);
            this.lampshader.setMat4('model', modelmat);
            gl.drawArrays(gl.TRIANGLES, 0, 36);


        }
    }
}
