using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.Order;
using backend.Core.Dtos.PaymentMethod;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public OrderController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
    {
        var orders = await _context.Orders.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<OrderDto>>(orders));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        return Ok(_mapper.Map<OrderDto>(order));
    }

    [HttpPost]
    public async Task<ActionResult> CreateOrder(OrderDto dto)
    {
        var order = _mapper.Map<Order>(dto);
        order.CreatedAt = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, _mapper.Map<OrderDto>(order));
    }

    [HttpPut ("{id}")]
    public async Task<IActionResult> UpdateOrder([FromBody] OrderDto dto)
    {
        var order = await _context.Orders.FindAsync(dto.Id);
        if (order == null) return NotFound();

        _mapper.Map(dto, order);
        await _context.SaveChangesAsync();

        return Ok("Order Updated Successfully");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
