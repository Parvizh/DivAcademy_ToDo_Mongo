import { JwtPayloadDto } from "../../dto/jwtPayload.dto";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadDto
        }
    }
}