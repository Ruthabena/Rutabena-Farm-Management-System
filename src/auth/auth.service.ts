import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  AUTH_MESSAGES,
  BCRYPT_SALT_ROUNDS,
  TOKEN_TYPE,
} from '../common/constants/auth.constants';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { sanitizeUser } from '../common/utils/user-sanitizer.util';
import { IUserRepository, USER_REPOSITORY } from '../users/domain/user-repository.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.users.findActiveByEmailWithTenant(dto.email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.role !== UserRole.SUPER_ADMIN && (!user.tenantId || !user.tenant?.isActive)) {
      throw new ForbiddenException(AUTH_MESSAGES.TENANT_INACTIVE);
    }

    const payload: AuthenticatedUser = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
    };

    const tokens = await this.generateTokens(payload);

    await this.users.setRefreshTokenHash(
      user.id,
      await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS),
      new Date(),
    );

    return { ...tokens, user: sanitizeUser(user) };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);

    const user = await this.users.findActiveById(payload.userId);

    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const tokens = await this.generateTokens({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
    });

    await this.users.setRefreshTokenHash(
      user.id,
      await bcrypt.hash(tokens.refreshToken, BCRYPT_SALT_ROUNDS),
    );

    return tokens;
  }

  async logout(userId: string) {
    await this.users.setRefreshTokenHash(userId, null);
    return { message: 'Logged out successfully.' };
  }

  async validateJwtUser(payload: AuthenticatedUser) {
    const user = await this.users.findActiveById(payload.userId);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    }

    return payload;
  }

  private async generateTokens(payload: AuthenticatedUser) {
    const accessToken = jwt.sign(payload, this.getAccessSecret(), {
      expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN') ?? '1d') as jwt.SignOptions['expiresIn'],
    });
    const refreshToken = jwt.sign(payload, this.getRefreshSecret(), {
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d') as jwt.SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken, tokenType: TOKEN_TYPE };
  }

  private verifyRefreshToken(token: string): AuthenticatedUser {
    try {
      return jwt.verify(token, this.getRefreshSecret()) as AuthenticatedUser;
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }

  private getAccessSecret(): string {
    return this.configService.get<string>('JWT_SECRET') ?? 'change-me';
  }

  private getRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'change-me-too';
  }
}
