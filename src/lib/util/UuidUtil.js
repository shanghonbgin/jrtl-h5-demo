const uuid = require('uuid');
class UuidUtil {
    static uuid() {
        return uuid.v4();
    }
}
module.exports = UuidUtil;