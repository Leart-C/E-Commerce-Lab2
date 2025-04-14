using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend.Core.Entities;
using backend.data;
using AutoMapper;
using backend.Core.Dtos.Category.backend.Core.Dto;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IMongoCollection<Category>? _categories;
        private readonly MongoDbService _mongoDbService;
        private readonly IMapper _mapper;

        public CategoryController(MongoDbService mongoDbService, IMapper mapper)
        {
            _mongoDbService = mongoDbService;
            _categories = _mongoDbService.Database?.GetCollection<Category>("categories");
            _mapper = mapper;
        }

        // ✅ Krijo një kategori
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto dto)
        {
            var category = _mapper.Map<Category>(dto);
            await _categories.InsertOneAsync(category);
            var resultDto = _mapper.Map<CategoryDto>(category);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, resultDto);
        }

        // ✅ Merr një kategori nga Id
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetById(string id)
        {
            var category = await _categories.Find(x => x.Id == id).FirstOrDefaultAsync();

            if (category is null)
                return NotFound("Category not found");

            return Ok(_mapper.Map<CategoryDto>(category));
        }

     
        [HttpGet]
        public async Task<IEnumerable<Category>> GetAll()
        {
            return await _categories.Find(FilterDefinition<Category>.Empty).ToListAsync();
        }

        // ✅ Përditëso një kategori
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryDto dto)
        {
            var updatedCategory = _mapper.Map<Category>(dto);
            updatedCategory.Id = id;

            var result = await _categories.ReplaceOneAsync(
                Builders<Category>.Filter.Eq(x => x.Id, id),
                updatedCategory
            );

            if (result.MatchedCount == 0)
                return NotFound("Category not found");

            return NoContent();
        }

        // ✅ Fshi një kategori
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var result = await _categories.DeleteOneAsync(x => x.Id == id);

            if (result.DeletedCount == 0)
                return NotFound("Category not found");

            return NoContent();
        }
    }
}