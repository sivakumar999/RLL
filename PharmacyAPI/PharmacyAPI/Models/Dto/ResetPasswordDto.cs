namespace PharmacyAPI.Models.Dto
{
    public record ResetPasswordDto
    {
        public string Email { get; set; }
        public string Emailtoken { get; set; }
        public string NewPassword {get; set; }
        public string confirmPassword {get; set; }
    }
}
