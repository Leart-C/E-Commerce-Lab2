﻿namespace backend.Core.Dtos.Auth
{
    public class LoginServiceResponseDto
    {
        public string NewToken { get; set; }
        public string RefreshToken { get; set; }
        public UserInfoResult UserInfo { get; set; }
    }
}
