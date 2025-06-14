﻿using backend.Core.Constants;
using backend.Core.Dtos.Auth;
using backend.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        //Route->Seed Roles to DB
        [HttpPost]
        [Route("seed-roles")]
        public async Task<IActionResult> SeedRoles()
        {
            var seedResult = await _authService.SeedRolesAsync();
            return StatusCode(seedResult.StatusCode, seedResult.Message);
        }

        //Route-> Register
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var registerResult = await _authService.RegisterAsync(registerDto);
            return StatusCode(registerResult.StatusCode, registerResult.Message);
        }

        //Route->Login
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<LoginServiceResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var loginResult = await _authService.LoginAsync(loginDto);

            if(loginResult is null)
            {
                return Unauthorized("Your credentials are invalid.Please contact to an Admin");
            }
            return Ok(loginResult);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromHeader(Name = "refresh-token")] string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Refresh token is required");
            }

            var result = await _authService.LogOutAsync(refreshToken);

            if (!result.IsSucceed)
            {
                return StatusCode(result.StatusCode, result.Message);
            }

            return Ok(result.Message);
        }

        //Route-> Update User Role

        //An OWNER can change everything

        //An Admin can change just User to Manager or reverse

        //Manager and User Roles don't have access to this Route
        [HttpPost]
        [Route("update-role")]
        [Authorize(Roles =StaticUserRoles.OwnerAdmin)]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleDto updateRoleDto)
        {
            var updateRoleResult = await _authService.UpdateRoleAsync(User, updateRoleDto);

            if (updateRoleResult.IsSucceed)
            {
                return Ok(updateRoleResult.Message);
            }
            else
            {
                return StatusCode(updateRoleResult.StatusCode, updateRoleResult.Message);
            }
        }

        //Route-> getting data of a user from its JWT
        [HttpPost]
        [Route("me")]
        public async Task<ActionResult<LoginServiceResponseDto>> Me([FromBody] MeDto token)
        {
            try
            {
                var me = await _authService.MeAsync(token);
                if(me is not null)
                {
                    return Ok(me);
                }
                else
                {
                    return Unauthorized("InvalidToken");
                }
            }
            catch (Exception)
            {
                return Unauthorized("InvalidToken");
            }
        }

        //Route->List of all users with details
        [HttpGet]
        [Route("users")]
        public async Task<ActionResult<IEnumerable<UserInfoResult>>> GetUsersList()
        {
            var usersList = await _authService.GetUsersListAsync();

            return Ok(usersList);
        }

        //Route ->Get a User by UserName

        [HttpGet]
        [Route("users/{userName}")]
        public async Task<ActionResult<UserInfoResult>> GetUserDetailsByUserName([FromRoute] string userName)
        {
            var user = await _authService.GetUserDetailsByUserNameAsync(userName);
            if(user is not null)
            {
                return Ok(user);
            }
            else
            {
                return NotFound("UserName not found");
            }
        }

        // Route -> Refresh Token
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromHeader(Name = "refreshToken")] string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("Refresh token is missing.");

            var tokenResult = await _authService.RefreshAccessTokenAsync(refreshToken);

            if (tokenResult == null)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            return Ok(new
            {
                AccessToken = tokenResult.AccessToken,
                RefreshToken = tokenResult.RefreshToken
            });
        }
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<LoginServiceResponseDto>> Me()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                    return Unauthorized("NoToken");

                var token = authHeader.Replace("Bearer ", "");
                var me = await _authService.MeAsync(new MeDto { Token = token });

                if (me is not null)
                    return Ok(me);

                return Unauthorized("InvalidToken");
            }
            catch
            {
                return Unauthorized("InvalidToken");
            }
        }






    }
}
