class HomeWork {
    public work: MyWork;
    public width: number = 300;
    public height: number = 300;
    public name: string;
    public pointer: boolean = false;
    constructor(name: string) {
        this.name = name;
        this.work = work;
        WorkManager.getInstance().addWork(name, this);
    }
    public init() { }
    public update() { }
    public destroy() { }
}

