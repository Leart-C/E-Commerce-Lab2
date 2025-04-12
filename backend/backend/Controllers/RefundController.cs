using AutoMapper;
using backend.Core.DbContext;
using backend.Core.Dtos.Refund;
using backend.Core.Dtos.Transaction;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RefundController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RefundController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RefundDto>>> GetRefundMethod()
        {
            var refundMethod = await _context.Refunds.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<RefundDto>>(refundMethod));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RefundDto>> GetRefundByIdMethod(int id)
        {
            var refundMethod = await _context.Refunds.FindAsync(id);
            if (refundMethod == null) return NotFound();

            return Ok(_mapper.Map<RefundDto>(refundMethod));
        }

        [HttpPost]
        public async Task<ActionResult> CreateRefundMethod(RefundDto dto)
        {
            var refundMethod = _mapper.Map<Refund>(dto);


            _context.Refunds.Add(refundMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRefundMethod), new { id = refundMethod.Id }, _mapper.Map<RefundDto>(refundMethod));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRefundMethod([FromBody] RefundDto dto)
        {
            var refundMethod = await _context.Refunds.FindAsync(dto.Id);
            if (refundMethod == null) return NotFound();

            _mapper.Map(dto, refundMethod);
            await _context.SaveChangesAsync();

            return Ok("Refund Updated Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRefundMethod(int id)
        {
            var refundMethod = await _context.Refunds.FindAsync(id);
            if (refundMethod == null) return NotFound();

            _context.Refunds.Remove(refundMethod);
            await _context.SaveChangesAsync();
            return Ok("Refund Deleted Successfully");
        }
    }
}
