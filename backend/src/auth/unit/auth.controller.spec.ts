import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refresh: jest.fn(),
            me: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.register', async () => {
    const dto: RegisterDto = { email: 'test@example.com', password: '123456', name: 'Test' };
    authService.register.mockResolvedValue({ access_token: 'token', refresh_token: 'token' });

    const result = await controller.register(dto);
    expect(result).toEqual({ access_token: 'token', refresh_token: 'token' });
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('should call AuthService.login', async () => {
    const dto: LoginDto = { email: 'test@example.com', password: '123456' };
    authService.validateUser.mockResolvedValue({ id: 1 });
    authService.login.mockResolvedValue({ access_token: 'token', refresh_token: 'token' });

    const result = await controller.login(dto);

    expect(result).toEqual({ access_token: 'token', refresh_token: 'token' });
    expect(authService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
    expect(authService.login).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });
});
