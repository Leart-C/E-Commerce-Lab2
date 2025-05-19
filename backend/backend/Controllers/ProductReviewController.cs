using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend.Core.Entities;
using backend.Core.Dtos.ProductReview;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.data;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductReviewController : ControllerBase
    {
        private readonly IMongoCollection<ProductReview>? _productReview;
        private readonly IMapper _mapper;
        private readonly MongoDbService _mongoDbService;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProductReviewController(MongoDbService mongoDbService, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _productReview = mongoDbService.Database?.GetCollection<ProductReview>("productReview");
            _mapper = mapper;
            _mongoDbService = mongoDbService;
            _userManager = userManager;
        }

        // Krijimi i një review për një produkt


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ProductReviewCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var productReview = _mapper.Map<ProductReview>(dto);
            productReview.UserId = userId;
            productReview.CreatedAt = DateTime.Now;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return BadRequest("User not found");

            // DENORMALIZIM 🔥
            productReview.UserInfo = new ProductReview.ReviewUserInfo
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };

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
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(string id, [FromBody] ProductReviewCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var existingReview = await _productReview.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (existingReview == null) return NotFound("Review not found");
            if (existingReview.UserId != userId) return Forbid("You can only update your own reviews");

            existingReview.ReviewText = dto.ReviewText;
            existingReview.Rating = dto.Rating;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return BadRequest("User not found");

            // Rifresko UserInfo 🔁
            existingReview.UserInfo = new ProductReview.ReviewUserInfo
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };

            var filter = Builders<ProductReview>.Filter.Eq(r => r.Id, id);
            await _productReview.ReplaceOneAsync(filter, existingReview);
            return Ok("Review updated successfully");
        }
     
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var review = await _productReview.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (review == null) return NotFound("Review not found");

            if (review.UserId != userId)
                return Forbid("You are not authorized to delete this review");

            var result = await _productReview.DeleteOneAsync(r => r.Id == id);
            if (result.DeletedCount == 0)
                return StatusCode(500, "Failed to delete review");

            return Ok("Review deleted successfully");
        }
    }
}