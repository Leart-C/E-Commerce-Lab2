using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.Order;
using backend.Core.Dtos.Payment;
using backend.Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PaymentController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
    {
        var payment = await _context.Payments.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<PaymentDto>>(payment));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentDto>> GetPayment(int id)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null) return NotFound();

        return Ok(_mapper.Map<PaymentDto>(payment));
    }

    [HttpPost]
    public async Task<ActionResult> CreatePayment(PaymentDto dto)
    {
        var payment = _mapper.Map<Payment>(dto);
        payment.CreatedAt = DateTime.UtcNow;

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, _mapper.Map<PaymentDto>(payment));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePayment(int id, PaymentDto dto)
    {


        var payment = await _context.Payments.FindAsync(id);
        if (payment == null) return NotFound();

        _mapper.Map(dto, payment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePayment(int id)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null) return NotFound();

        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
