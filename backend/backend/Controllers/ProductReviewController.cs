using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend.Core.Entities;
using backend.Core.Dtos.ProductReview;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductReviewController : ControllerBase
    {
        private readonly IMongoCollection<ProductReview>? _productReview;
        private readonly IMapper _mapper;
        private readonly MongoDbService _mongoDbService;

        public ProductReviewController(MongoDbService mongoDbService, IMapper mapper)
        {
            _productReview = mongoDbService.Database?.GetCollection<ProductReview>("productReview");
            _mapper = mapper;
            _mongoDbService = mongoDbService;
        }

        // Krijimi i një review për një produkt
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ProductReviewCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;  // Përdoruesi i lidhur nga JWT
            var productReview = _mapper.Map<ProductReview>(dto);
            productReview.UserId = userId; // Vendos id-në e përdoruesit
            productReview.CreatedAt = DateTime.Now; // Vendos datën e krijimit

            // Krijo një review të ri për produktin në MongoDB
            await _productReview.InsertOneAsync(productReview);
            return CreatedAtAction(nameof(GetById), new { id = productReview.Id }, productReview);
        }

        // Merrni review për një produkt të caktuar
        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductReview>>> GetByProductId(string productId)
        {
            var filter = Builders<ProductReview>.Filter.Eq(x => x.ProductId, productId);
            var reviews = await _productReview.Find(filter).ToListAsync();
            if (reviews == null || reviews.Count == 0)
                return NotFound("No reviews found for this product.");

            return Ok(reviews);
        }

        // Merrni review për një përdorues të caktuar
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ProductReview>>> GetByUserId(string userId)
        {
            var filter = Builders<ProductReview>.Filter.Eq(x => x.UserId, userId);
            var reviews = await _productReview.Find(filter).ToListAsync();
            if (reviews == null || reviews.Count == 0)
                return NotFound("No reviews found for this user.");

            return Ok(reviews);
        }

        // Merrni një review të caktuar
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReview>> GetById(string id)
        {
            var filter = Builders<ProductReview>.Filter.Eq(x => x.Id, id);
            var review = await _productReview.Find(filter).FirstOrDefaultAsync();

            if (review is null)
                return NotFound();
            return Ok(review);
        }
    }
}