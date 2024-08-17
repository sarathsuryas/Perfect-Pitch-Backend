import { UserAuthenticationGuard } from './user-authentication.guard';

describe('UserAuthenticationGuard', () => {
  it('should be defined', () => {
    expect(new UserAuthenticationGuard()).toBeDefined();
  });
});
