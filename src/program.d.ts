declare const work: MyWork;

declare module "*.vert" {
    const value: string;
    export default value;
}

declare module "*.frag" {
    const value: string;
    export default value;
}