import {NextFunction, Request, Response} from 'express'
import OutputCadastrarDTO from '../DTO/output/cadastrar';
import Authentication from '../Services/Authentication';

export async function ProtectionAgainstAuthenticatedUsers(req: Request, res: Response, next: NextFunction) {
    const tokenSent = req.headers['authorization']
    if (!tokenSent) return next();
    const authentication = new Authentication();
    const userTokenFormated = authentication.validateToken(tokenSent);
    if (!userTokenFormated) return next();
    const outputData = new OutputCadastrarDTO("User is already authenticated", 401, true)
    return res.json(outputData);
}

export async function ProtectionAgainstNonAuthenticatedUsers (req: Request, res: Response, next: NextFunction) {
    const tokenSent = req.headers['authorization'];
    const outputData = new OutputCadastrarDTO("Permission denied, please login to use this resource", 403, true);
    if (!tokenSent) return res.json(outputData);
    const authentication = new Authentication();
    const userTokenFormated = authentication.validateToken(tokenSent);
    if (!userTokenFormated) return res.json(outputData);
    res.locals.userInfo = userTokenFormated;
    next();
}
