namespace Work.Lighting {
    export class Map extends PointerWork {
        public readonly vertices = [
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0,
            0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 0.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0,
            0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 1.0, 1.0,
            -0.5, 0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 1.0,
            -0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.0, 0.0,

            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,
            0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 1.0, 1.0,
            -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0,
            -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,

            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 1.0, 0.0,
            -0.5, 0.5, -0.5, -1.0, 0.0, 0.0, 1.0, 1.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0,
            -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0,
            -0.5, -0.5, 0.5, -1.0, 0.0, 0.0, 0.0, 0.0,
            -0.5, 0.5, 0.5, -1.0, 0.0, 0.0, 1.0, 0.0,

            0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 1.0, 1.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0,
            0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0,
            0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0,
            0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,

            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0,
            0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 1.0, 1.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0,
            0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 1.0, 0.0,
            -0.5, -0.5, 0.5, 0.0, -1.0, 0.0, 0.0, 0.0,
            -0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.0, 1.0,

            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
            0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
            -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 0.0,
            -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0
        ];

        public shader: Shader;
        public lampshader: Shader;

        public program: WebGLProgram;
        public VBO: WebGLBuffer;


        public lightPos = vec3.fromValues(1.0, 1.2, -2.0);

        async init() {
            super.init();
            let gl = this.work.gl;
            this.lampshader = await Shader.create('./glsl/transfromations2.vert', './glsl/colors.lamp.frag', gl);
            let shader: Shader = this.shader = await Shader.create('./glsl/lighting/map.vert', './glsl/lighting/map.frag', gl);

            let program = this.program = shader.ID;


            let VBO = this.VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            let v = new Float32Array(this.vertices);
            gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);

            var aPos = gl.getAttribLocation(program, 'aPos');
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 8 * v.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(aPos);

            var aNormal = gl.getAttribLocation(program, 'aNormal');
            gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 8 * v.BYTES_PER_ELEMENT, 3 * v.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(aNormal);

            var aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
            gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 8 * v.BYTES_PER_ELEMENT, 6 * v.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(aTexCoord);



            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        }

        update() {
            super.update();

            let gl = this.work.gl;

            gl.enable(gl.DEPTH_TEST);

            gl.clearColor(0, 0, 0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);


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

            this.shader.setVec3("material.ambient", vec3.fromValues(1.0, 0.5, 0.31));
            this.shader.setVec3("material.diffuse", vec3.fromValues(1.0, 0.5, 0.31));
            this.shader.setVec3("material.specular", vec3.fromValues(0.5, 0.5, 0.5));
            this.shader.setFloat("material.shininess", 32.0);

            this.shader.setVec3("light.ambient", vec3.fromValues(0.2, 0.2, 0.2));
            this.shader.setVec3("light.diffuse", vec3.fromValues(0.5, 0.5, 0.5));
            this.shader.setVec3("light.specular", vec3.fromValues(1.0, 1.0, 1.0));
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