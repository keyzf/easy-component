"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//创建唯一id
function createID() {
    return Math.random()
        .toString(36)
        .substring(2, 9);
}
exports.createID = createID;
