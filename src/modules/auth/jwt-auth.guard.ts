import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { SECRET } from './consts/secret.const';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

