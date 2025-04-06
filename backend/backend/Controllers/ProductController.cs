using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend.data;
using backend.Core.Entities;
using backend.Core.Dtos.Product;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IMongoCollection<Product>? _product;
        private readonly IMapper _mapper;
        private readonly MongoDbService _mongoDbService;

        public ProductController(MongoDbService mongoDbService, IMapper mapper)
        {
            _product = mongoDbService.Database?.GetCollection<Product>("product");
            _mapper = mapper;
            _mongoDbService = mongoDbService;
        }

        [HttpGet]
        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _product.Find(FilterDefinition<Product>.Empty).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(string id) 
        { 
            var filter = Builders<Product>.Filter.Eq(x => x.Id, id);
            var product = _product.Find(filter).FirstOrDefault();
            return product is not null ? Ok(product) : NotFound();
        }


        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var product = _mapper.Map<Product>(dto);
            product.UserId = userId; // vendos automatikisht nga JWT

            await _product.InsertOneAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut]
        public async Task<ActionResult> Update(Product product)
        {
            var filter = Builders<Product>.Filter.Eq(x => x.Id, product.Id);
            await _product.ReplaceOneAsync(filter, product);
            return Ok("Product Updated Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id) 
        {
        var filter = Builders<Product>.Filter.Eq(x => x.Id, id);
            await _product.DeleteOneAsync(filter);
            return Ok("Product Deleted Successfully");
        }
    }
}
