class WorkManager {
    private static instance: WorkManager;
    public static getInstance() {
        if (!this.instance) this.instance = new WorkManager();
        return this.instance;
    }



    public list: HTMLSelectElement;
    public btn: HTMLButtonElement;

    public timerFunction: Function = null;


    public KeyDownFn: { [key: string]: Function } = {}
    public KeyUpFn: { [key: string]: Function } = {}

    constructor() {
        let self = this;
        this.list = document.querySelector("#list");
        this.btn = document.querySelector("#runit");
        this.btn.onclick = () => {
            let value = self.list.selectedOptions[0].value;
            if (!value) alert(`不存在${value}组件`);
            self.init(value);
        }


        this.render();

        document.body.addEventListener('keydown', (e) => {
            if (this.KeyDownFn[e.key]) this.KeyDownFn[e.key]();
        });

        document.body.addEventListener('keyup', (e) => {
            if (this.KeyUpFn[e.key]) this.KeyUpFn[e.key]();
        });


        this.resetPointer(work.view);
    }

    public keydown(key: string, fn: Function) {
        this.KeyDownFn[key] = fn;
    }

    public keyup(key: string, fn: Function) {
        this.KeyUpFn[key] = fn;
    }

    public render() {
        if (this.timerFunction) this.timerFunction();
        requestAnimationFrame(this.render.bind(this));
    }

    public WorkObjectPool: { [name: string]: HomeWork } = {};

    public addWork(name: string, WO: HomeWork) {
        this.WorkObjectPool[name] = WO;
        this.updateList();
    }


    public async init(name: string) {
        this.restore(this.WorkObjectPool[name].width, this.WorkObjectPool[name].height);
        await this.WorkObjectPool[name].init();
        if (this.WorkObjectPool[name].pointer) this.resetPointer(work.view);
        this.timerFunction = () => {
            this.WorkObjectPool[name].update();
        }
    }

    public start(index: number) {
        this.init(Object.keys(this.WorkObjectPool)[index]);
    }

    updateList() {
        let cnt = '';
        for (let i in this.WorkObjectPool) {
            cnt += `<option value="${i}">${i}</option>`;
        }
        this.list.innerHTML = cnt;
    }

    public restore(w: number, h: number) {
        w = w || 300;
        h = h || 300;
        this.KeyDownFn = {};
        this.KeyUpFn = {};
        let context = document.querySelector("#context");
        let id = `view-${Math.random().toString().replace('.', "")}`;
        context.innerHTML = `<canvas id="${id}" class="view" width="${w}" height="${h}"></canvas>`;
        console.log(id);
        delete work.view;
        this.delPointer(work.view);
        work.view = document.querySelector(`#${id}`);

        if (!work.view) {
            alert('不存在视图');
            return;
        }
        work.gl = <WebGLRenderingContext>work.view.getContext("webgl");
    }


    public onMousemove(e) {
        if (!work.pointer.enable) return;
        work.pointer.mx = e.movementX;
        work.pointer.my = e.movementY;
        work.pointer.update = true;
    }

    public onClick() {
        if (!work.pointer.enable) return;
        work.pointer.lock = true;
        work.view.requestPointerLock();
    }

    public onPointerLockChange() {
        console.log('change')
        if (document.pointerLockElement === work.view) {
            work.pointer.lock = true;
        } else {
            // document.exitPointerLock();
            work.pointer.lock = false;
        }
    }

    public delPointer(view) {
        if (!view) return;
        view.removeEventListener('mousemove', this.onMousemove);
        view.removeEventListener('click', this.onClick);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    }

    public resetPointer(view: any) {
        work.pointer = {
            mx: 0,
            my: 0,
            update: false,
            enable: false,
            lock: false
        }
        view.addEventListener('mousemove', this.onMousemove);
        view.addEventListener('click', this.onClick);
        document.addEventListener('pointerlockchange', this.onPointerLockChange);
    }
}