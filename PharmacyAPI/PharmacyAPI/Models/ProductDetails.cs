using System.ComponentModel.DataAnnotations;

namespace PharmacyAPI.Models
{
    public class ProductDetails
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductUrl { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
            = string.Empty;
        public int ProductInStock { get; set; }
        public int ProductPrice { get; set; }
    }
}
