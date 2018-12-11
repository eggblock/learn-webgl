class MyWork {
    public view: HTMLCanvasElement;
    public gl: WebGLRenderingContext;


    public pointer: PointerInfo = {
        mx: 0,
        my: 0,
        update: false,
        enable: false,
        lock: false
    };
    constructor() {
        this.view = document.querySelector("#view");

        if (!this.view) {
            alert('不存在视图');
            return;
        }
        this.gl = <WebGLRenderingContext>this.view.getContext("webgl");
    }

    public init() {
        new WrokWithTriangle("Triangle");
        new WorkWithTextures("Textures");
        new WorkWithTextures2("Textures2");
        new WorkWithTransformations("Transformations");
        new WorkWithTransformations2("Transformations2");
        new WorkWithTransformations3("Transformations3");``
        new WorkWithCamera('Camera');
        new Work.intro.Camera2('Camera2');

        new Work.Lighting.Colors('Colors');
        new Work.Lighting.Lighting('Lighting');
        new Work.Lighting.LightingNormal('LightingNormal');
        new Work.Lighting.Material('Material');

    }

    public clear(indata: any) {
        let color = indata || [0.0, 0.5, 0.0, 1.0]
        let gl = this.gl;


        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
} 


interface PointerInfo {
    mx: number;
    my: number;
    update: boolean;
    enable: boolean;
    lock: boolean;
}