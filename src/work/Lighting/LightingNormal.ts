namespace Work.Lighting {
    export class LightingNormal extends HomeWork {

        public readonly vertices = [
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, -0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            -0.5, 0.5, -0.5, 0.0, 0.0, -1.0,
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0,

            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, -0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,

            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,
            -0.5, 0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0,
            -0.5, -0.5, 0.5, -1.0, 0.0, 0.0,
            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0,

            0.5, 0.5, 0.5, 1.0, 0.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
            0.5, -0.5, 0.5, 1.0, 0.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0, 0.0,

            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, -0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            -0.5, -0.5, 0.5, 0.0, -1.0, 0.0,
            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0,

            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0
        ];

        public shader: Shader;
        public lampshader: Shader;

        public width = 960;
        public height = 540;

        public program: WebGLProgram;

        public pointer: boolean = true;


        public async init() {
            let gl = this.work.gl;
            this.lampshader = await Shader.create('./glsl/transfromations2.vert', './glsl/colors.lamp.frag', gl);
            let shader: Shader = this.shader = await Shader.create('./glsl/lighting/lighting.normal.vert', './glsl/lighting/lighting.normal.frag', gl);

            let program = this.program = shader.ID;


            let VBO = this.VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            let v = new Float32Array(this.vertices);
            gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);

            var aPos = gl.getAttribLocation(program, 'aPos');
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 6 * v.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(aPos);

            var aTexCoord = gl.getAttribLocation(program, 'aNormal');
            gl.vertexAttribPointer(aTexCoord, 3, gl.FLOAT, false, 6 * v.BYTES_PER_ELEMENT, 3 * v.BYTES_PER_ELEMENT);
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

        public angle: number = 0;

        public VBO;



        public cameraPos = vec3.fromValues(0, 0, 3);
        public cameraFront = vec3.fromValues(0.0, 0.0, -1.0);
        public cameraUp = vec3.fromValues(0.0, 1.0, 0.0);
        cameraSpeed = 0.2;

        public sensitivity = 0.005;

        lightPos = vec3.fromValues(1.0, 1.2, -2.0);

        yaw = 0;
        pitch = 0;

        public update() {
            let gl = this.work.gl;
            // this.work.pointer.enable = true;

            gl.enable(gl.DEPTH_TEST);

            gl.clearColor(0, 0, 0, 1.0);
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

            if (this.work.pointer.lock && this.work.pointer.update) {
                let front = vec3.create();
                let x = this.work.pointer.mx * this.sensitivity;
                let y = this.work.pointer.my * this.sensitivity;
                let yaw = this.yaw += x;
                let pitch = this.pitch += -y;

                if (pitch > 1.55)
                    pitch =this.pitch = 1.54;
                if (pitch < -1.55)
                    pitch = this.pitch = -1.54;
                front[0] = Math.cos(yaw) * Math.cos(pitch);
                front[1] = Math.sin(pitch);
                front[2] = Math.sin(yaw) * Math.cos(pitch);

                vec3.normalize(this.cameraFront, front);
                this.work.pointer.update = false;
            }

            if (this.key_status.w) {
                this.cameraPos[0] += this.cameraFront[0] * this.cameraSpeed;
                this.cameraPos[1] += this.cameraFront[1] * this.cameraSpeed;
                this.cameraPos[2] += this.cameraFront[2] * this.cameraSpeed;
            }

            if (this.key_status.s) {
                this.cameraPos[0] -= this.cameraFront[0] * this.cameraSpeed;
                this.cameraPos[1] -= this.cameraFront[1] * this.cameraSpeed;
                this.cameraPos[2] -= this.cameraFront[2] * this.cameraSpeed;
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
            this.shader.setVec3('lightPos', this.lightPos);
            this.shader.setVec3('viewPos', this.cameraPos);
            gl.drawArrays(gl.TRIANGLES, 0, 36);


            //lamp
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
