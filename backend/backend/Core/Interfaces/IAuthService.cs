using backend.Core.Dtos;
using backend.Core.Dtos.Auth;
using backend.Core.Dtos.Generals;
using System.Security.Claims;

namespace backend.Core.Interfaces
{
    public interface IAuthService
    {
        Task<GeneralServiceResponseDto> SeedRolesAsync();
        Task<GeneralServiceResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<LoginServiceResponseDto?>LoginAsync(LoginDto loginDto);
        Task<GeneralServiceResponseDto> LogOutAsync(string refreshToken);
        Task<GeneralServiceResponseDto> UpdateRoleAsync(ClaimsPrincipal User, UpdateRoleDto updateRoleDto);
        Task<LoginServiceResponseDto?> MeAsync(MeDto meDto);
        Task<IEnumerable<UserInfoResult>>GetUsersListAsync();
        Task<UserInfoResult> GetUserDetailsByUserNameAsync(string userName);
        Task<IEnumerable<string>> GetUsernamesListAsync();
        Task<TokenResponseDto?> RefreshAccessTokenAsync(string refreshToken);

    }
}
