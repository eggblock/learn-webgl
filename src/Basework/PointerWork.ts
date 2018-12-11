class PointerWork extends HomeWork {
    public work: MyWork;
    public width = 1280;
    public height = 720;
    public name: string;

    public pointer: boolean = true;

    public key_status = {
        w: false,
        a: false,
        s: false,
        d: false
    }
    
    public cameraPos = vec3.fromValues(0, 0, 3);
    public cameraFront = vec3.fromValues(0.0, 0.0, -1.0);
    public cameraUp = vec3.fromValues(0.0, 1.0, 0.0);
    public cameraSpeed = 0.2;

    public sensitivity = 0.005;
    public yaw = 0;
    public pitch = 0;


    public init() {
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


    public update() {
        if (this.work.pointer.lock && this.work.pointer.update) {
            let front = vec3.create();
            let x = this.work.pointer.mx * this.sensitivity;
            let y = this.work.pointer.my * this.sensitivity;
            let yaw = this.yaw += x;
            let pitch = this.pitch += -y;

            if (pitch > 1.55)
                pitch = this.pitch = 1.54;
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
    }
}

