"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDLibrary = exports.IdGenerator = void 0;
const uuidv4_1 = require("uuidv4");
class IdGenerator {
    generate() {
        return 'dummytest_changelatter';
    }
    ;
}
exports.IdGenerator = IdGenerator;
class UUIDLibrary extends IdGenerator {
    constructor() {
        super();
    }
    generate() {
        return (0, uuidv4_1.uuid)();
    }
}
exports.UUIDLibrary = UUIDLibrary;
