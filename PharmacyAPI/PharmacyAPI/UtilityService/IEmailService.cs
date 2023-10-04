using System;
using PharmacyAPI.Models;

namespace PharmacyAPI.UtilityService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
