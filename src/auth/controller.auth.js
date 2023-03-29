import CustomRouter from "../router/CustomRouter.js";
import User from "../dao/mongoDB/models/user.model.js";
import { isValidPassword } from "../utils/passwordEncryptor.js";
import { authToken, generateToken } from "../utils/jwt.utils.js";

class AuthRouter extends CustomRouter {
    init () {

        this.post('/', async (req, res) => {

            try {
                const { email, password } = req.body;

                const user = await User.findOne({email});
                if(!user) return res.sendUserError('El usuario y la contraseña no coinciden');
                if(!isValidPassword(user, password)) return res.sendUserError('El usuario y la contraseña no coinciden');

                const data = {
                    email,
                    role: user.role
                }

                let token = generateToken(data);
                res.cookie('authToken', token, {maxAge: 60000, httpOnly: true}).json({message: 'Sesión iniciada'});

            } catch(error) {
                console.log(error);
                res.sendServerError(`Internal Server error. ${error}`);
            }
        })
    }
}

export default AuthRouter;
