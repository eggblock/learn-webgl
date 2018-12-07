class ImageUtils {
    public static async load(url: string) {
        return new Promise<HTMLImageElement>((res, rej) => {
            let i = new Image();
            i.src = url;
            i.onload = () => {
                res(i);
            }
            i.onerror = () => {
                rej(i);
            }
        });
    }
}