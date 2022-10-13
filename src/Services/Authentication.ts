import jwt, { Jwt } from 'jsonwebtoken'
import jwtPayloadInfoDTO from '../DTO/input/PayloadDTO';
import express from 'express'

export default class Authentication{
    private secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET?.toString() || "";
    }

    generateToken(payloadInfo: jwtPayloadInfoDTO): string {
        const secret: string = process.env.JWT_SECRET?.toString() || "";
        const token = jwt.sign(payloadInfo, secret, {expiresIn: 3600});
        return token;
    }
    
    validateToken(token: string): jwtPayloadInfoDTO | void {
        return jwt.verify(token, this.secret, (err, decoded) => {
            if (err) return false;
            const decoded_data = JSON.parse(JSON.stringify(decoded));
            return decoded_data;
        });
    }
        
        // accept(req, res) {
            //     res.send('ok');
            //  };
            // deny() { };
            
}
