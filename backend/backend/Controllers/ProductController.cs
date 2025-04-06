using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend.data;
using backend.Core.Entities;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IMongoCollection<Product>? _product;
        public ProductController(MongoDbService mongoDbService) {
            _product = mongoDbService.Database?.GetCollection<Product>("product");
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
        public async Task<ActionResult> Create(Product product) 
        {
        await _product.InsertOneAsync(product);
        return CreatedAtAction(nameof(GetById), new {id = product.Id}, product);
        }

        [HttpPut]
        public async Task<ActionResult> Update(Product product)
        {
            var filter = Builders<Product>.Filter.Eq(x => x.Id, product.Id);
            await _product.ReplaceOneAsync(filter, product);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id) 
        {
        var filter = Builders<Product>.Filter.Eq(x => x.Id, id);
            await _product.DeleteOneAsync(filter);
            return Ok();
        }
    }
}
