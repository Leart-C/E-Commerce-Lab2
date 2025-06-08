using backend.Core.Entities;

namespace backend.Core.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(ApplicationUser user);
        string GenerateRefreshToken();
    }
}
