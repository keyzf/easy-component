//创建唯一id
export function createID() {
    return Math.random()
        .toString(36)
        .substring(2, 9);
}
