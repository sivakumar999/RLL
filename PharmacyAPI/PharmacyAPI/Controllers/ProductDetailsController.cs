using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Context;
using PharmacyAPI.Models;


namespace ProductApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductDetailsController : Controller
    {
        private readonly AppDbContext _context;
        public ProductDetailsController(AppDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ProductDetails>>> getProduct()
        {
            return Ok(await _context.ProductDetails.ToListAsync());
        }


        [HttpPost]
        public async Task<ActionResult<List<ProductDetails>>> CreateProduct(ProductDetails prod)
        {
            _context.ProductDetails.Add(prod);
            await _context.SaveChangesAsync();
            return Ok(await _context.ProductDetails.ToListAsync());
        }

        [HttpPut]
        public async Task<ActionResult<List<ProductDetails>>> UpdateProduct(ProductDetails prod)
        {
            var dbprod = await _context.ProductDetails.FindAsync(prod.ProductId);
            if (dbprod == null)
            {
                return BadRequest("Hero not found");
            }
            dbprod.ProductId = prod.ProductId;
            dbprod.ProductUrl = prod.ProductUrl;
            dbprod.ProductName = prod.ProductName;

            dbprod.ProductDescription = prod.ProductDescription;

            dbprod.ProductInStock = prod.ProductInStock;

            dbprod.ProductPrice = prod.ProductPrice;
            await _context.SaveChangesAsync();

            return (await _context.ProductDetails.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<ProductDetails>>> DeleteProduct(int id)
        {
            var dbprod = await _context.ProductDetails.FindAsync(id);
            if (dbprod == null)
            {
                return BadRequest("Product not found");

            }

            _context.ProductDetails.Remove(dbprod);
            await _context.SaveChangesAsync();

            return Ok(await _context.ProductDetails.ToListAsync());
        }

        
    }
}