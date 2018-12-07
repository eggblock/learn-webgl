class Shader {
    constructor() {


    }

    public gl: WebGLRenderingContext = null;
    public ID: WebGLProgram = null;

    static async create(vertsrc: string, fragsrc: string, gl: WebGLRenderingContext) {
        let shader = new Shader();


        shader.gl = gl;

        let ID = gl.createProgram();
        shader.ID = ID;
        let vert = await $.get(vertsrc);
        let frag = await $.get(fragsrc);

        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, vert);
        gl.shaderSource(fragmentShader, frag);

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
        gl.attachShader(ID, vertexShader);
        gl.attachShader(ID, fragmentShader);

        gl.linkProgram(ID);
        if (!gl.getProgramParameter(ID, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(ID);
            throw 'Could not compile WebGL program. \n\n' + info;
        }

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);


        return shader;
    }

    public use() {
        this.gl.useProgram(this.ID);
    }


    public setBool(name: string, value: boolean) {
        var local = this.gl.getUniformLocation(this.ID, name);
        this.gl.uniform1i(local, ~~value);
    }

    public setInt(name: string, value: number) {
        var local = this.gl.getUniformLocation(this.ID, name);
        this.gl.uniform1i(local, value);
    }

    public setFloat(name: string, value: number) {
        var local = this.gl.getUniformLocation(this.ID, name);
        this.gl.uniform1f(local, value);
    }

    public setVec3(name: string, value: vec3 | number[]) {
        var local = this.gl.getUniformLocation(this.ID, name);
        this.gl.uniform3fv(local, value);
    }


    public setMat4(name: string, value: mat4) {
        var local = this.gl.getUniformLocation(this.ID, name);
        this.gl.uniformMatrix4fv(local, false, value);
    }


    // public setAttr(name: string,value: any);
}