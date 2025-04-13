using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend.data;
using backend.Core.Entities;
using backend.Core.Dtos.OrderItem;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using backend.Core.DbContext;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IMongoCollection<OrderItem> _orderItem;
        private readonly ApplicationDbContext _dbContext; // MSSQL
        private readonly IMapper _mapper;

        public OrderItemController(MongoDbService mongoDbService, ApplicationDbContext dbContext, IMapper mapper)
        {
            _orderItem = mongoDbService.Database.GetCollection<OrderItem>("orderItem");
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<OrderItem>> GetAll()
        {
            return await _orderItem.Find(FilterDefinition<OrderItem>.Empty).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItem>> GetById(string id)
        {
            var item = await _orderItem.Find(x => x.Id == id).FirstOrDefaultAsync();
            return item is not null ? Ok(item) : NotFound();
        }

        [HttpGet("order/{orderId}")]
        public async Task<ActionResult<IEnumerable<OrderItem>>> GetByOrderId(int orderId)
        {
            var items = await _orderItem.Find(x => x.OrderId == orderId).ToListAsync();
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderItemDto dto)
        {
            var orderExists = await _dbContext.Orders.AnyAsync(o => o.Id == dto.OrderId);
            if (!orderExists)
                return BadRequest($"Order with ID {dto.OrderId} does not exist.");

            var item = _mapper.Map<OrderItem>(dto);
            await _orderItem.InsertOneAsync(item);

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut]
        public async Task<IActionResult> Update(OrderItem item)
        {
            var filter = Builders<OrderItem>.Filter.Eq(x => x.Id, item.Id);
            var result = await _orderItem.ReplaceOneAsync(filter, item);
            return result.IsAcknowledged && result.ModifiedCount > 0
                ? Ok("Order Item updated successfully")
                : NotFound("Order Item not found");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _orderItem.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0
                ? Ok("Order Item deleted successfully")
                : NotFound("Order Item not found");
        }
    }
}
