const Api = require("../../config/shoonya-config/RestApi");
let { authparams } = require("../../config/shoonya-config/cred");

const shoonyaLogin = async () => {
    try {
        const api = new Api({});
        const login = await api.login(authparams);

        if (login.stat !== "Ok") {
            return { status: "fail", message: "Shoonya API Login Failed" };
        }

        return { status: "success", message: "Shoonya API successfully", api };
    } catch (err) {
        console.error("Error during Shoonya login:", err);
        return { status: "fail", message: "Shoonya API Login Failed by the catch" };
    }
};

module.exports = shoonyaLogin;
